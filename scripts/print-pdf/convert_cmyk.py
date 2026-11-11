#!/usr/bin/env python3
"""RGB -> CMYK print conversion for the Remains book PDF.

Why not Ghostscript pdfwrite: GS 10.07's PDF interpreter drops text set in
Chromium's Type 3 subset fonts (measured: essay page 367 chars -> 12) and its
-dBlackVector forces saturated vector fills (rust #8A3C00) to K-only black.
This converter instead rewrites ONLY colour operators and image data with
pikepdf, leaving fonts, text and page structure byte-identical:
  - vector colours: sRGB -> output ICC via lcms (Pillow ImageCms),
    relative colorimetric; achromatic colours -> K-only (K from the ICC
    transform), pure black -> 0/0/0/100, white -> 0/0/0/0.
  - images: decoded, transformed embedded-profile -> output ICC
    (perceptual), re-encoded (JPEG q93 if source was DCT, else Flate).
  - PDF/X-4 output intent + XMP + docinfo grafted on; TrimBox = MediaBox.
"""
import io, os, sys, hashlib, zlib
import pikepdf
from pikepdf import parse_content_stream, unparse_content_stream
from PIL import Image, ImageCms

SRC = sys.argv[1]
DST = sys.argv[2]
ICC_PATH = sys.argv[3]

out_profile = ImageCms.getOpenProfile(ICC_PATH)
srgb_profile = ImageCms.createProfile('sRGB')

# ---- lcms transforms -------------------------------------------------------
vec_xform = ImageCms.buildTransformFromOpenProfiles(
    srgb_profile, out_profile, 'RGB', 'CMYK',
    renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC)
img_xform_cache = {}

def img_xform(src_profile_bytes):
    key = hashlib.md5(src_profile_bytes).hexdigest() if src_profile_bytes else 'srgb'
    if key not in img_xform_cache:
        sp = (ImageCms.getOpenProfile(io.BytesIO(src_profile_bytes))
              if src_profile_bytes else srgb_profile)
        img_xform_cache[key] = ImageCms.buildTransformFromOpenProfiles(
            sp, out_profile, 'RGB', 'CMYK',
            renderingIntent=ImageCms.Intent.PERCEPTUAL)
    return img_xform_cache[key]

def rgb_to_cmyk_vec(r, g, b):
    """Vector colour: relcol ICC; achromatic -> K-only."""
    if r == g == b:
        if r >= 0.999:
            return (0.0, 0.0, 0.0, 0.0)
        if r <= 0.001:
            return (0.0, 0.0, 0.0, 1.0)
        px = Image.new('RGB', (1, 1), (round(r * 255),) * 3)
        px = ImageCms.applyTransform(px, vec_xform)
        c, m, y, k = [v / 255 for v in px.getpixel((0, 0))]
        if k >= 0.35:                      # dark enough: K plate alone holds it
            return (0.0, 0.0, 0.0, round(k, 4))
        return (round(c, 4), round(m, 4), round(y, 4), round(k, 4))
    px = Image.new('RGB', (1, 1), (round(r * 255), round(g * 255), round(b * 255)))
    px = ImageCms.applyTransform(px, vec_xform)
    return tuple(round(v / 255, 4) for v in px.getpixel((0, 0)))

# Cache on the PDF's own (4-dp rounded) palette values
_cache = {}
def conv(r, g, b):
    key = (round(r, 4), round(g, 4), round(b, 4))
    if key not in _cache:
        _cache[key] = rgb_to_cmyk_vec(*key)
    return _cache[key]

# The output profile's own black point (measured via lcms relcol):
# RGB(0,0,0) -> C88 M79 Y74 K99, total ink 340% = GRACoL TAC limit.
# Used ONLY for large-area black fills (page grounds); black text and
# small elements stay K-only for registration.
RICH_BLACK = (0.8784, 0.7882, 0.7412, 0.9882)
PAGE_AREA = 612 * 792
LARGE_FILL = 0.35 * PAGE_AREA

pdf = pikepdf.open(SRC)
stats = {'rg': 0, 'g': 0, 'streams': 0, 'images': 0}

# ---- 1. images -------------------------------------------------------------
seen_img = set()
def convert_image(xo):
    if xo.objgen in seen_img:
        return
    seen_img.add(xo.objgen)
    cs = xo.get('/ColorSpace')
    prof_bytes = None
    if isinstance(cs, pikepdf.Array) and str(cs[0]) == '/ICCBased':
        prof_bytes = cs[1].read_bytes()
    elif cs is not None and str(cs) != '/DeviceRGB':
        raise RuntimeError(f'unexpected image colorspace {cs}')
    w, h = int(xo.Width), int(xo.Height)
    filt = str(xo.get('/Filter'))
    if filt == '/DCTDecode':
        im = Image.open(io.BytesIO(xo.read_raw_bytes())).convert('RGB')
    else:
        raw = xo.read_bytes()
        im = Image.frombytes('RGB', (w, h), raw)
    im = ImageCms.applyTransform(im, img_xform(prof_bytes))
    buf = io.BytesIO()
    if filt == '/DCTDecode':
        # Pillow writes CMYK JPEGs Adobe-style (samples inverted, APP14).
        # PDF renderers ignore APP14 and use /Decode (default = samples are
        # ink amounts), so pre-invert: the stored samples then equal the
        # true ink values and every PDF consumer renders them correctly.
        im = Image.merge('CMYK', [ch.point(lambda v: 255 - v) for ch in im.split()])
        im.save(buf, 'JPEG', quality=90, subsampling=2)
        xo.write(buf.getvalue(), filter=pikepdf.Name('/DCTDecode'))
    else:
        xo.write(zlib.compress(im.tobytes(), 6), filter=pikepdf.Name('/FlateDecode'))
    xo.ColorSpace = pikepdf.Name('/DeviceCMYK')
    if '/Decode' in xo:
        del xo.Decode
    stats['images'] += 1

def walk_images(res):
    if res is None:
        return
    if '/XObject' in res:
        for name, xo in res.XObject.items():
            st = str(xo.get('/Subtype'))
            if st == '/Image':
                convert_image(xo)
            elif st == '/Form':
                walk_images(xo.get('/Resources'))
    if '/Pattern' in res:
        for name, pat in res.Pattern.items():
            if isinstance(pat, pikepdf.Stream):
                walk_images(pat.get('/Resources'))

for page in pdf.pages:
    walk_images(page.get('/Resources'))

# ---- 2. content streams ----------------------------------------------------
done_streams = set()

def _mul(m1, m2):
    a, b, c, d, e, f = m1
    g, h, i, j, k, l = m2
    return (a * g + b * i, a * h + b * j, c * g + d * i,
            c * h + d * j, e * g + f * i + k, e * h + f * j + l)

def _xf(m, x, y):
    a, b, c, d, e, f = m
    return (a * x + c * y + e, b * x + d * y + f)

def rewrite_stream(owner):
    if owner.objgen in done_streams:
        return
    done_streams.add(owner.objgen)
    ops = parse_content_stream(owner)
    # pass 1: for each colour-setting op, the largest area it later fills
    ctm = (1, 0, 0, 1, 0, 0)
    stack = []
    path_pts = []
    colour_op_idx = None
    fill_area = {}
    for idx, (operands, op) in enumerate(ops):
        o = str(op)
        if o == 'q':
            stack.append(ctm)
        elif o == 'Q':
            ctm = stack.pop() if stack else ctm
        elif o == 'cm':
            m = tuple(float(x) for x in operands)
            ctm = _mul(m, ctm)
        elif o in ('rg', 'RG', 'g', 'G'):
            colour_op_idx = idx
        elif o in ('m', 'l'):
            path_pts.append(_xf(ctm, float(operands[0]), float(operands[1])))
        elif o == 'c':
            for j in (0, 2, 4):
                path_pts.append(_xf(ctm, float(operands[j]), float(operands[j + 1])))
        elif o in ('v', 'y'):
            for j in (0, 2):
                path_pts.append(_xf(ctm, float(operands[j]), float(operands[j + 1])))
        elif o == 're':
            x, y, w, h = (float(v) for v in operands)
            for cx, cy in ((x, y), (x + w, y), (x, y + h), (x + w, y + h)):
                path_pts.append(_xf(ctm, cx, cy))
        elif o in ('f', 'f*'):
            if path_pts and colour_op_idx is not None:
                xs = [p[0] for p in path_pts]; ys = [p[1] for p in path_pts]
                area = (max(xs) - min(xs)) * (max(ys) - min(ys))
                if area > fill_area.get(colour_op_idx, 0):
                    fill_area[colour_op_idx] = area
            path_pts = []
        elif o in ('S', 's', 'B', 'B*', 'b', 'b*', 'n', 'W', 'W*'):
            if o != 'W' and o != 'W*':
                path_pts = []
    # pass 2: emit with colour conversion
    new_ops = []
    for idx, (operands, op) in enumerate(ops):
        o = str(op)
        if o in ('rg', 'RG'):
            r, g, b = (float(x) for x in operands)
            if (r, g, b) == (0.0, 0.0, 0.0) and fill_area.get(idx, 0) >= LARGE_FILL:
                cmyk = RICH_BLACK
                stats['rich'] = stats.get('rich', 0) + 1
            else:
                cmyk = conv(r, g, b)
            new_ops.append((list(cmyk), pikepdf.Operator('k' if o == 'rg' else 'K')))
            stats['rg'] += 1
        elif o in ('g', 'G'):
            v = float(operands[0])
            if v == 0.0 and fill_area.get(idx, 0) >= LARGE_FILL:
                cmyk = RICH_BLACK
                stats['rich'] = stats.get('rich', 0) + 1
            else:
                cmyk = conv(v, v, v)
            new_ops.append((list(cmyk), pikepdf.Operator('k' if o == 'g' else 'K')))
            stats['g'] += 1
        elif o in ('sc', 'SC', 'scn', 'SCN', 'cs', 'CS'):
            if not (len(operands) >= 1 and str(operands[0]) == '/Pattern') \
               and not (len(operands) == 1 and isinstance(operands[0], pikepdf.Name)):
                raise RuntimeError(f'unhandled colour op {o} {operands}')
            new_ops.append((operands, op))
        else:
            new_ops.append((operands, op))
    data = unparse_content_stream(new_ops)
    if isinstance(owner, pikepdf.Page):
        owner.Contents = pdf.make_stream(data)
    else:
        owner.write(data)
    stats['streams'] += 1
    res = owner.get('/Resources')
    if res and '/XObject' in res:
        for name, xo in res.XObject.items():
            if str(xo.get('/Subtype')) == '/Form':
                rewrite_stream(xo)
    if res and '/Pattern' in res:
        for name, pat in res.Pattern.items():
            if isinstance(pat, pikepdf.Stream):
                rewrite_stream(pat)

for page in pdf.pages:
    rewrite_stream(page)

# ---- 3. boxes + print metadata --------------------------------------------
for page in pdf.pages:
    page.TrimBox = list(page.MediaBox)

icc_bytes = open(ICC_PATH, 'rb').read()
icc_stream = pdf.make_stream(icc_bytes)
icc_stream.N = 4
intent = pdf.make_indirect(pikepdf.Dictionary(
    Type=pikepdf.Name('/OutputIntent'),
    S=pikepdf.Name('/GTS_PDFX'),
    OutputCondition=pikepdf.String(os.environ.get('PRINT_ICC_CONDITION', 'GRACoL 2006 - commercial printing, coated')),
    OutputConditionIdentifier=pikepdf.String(os.environ.get('PRINT_ICC_IDENT', 'CoatedGRACoL2006')),
    Info=pikepdf.String(os.environ.get('PRINT_ICC_INFO', 'CoatedGRACoL2006.icc - GRACoL 2006 reference print condition, ISO 12647-2:2004')),
    DestOutputProfile=icc_stream,
))
pdf.Root.OutputIntents = pikepdf.Array([intent])
xmp = """<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about="" xmlns:pdfx="http://ns.adobe.com/pdfx/1.3/">
   <pdfx:GTS_PDFXVersion>PDF/X-4</pdfx:GTS_PDFXVersion>
  </rdf:Description>
  <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">Remains - Chun Wang - print</rdf:li></rdf:Alt></dc:title>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>""".encode('utf-8')
meta = pdf.make_stream(xmp)
meta.Type = pikepdf.Name('/Metadata')
meta.Subtype = pikepdf.Name('/XML')
pdf.Root.Metadata = meta
info = pdf.docinfo
info['/Title'] = 'Remains - Chun Wang - print'
info['/GTS_PDFXVersion'] = 'PDF/X-4'
info['/Trapped'] = pikepdf.Name('/False')

pdf.save(DST, object_stream_mode=pikepdf.ObjectStreamMode.disable,
         compress_streams=True)
pdf.close()
print('stats:', stats)
print('unique vector colours converted:', len(_cache))
for k in sorted(_cache):
    print('  RGB', k, '-> CMYK', _cache[k])

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Move, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getWatercolor, seriesList } from "@/lib/watercolors";

// ---------------------------------------------------------------------------
// Scale system: 1 three.js unit = 1 metre everywhere. Every dimension below
// is converted from inches with IN_M, so the framed piece, the sofa and the
// room stay in true proportion to each other at every print size.
// ---------------------------------------------------------------------------
const IN_M = 0.0254;

interface PrintSize {
  id: string;
  wIn: number;
  hIn: number;
}

// Preset print (image) sizes, portrait. 9 x 12 in is the size Residuals #1
// is sold at on its detail page; the others span the small-to-large range a
// buyer weighs against a sofa.
const PRINT_SIZES: PrintSize[] = [
  { id: "4x6", wIn: 4, hIn: 6 },
  { id: "5x7", wIn: 5, hIn: 7 },
  { id: "8x10", wIn: 8, hIn: 10 },
  { id: "9x12", wIn: 9, hIn: 12 },
  { id: "12x18", wIn: 12, hIn: 18 },
];

const MAT_W_IN = 2; // mat border on each side, when a mat is chosen
const FRAME_W_IN = 0.75; // frame moulding width on each side
const FRAME_DEPTH_M = 0.032;
const HANG_BOTTOM_M = 1.02; // bottom edge of the framed piece, above the floor

// Three-seat sofa at true scale: 84 in wide x 35 in deep x 34 in high,
// 18 in seat height. It never rescales; only the framed piece does.
const SOFA = {
  wIn: 84,
  dIn: 35,
  hIn: 34,
  seatHIn: 18,
  armHIn: 25,
  armWIn: 8,
  legHIn: 4,
  backGapM: 0.07, // gap between sofa back and the wall
};

const ROOM = { wallW: 5.6, wallH: 2.75, depth: 5.2 };

// Artworks offered in the preview: four portrait watercolors whose scans
// (all near 3:4) fill the preset sizes with only a small centred crop.
// Residuals #1 is not used: its only scans are photographs of the framed
// piece on a wall, which would show a frame inside the preview frame.
const ARTWORK_IDS = ["2", "3", "18", "19"] as const;

type FrameId = "white" | "black" | "oak";
const FRAME_STYLES: { id: FrameId; en: string; zh: string; hex: string }[] = [
  { id: "white", en: "White", zh: "白色", hex: "#f2efe9" },
  { id: "black", en: "Black", zh: "黑色", hex: "#171717" },
  { id: "oak", en: "Natural oak", zh: "天然橡木", hex: "#b08954" },
];

interface PreviewState {
  artworkId: string;
  frame: FrameId;
  hasMat: boolean;
  size: PrintSize;
}

function framedOuterIn(size: PrintSize, hasMat: boolean) {
  const extra = (hasMat ? MAT_W_IN * 2 : 0) + FRAME_W_IN * 2;
  return { wIn: size.wIn + extra, hIn: size.hIn + extra };
}

function fmtIn(v: number) {
  return `${Number.isInteger(v) ? v : v.toFixed(1)}`;
}

// Code-drawn textures (no external assets): floor planks, sofa weave, oak grain.
function canvasTexture(draw: (g: CanvasRenderingContext2D, s: number) => void, repeat = 1) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  draw(g, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function buildRoom(scene: THREE.Scene) {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe9e3d8, roughness: 0.96 });
  const sideMat = new THREE.MeshStandardMaterial({ color: 0xdfd7c9, roughness: 0.96 });
  const floorTex = canvasTexture((g, s) => {
    g.fillStyle = "#9a7d5f";
    g.fillRect(0, 0, s, s);
    for (let p = 0; p < 4; p++) {
      g.fillStyle = p % 2 ? "#95765a" : "#a08264";
      g.fillRect(0, (p * s) / 4, s, s / 4 - 2);
      g.fillStyle = "rgba(60,40,25,0.35)";
      for (let i = 0; i < 22; i++) {
        const y = (p * s) / 4 + Math.random() * (s / 4 - 4);
        g.fillRect(0, y, s, 1);
      }
    }
  }, 3);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.75 });

  const wall = new THREE.Mesh(new THREE.BoxGeometry(ROOM.wallW, ROOM.wallH, 0.15), wallMat);
  wall.position.set(0, ROOM.wallH / 2, -0.075);
  wall.receiveShadow = true;
  scene.add(wall);

  for (const side of [-1, 1]) {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.15, ROOM.wallH, ROOM.depth), sideMat);
    sw.position.set(side * (ROOM.wallW / 2), ROOM.wallH / 2, ROOM.depth / 2);
    sw.receiveShadow = true;
    scene.add(sw);
  }
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(ROOM.wallW, 0.12, ROOM.depth), sideMat);
  ceiling.position.set(0, ROOM.wallH + 0.06, ROOM.depth / 2);
  scene.add(ceiling);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.wallW, ROOM.depth), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, ROOM.depth / 2);
  floor.receiveShadow = true;
  scene.add(floor);

  // Baseboard along the back and side walls.
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xf4f0e8, roughness: 0.8 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(ROOM.wallW, 0.09, 0.018), baseMat);
  base.position.set(0, 0.045, 0.009);
  scene.add(base);
  for (const side of [-1, 1]) {
    const sb = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.09, ROOM.depth), baseMat);
    sb.position.set(side * (ROOM.wallW / 2 - 0.009), 0.045, ROOM.depth / 2);
    scene.add(sb);
  }

  // Rug under the sofa: grounds it and gives the floor a scale cue.
  const rug = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.012, 2.3),
    new THREE.MeshStandardMaterial({ color: 0xb3a48f, roughness: 1 })
  );
  rug.position.set(0, 0.006, 1.15);
  rug.receiveShadow = true;
  scene.add(rug);
}

function buildSofa(scene: THREE.Scene) {
  const W = SOFA.wIn * IN_M;
  const D = SOFA.dIn * IN_M;
  const H = SOFA.hIn * IN_M;
  const seatTop = SOFA.seatHIn * IN_M;
  const armH = SOFA.armHIn * IN_M;
  const armW = SOFA.armWIn * IN_M;
  const legH = SOFA.legHIn * IN_M;
  const zBack = SOFA.backGapM;
  const zc = zBack + D / 2;

  const weave = canvasTexture((g, s) => {
    g.fillStyle = "#a89e8d";
    g.fillRect(0, 0, s, s);
    g.fillStyle = "rgba(255,255,255,0.05)";
    for (let y = 0; y < s; y += 3) g.fillRect(0, y, s, 1);
    g.fillStyle = "rgba(0,0,0,0.06)";
    for (let x = 0; x < s; x += 3) g.fillRect(x, 0, 1, s);
  }, 4);
  const fabric = new THREE.MeshStandardMaterial({ map: weave, color: 0xcfc6b6, roughness: 0.95 });
  const cushionMat = new THREE.MeshStandardMaterial({ map: weave, color: 0xddd5c6, roughness: 0.95 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x4a3826, roughness: 0.6 });

  const group = new THREE.Group();
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rx = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.x = rx;
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  // Legs (tapered cylinders), base platform, back and arms.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      add(
        new THREE.CylinderGeometry(0.02, 0.028, legH, 10),
        legMat,
        sx * (W / 2 - 0.09),
        legH / 2,
        zc + sz * (D / 2 - 0.09)
      );
    }
  }
  const baseH = seatTop - legH - 0.16;
  add(new RoundedBoxGeometry(W, baseH, D - 0.08, 3, 0.03), fabric, 0, legH + baseH / 2, zc - 0.02);
  add(new RoundedBoxGeometry(W, H - seatTop, 0.2, 3, 0.04), fabric, 0, (H + seatTop) / 2, zBack + 0.1);
  for (const sx of [-1, 1]) {
    add(new RoundedBoxGeometry(armW, armH - legH, D, 3, 0.05), fabric, sx * (W / 2 - armW / 2), legH + (armH - legH) / 2, zc);
  }
  // Three seat cushions and three tilted back cushions.
  const innerW = W - armW * 2;
  const cw = innerW / 3 - 0.015;
  for (let i = 0; i < 3; i++) {
    const x = -innerW / 2 + cw / 2 + 0.008 + i * (cw + 0.015);
    add(new RoundedBoxGeometry(cw, 0.16, 0.6, 3, 0.05), cushionMat, x, seatTop - 0.08, zBack + 0.5);
    add(new RoundedBoxGeometry(cw, 0.42, 0.16, 3, 0.05), cushionMat, x, seatTop + 0.2, zBack + 0.26, -0.14);
  }
  scene.add(group);
}

function frameMaterial(frame: FrameId) {
  if (frame === "oak") {
    const grain = canvasTexture((g, s) => {
      g.fillStyle = "#b08954";
      g.fillRect(0, 0, s, s);
      g.fillStyle = "rgba(90,60,30,0.25)";
      for (let i = 0; i < 40; i++) g.fillRect(0, Math.random() * s, s, 1.5);
    }, 1);
    return new THREE.MeshStandardMaterial({ map: grain, roughness: 0.65 });
  }
  return new THREE.MeshStandardMaterial({
    color: frame === "white" ? 0xf2efe9 : 0x171717,
    roughness: frame === "white" ? 0.5 : 0.42,
  });
}

function rectShape(w: number, h: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2);
  s.lineTo(w / 2, -h / 2);
  s.lineTo(w / 2, h / 2);
  s.lineTo(-w / 2, h / 2);
  s.closePath();
  return s;
}

function applyCover(tex: THREE.Texture, imageAspect: number, printAspect: number) {
  // Crop the scan to fill the print size, centred, without stretching it.
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  if (imageAspect > printAspect) {
    const r = printAspect / imageAspect;
    tex.repeat.set(r, 1);
    tex.offset.set((1 - r) / 2, 0);
  } else {
    const r = imageAspect / printAspect;
    tex.repeat.set(1, r);
    tex.offset.set(0, (1 - r) / 2);
  }
  tex.needsUpdate = true;
}

// Builds the framed piece at true scale. The bottom edge stays at
// HANG_BOTTOM_M, so a larger print grows upward over the fixed sofa.
function buildFramed(state: PreviewState, tex: THREE.Texture, imageAspect: number) {
  const { wIn, hIn } = framedOuterIn(state.size, state.hasMat);
  const outerW = wIn * IN_M;
  const outerH = hIn * IN_M;
  const printW = state.size.wIn * IN_M;
  const printH = state.size.hIn * IN_M;
  const matW = state.hasMat ? MAT_W_IN * IN_M : 0;
  const frameW = FRAME_W_IN * IN_M;

  applyCover(tex, imageAspect, state.size.wIn / state.size.hIn);

  const group = new THREE.Group();
  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(outerW, outerH, 0.018),
    new THREE.MeshStandardMaterial({ color: 0x2b2723, roughness: 0.9 })
  );
  backing.position.z = 0.009;
  backing.castShadow = true;
  group.add(backing);

  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(printW, printH),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 })
  );
  art.position.z = 0.02;
  group.add(art);

  if (state.hasMat) {
    const matShape = rectShape(printW + matW * 2, printH + matW * 2);
    matShape.holes.push(rectShape(printW, printH) as unknown as THREE.Path);
    const mat = new THREE.Mesh(
      new THREE.ShapeGeometry(matShape),
      new THREE.MeshStandardMaterial({ color: 0xf7f3ea, roughness: 0.95 })
    );
    mat.position.z = 0.023;
    group.add(mat);
  }

  const frameShape = rectShape(outerW, outerH);
  frameShape.holes.push(rectShape(outerW - frameW * 2, outerH - frameW * 2) as unknown as THREE.Path);
  const frame = new THREE.Mesh(
    new THREE.ExtrudeGeometry(frameShape, {
      depth: FRAME_DEPTH_M - 0.012,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 2,
    }),
    frameMaterial(state.frame)
  );
  frame.position.z = 0.012;
  frame.castShadow = true;
  group.add(frame);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(outerW - frameW * 2, outerH - frameW * 2),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.07,
      roughness: 0.06,
      metalness: 0,
      depthWrite: false,
    })
  );
  glass.position.z = FRAME_DEPTH_M + 0.004;
  glass.renderOrder = 2;
  group.add(glass);

  group.position.set(0, HANG_BOTTOM_M + outerH / 2, 0);
  return group;
}

function disposeObject(root: THREE.Object3D, preserveImageTextures = false) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) material.forEach((item) => materials.add(item));
    else if (material) materials.add(material);
  });

  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value instanceof THREE.Texture) textures.add(value);
    });
    material.dispose();
  });
  textures.forEach((texture) => {
    if (!preserveImageTextures || !(texture.image instanceof HTMLImageElement)) texture.dispose();
  });
  geometries.forEach((geometry) => geometry.dispose());
}

const DEFAULT_VIEW = { yaw: 0, pitch: 0.1, radius: 2.75 };

export default function WallPreview() {
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const [artworkId, setArtworkId] = useState<string>("3");
  const [frame, setFrame] = useState<FrameId>("white");
  const [hasMat, setHasMat] = useState(true);
  const [sizeId, setSizeId] = useState("9x12");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [viewReset, setViewReset] = useState(0);
  const mountRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const rebuildFnRef = useRef<() => void>(() => {});

  const size = PRINT_SIZES.find((s) => s.id === sizeId) ?? PRINT_SIZES[3];
  const state = useMemo<PreviewState>(() => ({ artworkId, frame, hasMat, size }), [artworkId, frame, hasMat, size]);
  const stateRef = useRef(state);
  stateRef.current = state;

  const artworks = useMemo(
    () =>
      ARTWORK_IDS.map((id) => {
        const work = getWatercolor(id);
        const series = seriesList.find((s) => s.id === work?.series);
        return { id, work, series, src: `/watercolors/${id.padStart(2, "0")}/main.jpg` };
      }).filter((a) => a.work),
    []
  );
  const current = artworks.find((a) => a.id === artworkId) ?? artworks[0];
  const outer = framedOuterIn(size, hasMat);

  usePageMeta({
    title: zh ? "在墙上预览" : "View on Your Wall",
    description: zh
      ? "在真实比例的房间里预览裱框版画，对照沙发判断尺寸。"
      : "Preview a framed print at true scale in a room, next to a sofa, before you buy.",
    image: current?.src,
    path: "/wall-preview",
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      setStatus("error");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1712);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const environmentTarget = pmrem.fromScene(roomEnvironment, 0.04);
    disposeObject(roomEnvironment);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.35;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30);
    const target = new THREE.Vector3(0, 0.9, 0.25);

    const hemi = new THREE.HemisphereLight(0xfff4e0, 0x5c5348, 0.55);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff1dd, 2.4);
    key.position.set(-2.6, 2.5, 3.4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -1;
    key.shadow.camera.far = 12;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.5);
    fill.position.set(2.5, 1.6, 3);
    scene.add(fill);

    buildRoom(scene);
    buildSofa(scene);

    // Drag viewpoint: yaw/pitch/radius with damping, clamped so the visitor
    // stays inside the room and the wall stays in view.
    const view = { ...DEFAULT_VIEW };
    const goal = { ...DEFAULT_VIEW };
    resetRef.current = () => {
      goal.yaw = DEFAULT_VIEW.yaw;
      goal.pitch = DEFAULT_VIEW.pitch;
      goal.radius = DEFAULT_VIEW.radius;
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dragging = false;
    let px = 0;
    let py = 0;
    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      goal.yaw = THREE.MathUtils.clamp(goal.yaw - (e.clientX - px) * 0.005, -0.6, 0.6);
      goal.pitch = THREE.MathUtils.clamp(goal.pitch + (e.clientY - py) * 0.004, -0.03, 0.38);
      px = e.clientX;
      py = e.clientY;
    };
    const onUp = () => {
      dragging = false;
      el.style.cursor = "grab";
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      goal.radius = THREE.MathUtils.clamp(goal.radius + e.deltaY * 0.0025, 1.5, 4.3);
    };
    const onKey = (e: KeyboardEvent) => {
      const step = 0.07;
      if (e.key === "ArrowLeft") goal.yaw = THREE.MathUtils.clamp(goal.yaw + step, -0.6, 0.6);
      else if (e.key === "ArrowRight") goal.yaw = THREE.MathUtils.clamp(goal.yaw - step, -0.6, 0.6);
      else if (e.key === "ArrowUp") goal.pitch = THREE.MathUtils.clamp(goal.pitch + step / 2, -0.03, 0.38);
      else if (e.key === "ArrowDown") goal.pitch = THREE.MathUtils.clamp(goal.pitch - step / 2, -0.03, 0.38);
      else return;
      e.preventDefault();
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.tabIndex = 0;
    el.setAttribute("role", "application");
    el.setAttribute("aria-describedby", "wall-preview-instructions");
    el.addEventListener("keydown", onKey);

    // Artwork textures, cached per artwork; the framed piece is rebuilt at
    // true scale whenever artwork, frame, mat or print size changes.
    const loader = new THREE.TextureLoader();
    const cache = new Map<string, { tex: THREE.Texture; aspect: number }>();
    let framed: THREE.Group | null = null;
    let loadToken = 0;
    let disposed = false;

    const rebuild = () => {
      const st = stateRef.current;
      const src = `/watercolors/${st.artworkId.padStart(2, "0")}/main.jpg`;
      const hit = cache.get(src);
      const swap = (tex: THREE.Texture, aspect: number) => {
        if (disposed) return;
        const next = buildFramed(st, tex, aspect);
        if (framed) {
          scene.remove(framed);
          disposeObject(framed, true);
        }
        framed = next;
        scene.add(framed);
        setStatus("ready");
      };
      if (hit) {
        swap(hit.tex, hit.aspect);
        return;
      }
      setStatus("loading");
      const token = ++loadToken;
      loader.load(
        src,
        (tex) => {
          if (disposed || token !== loadToken) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          const img = tex.image as HTMLImageElement;
          const aspect = img.width / img.height;
          cache.set(src, { tex, aspect });
          // Another load may have overtaken this one; rebuild only if current.
          if (stateRef.current.artworkId === st.artworkId) swap(tex, aspect);
          else rebuild();
        },
        undefined,
        () => {
          if (!disposed && token === loadToken) setStatus("error");
        }
      );
    };
    rebuildFnRef.current = rebuild;

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Widen the view on narrow (phone) canvases so the 84 in sofa and the
      // framed piece above it both stay in frame.
      camera.fov = camera.aspect >= 1.7 ? 40 : camera.aspect >= 1.1 ? 50 : 62;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const k = reduced ? 1 : 0.12;
      view.yaw += (goal.yaw - view.yaw) * k;
      view.pitch += (goal.pitch - view.pitch) * k;
      view.radius += (goal.radius - view.radius) * k;
      if (Math.abs(goal.yaw - view.yaw) < 0.0004) view.yaw = goal.yaw;
      if (Math.abs(goal.pitch - view.pitch) < 0.0004) view.pitch = goal.pitch;
      if (Math.abs(goal.radius - view.radius) < 0.0004) view.radius = goal.radius;
      const cp = Math.cos(view.pitch);
      camera.position.set(
        target.x + view.radius * Math.sin(view.yaw) * cp,
        target.y + view.radius * Math.sin(view.pitch),
        target.z + view.radius * Math.cos(view.yaw) * cp
      );
      camera.lookAt(target);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("keydown", onKey);
      if (framed) {
        scene.remove(framed);
        disposeObject(framed, true);
      }
      cache.forEach(({ tex }) => tex.dispose());
      scene.environment = null;
      environmentTarget.dispose();
      disposeObject(scene);
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (mount.contains(el)) mount.removeChild(el);
    };
  }, []);

  useEffect(() => {
    rebuildFnRef.current();
  }, [state]);
  useEffect(() => {
    if (viewReset > 0) resetRef.current();
  }, [viewReset]);

  const work = current?.work;
  const title = work ? (zh && work.titleZh ? work.titleZh : work.title) : "";
  const seriesName = current?.series
    ? zh
      ? current.series.chineseName
      : current.series.englishName
    : "";
  const sofaW = SOFA.wIn;
  const framedPct = Math.round((outer.wIn / sofaW) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/catalogs"
            className="font-helvetica text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {zh ? "← 返回作品系列" : "← Back to Catalogs"}
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
            <div>
              <h1 className="shop-title gloria-title text-4xl leading-none">
                {zh ? "在墙上看看" : "View on Your Wall"}
              </h1>
              <p className="description-html text-sm text-muted-foreground leading-relaxed mt-3 max-w-xl">
                {zh
                  ? "在真实比例的房间里，把裱框版画挂在沙发上方。拖动画面换视角，对照沙发判断它到底有多大。"
                  : "Hang the framed print over a sofa in a true-scale room. Drag to shift your viewpoint and judge the real size against the sofa."}
              </p>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {title}
              {seriesName ? ` · ${seriesName}` : ""}
              {work ? ` · ${work.year}` : ""}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative border border-border bg-black overflow-hidden">
            <div
              ref={mountRef}
              className="w-full h-[58vh] min-h-[340px] sm:h-[64vh]"
              aria-label={zh ? "三维房间预览，拖动以改变视角" : "3D room preview, drag to shift the viewpoint"}
            />
            <p className="sr-only" role="status" aria-live="polite">
              {status === "loading"
                ? zh
                  ? "三维预览正在加载。"
                  : "The 3D preview is loading."
                : status === "error"
                  ? zh
                    ? "三维预览加载失败。"
                    : "The 3D preview could not load."
                  : zh
                    ? "三维预览已加载。"
                    : "The 3D preview is ready."}
            </p>
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black pointer-events-none">
                <span className="font-mono text-xs uppercase tracking-widest text-white/50">
                  {zh ? "加载中…" : "Loading…"}
                </span>
              </div>
            )}
            {status === "error" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black px-6">
                <p className="font-mono text-xs text-white/70 text-center">
                  {zh
                    ? "预览加载失败，请检查网络后刷新。"
                    : "The preview could not load. Check your connection and refresh."}
                </p>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-black/55 text-white px-3 py-2 pointer-events-none">
              <p className="font-mono text-[11px] uppercase tracking-widest">{title}</p>
              <p className="font-mono text-[11px] text-white/70">
                {zh ? "含框" : "Framed"} {fmtIn(outer.wIn)} × {fmtIn(outer.hIn)} in ·{" "}
                {(outer.wIn * 2.54).toFixed(1)} × {(outer.hIn * 2.54).toFixed(1)} cm
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewReset((v) => v + 1)}
              className="sans-label absolute top-3 right-3 inline-flex items-center gap-2 bg-black/55 text-white text-[11px] uppercase tracking-widest px-3 py-2 hover:text-primary transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {zh ? "重置视角" : "Reset view"}
            </button>
            <p
              id="wall-preview-instructions"
              className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-black/55 text-white font-mono text-[11px] px-3 py-2 pointer-events-none"
            >
              <Move className="h-3.5 w-3.5" />
              {zh ? "拖动换视角 · 滚轮远近" : "Drag to look around · Scroll to move closer"}
            </p>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground mt-2">
            {zh
              ? `沙发宽 ${sofaW} 英寸（${(sofaW * 2.54).toFixed(0)} 厘米），含框宽度约为沙发的 ${framedPct}%。房间墙高 2.75 米。预览图会裁切至所选尺寸，居中显示。`
              : `Sofa ${sofaW} in wide (${(sofaW * 2.54).toFixed(0)} cm); framed width is about ${framedPct}% of the sofa. Wall 2.75 m high. Artwork is centre-cropped to fill the chosen print size.`}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            <div className="space-y-8">
              <section>
                <h2 className="sans-label text-xs uppercase tracking-widest mb-3">
                  {zh ? "作品" : "Artwork"}
                </h2>
                <div className="flex gap-2 flex-wrap" role="group" aria-label={zh ? "选择作品" : "Choose artwork"}>
                  {artworks.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setArtworkId(a.id)}
                      aria-pressed={artworkId === a.id}
                      className={`w-24 text-left ${artworkId === a.id ? "" : "opacity-70 hover:opacity-100"}`}
                    >
                      <span
                        className={`block w-24 h-24 overflow-hidden bg-black ${
                          artworkId === a.id ? "ring-2 ring-primary" : "border border-border"
                        }`}
                      >
                        <img src={a.src} alt={a.work?.title} className="w-full h-full object-cover" />
                      </span>
                      <span className="product-title block text-xs mt-2 leading-snug">
                        {zh && a.work?.titleZh ? a.work.titleZh : a.work?.title}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="sans-label text-xs uppercase tracking-widest mb-3">
                  {zh ? "印刷尺寸" : "Print size"}
                </h2>
                <div className="flex gap-2 flex-wrap" role="group" aria-label={zh ? "选择印刷尺寸" : "Choose print size"}>
                  {PRINT_SIZES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSizeId(s.id)}
                      aria-pressed={sizeId === s.id}
                      className={`sans-label text-xs uppercase tracking-widest px-3 py-2 border transition-colors ${
                        sizeId === s.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {s.wIn} × {s.hIn} in
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="sans-label text-xs uppercase tracking-widest mb-3">
                  {zh ? "画框" : "Frame"}
                </h2>
                <div className="flex gap-2 flex-wrap" role="group" aria-label={zh ? "选择画框" : "Choose frame"}>
                  {FRAME_STYLES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrame(f.id)}
                      aria-pressed={frame === f.id}
                      className={`inline-flex items-center gap-2 text-xs px-3 py-2 border transition-colors ${
                        frame === f.id ? "border-primary ring-1 ring-primary" : "border-border hover:border-foreground"
                      }`}
                    >
                      <span className="inline-block w-4 h-4 border border-foreground/30" style={{ backgroundColor: f.hex }} />
                      {zh ? f.zh : f.en}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <Switch
                    id="mat-toggle"
                    checked={hasMat}
                    onCheckedChange={setHasMat}
                    aria-label={zh ? "卡纸装裱" : "Mat"}
                  />
                  <label htmlFor="mat-toggle" className="sans-label text-xs uppercase tracking-widest cursor-pointer">
                    {zh ? `卡纸装裱（四边各 ${MAT_W_IN} 英寸）` : `Mat (${MAT_W_IN} in border)`}
                  </label>
                </div>
              </section>
            </div>

            <aside className="border border-border p-5 h-fit">
              <h2 className="sans-label text-xs uppercase tracking-widest mb-4">
                {zh ? "尺寸对照" : "At this size"}
              </h2>
              <dl className="font-mono text-xs space-y-2 text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <dt>{zh ? "印刷" : "Print"}</dt>
                  <dd className="text-foreground">
                    {size.wIn} × {size.hIn} in
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{zh ? "含框" : "Framed"}</dt>
                  <dd className="text-foreground">
                    {fmtIn(outer.wIn)} × {fmtIn(outer.hIn)} in
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{zh ? "沙发" : "Sofa"}</dt>
                  <dd className="text-foreground">{sofaW} in wide</dd>
                </div>
              </dl>
              <div className="mt-5 space-y-2" aria-hidden="true">
                <div className="h-2 bg-primary" style={{ width: `${framedPct}%` }} />
                <div className="h-2 bg-foreground/30 w-full" />
              </div>
              <p className="font-mono text-[11px] text-muted-foreground mt-2">
                {zh ? "上：含框宽度 · 下：沙发宽度" : "Top: framed width · Bottom: sofa width"}
              </p>
              {work && (
                <Link
                  to={`/watercolors/${work.id}`}
                  className="sans-label inline-block mt-6 text-xs uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                >
                  {zh ? "查看并购买这件作品 →" : "View & buy this artwork →"}
                </Link>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

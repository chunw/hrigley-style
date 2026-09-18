import { remainsWorks } from "./remains";
import { spiritWorks } from "./21spirit";
import { watercolors } from "./watercolors";

// Auto-discovers all images in each product's imageFolder at build time.
// To add images to a product, just drop files into src/assets/products/<imageFolder>/.
const _allProductImages = import.meta.glob(
  '../assets/products/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,gif,webp}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

// Print packets bundle a selection of images from a series — surface each
// item's own image as a detail image so buyers can see what's inside.
const PRINT_PACKET_SERIES_IMAGES: Record<string, string[]> = {
  "remains-fine-art-print-packet": remainsWorks.map((w) => `/remains/${w.id.padStart(2, "0")}/main.jpg`),
  "spirit-21-fine-art-print-packet": spiritWorks.map((w) => `/21spirit/${w.id.padStart(2, "0")}/main.jpg`),
  "notes-from-the-road-postcard-packet": watercolors
    .filter((w) => w.series === "IV")
    .map((w) => `/watercolors/${w.id.padStart(2, "0")}/main.jpg`),
}

// Reference these when tagging a product as framed, to keep the name consistent.
export const FRAMED_ART_CATEGORY = "Framed Art";
export const FRAMED_ART_CATEGORY_ZH = "装裱艺术品";

// A product's category is `category` by default. To put a product in more than
// one category (e.g. an original painting that's also framed), set `categories`
// (and `categories_zh`) to the full list instead — these two helpers read
// whichever is present so callers never need to know which field was set.
export function getProductCategories(product: { category?: string | null; categories?: string[] }): string[] {
  if (product.categories && product.categories.length > 0) return product.categories;
  return product.category ? [product.category] : [];
}

export function getProductCategoriesZh(product: { category_zh?: string | null; categories_zh?: string[] }): string[] {
  if (product.categories_zh && product.categories_zh.length > 0) return product.categories_zh;
  return product.category_zh ? [product.category_zh] : [];
}

// A collection tags a product as part of a named creative series (e.g. "21 Spirit",
// "Slightly Useful Object") rather than a functional category (e.g. "Accessories").
// Products can belong to zero, one, or several collections. `id` is required (though
// unused) purely so TS doesn't treat this as an all-optional "weak type" — most product
// sources don't have a `collections` field at all, which a weak type would reject outright.
export function getProductCollections(product: { id: unknown; collections?: string[] }): string[] {
  return product.collections ?? [];
}

export function getProductCollectionsZh(product: { id: unknown; collections_zh?: string[] }): string[] {
  return product.collections_zh ?? [];
}

// Finds a file named "main" (any extension) inside a product's imageFolder,
// so a folder's main.* file always wins as the cover — regardless of what
// image_url happens to be set to below.
function findMainImageUrl(imageFolder?: string): string | undefined {
  if (!imageFolder) return undefined
  const prefix = `../assets/products/${imageFolder}/`
  for (const [path, url] of Object.entries(_allProductImages)) {
    if (!path.startsWith(prefix)) continue
    const filename = path.slice(prefix.length)
    const basename = filename.slice(0, filename.lastIndexOf('.'))
    if (basename.toLowerCase() === 'main') return url
  }
  return undefined
}

const rawProducts = [

  {
    id: "book-paintings-2019-2026",
    imageFolder: "book",
    title: "Chun Wang Paintings 2019–2026",
    name: "Chun Wang Paintings 2019–2026",
    title_zh: "Chun Wang绘画集 2019–2026",
    description_zh: "需要那种当代生活鲜少容许的凝视。",
    detailed_description_html_zh: `<p>收录了跨越七年的绘画作品，从水彩到综合媒材，涵盖四个系列的作品：<a href="/watercolor-catalog" target="_blank" rel="noreferrer">《残留》</a>、<a href="/watercolor-catalog" target="_blank" rel="noreferrer">《静物》</a>、<a href="/remains-catalog" target="_blank" rel="noreferrer">《遗迹》</a>、<a href="/21spirit-catalog" target="_blank" rel="noreferrer">《21世纪精神》</a>。</p>`,
    category_zh: "书籍",
    edition_info_zh: "",
    price: 40,
    currency: "USD",
    description: "Collects paintings spanning seven years, demanding the kind of looking that contemporary life rarely permits.",
    detailed_description_html: `<p><i>Chun Wang Paintings 2019–2026</i> collects paintings spanning seven years from watercolour to mixed media, across four series: <i><a href="/watercolor-catalog" target="_blank" rel="noreferrer">Residuals</a></i>, <i><a href="/watercolor-catalog" target="_blank" rel="noreferrer">Still Things</a></i>, <i><a href="/remains-catalog" target="_blank" rel="noreferrer">Remains</a></i>, and <i><a href="/21spirit-catalog" target="_blank" rel="noreferrer">Spirit of the 21st Century</a></i>.</p>`,
    dimensions: `Full color, 40 pages. 6 × 6 inches. Softcover, sleek and lightweight. Soft touch matte finish, velvety to the hand.`,
    dimensions_zh: `全彩印刷，40页，6 × 6 英寸。平装本，轻巧灵便，覆哑膜软触感封面。`,
    edition_info: null,
    edition_size: null,
    alt_text: "Chun Wang Paintings 2019–2026 book",
    image_url: new URL("../assets/products/book/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Books",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/YXJ36FNDULK5L",
    soldOut: false,
  },
  {
    id: "tote",
    imageFolder: "remainstote",         // folder in src/assets/products/
    title: "Remains Tote Bag",
    name: "Remains Tote Bag",
    title_zh: "《遗迹》托特包",
    description_zh: "为日常通勤者和潮流引领者打造的企业超现实主义托特包。",
    detailed_description_html_zh: `<p>《遗迹》系列曾入选2024年伦敦国际创意大赛(LICC) 艺术创作组别。它诞生于一种淡淡的荒诞感：在研究那些古代陶俑时，我被它们那种亲切、笨拙又风趣的样子吸引。它们看起来不像什么伟大的纪念碑，倒像是一个个人在"无所事事"的瞬间被定格，很具有耐人寻味的想象空间，因此正合适放在当代无聊的办公室场景里。<br>这款双面设计tote包由耐磨的100%斜纹棉布制成，坚固的棉质提手确保了频繁使用时的舒适度。</p>`,
    category_zh: "配件",
    edition_info_zh: "",
    price: 35,
    currency: "USD",
    description: "Corporate Surrealism for the daily commuter and the trendsetter alike.",
    detailed_description_html: `
  <p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank" rel="noreferrer">Official Selection</a> for 2024 London International Creative Competition (LICC) in Create/Art category, <i>Remains</i> was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions, making them perfect companions for the mundane modern office. <br>
This tote is crafted from durable 100% cotton twill. Its sturdy cotton handles ensure comfort and resilience for frequent use. <br>
Dimension: 35 x 35 cm</p>
    `.trim(),
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Remains Tote Bag",
    image_url: new URL("../assets/products/remainstote/Remains Tote 12.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: true,
    showInStorefront: true,
    category: "Accessories",
    collections: ["Remains"],
    collections_zh: ["遗迹"],
    created_at: new Date().toISOString(),
    paylink: 'https://www.paypal.com/ncp/payment/WFPH39Q2FQJHU'
  },
  {
    id: "remain-tshirt",
    imageFolder: "remainstshirt",
    title: "The Meeting has begun Tee (Unisex, Oversized)",
    name: "The Meeting has begun Tee (Unisex, Oversized)",
    title_zh: "《遗迹》中性宽松T恤",
    description_zh: "我们没什么可贡献的。",
    detailed_description_html_zh: `<p><a href="/remains-catalog">《遗迹》系列</a>曾入选2024年伦敦国际创意大赛(LICC) 艺术创作组别。它诞生于一种淡淡的荒诞感：在研究那些古代陶俑时，我被它们那种亲切、笨拙又风趣的样子吸引。它们看起来不像什么伟大的纪念碑，倒像是一个个人在"无所事事"的瞬间被定格，很具有耐人寻味的想象空间，因此正合适放在当代无聊的办公室场景里。<br>这款T恤采用优质棉质面料制成，穿着舒适，适合日常穿着。<br>均码</p>`,
    category_zh: "服饰",
    edition_info_zh: "",
    price: 35,
    currency: "USD",
    description: "We have nothing to contribute to",
    detailed_description_html: `
  <p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank" rel="noreferrer">Official Selection</a> for 2024 London International Creative Competition (LICC) in Create/Art category, <i><a href="/remains-catalog">Remains</a></i> was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions, making them perfect companions for the mundane modern office. <br>
This unisex oversized t-shirt is crafted from soft, premium cotton for everyday comfort. <br>
One size.</p>
    `.trim(),
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Remains T-Shirt",
    image_url: new URL("../assets/products/remainstshirt/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: true,
    showInStorefront: true,
    category: "Apparel",
    created_at: new Date().toISOString(),
    paylink: 'https://www.paypal.com/ncp/payment/47BGDH4F3QUS6'
  },
  {
    id: "remains-sticker-packet",
    imageFolder: "remainsstickerpacket",
    title: "Remains Sticker Packet",
    name: "Remains Sticker Packet",
    title_zh: "《遗迹》贴纸套装",
    description_zh: "为日常通勤者和潮流引领者打造的企业超现实主义贴纸套装。",
    detailed_description_html_zh: `<p><a href="/remains-catalog">《遗迹》系列</a>曾入选2024年伦敦国际创意大赛(LICC) 艺术创作组别。它诞生于一种淡淡的荒诞感：在研究那些古代陶俑时，我被它们那种亲切、笨拙又风趣的样子吸引。它们看起来不像什么伟大的纪念碑，倒像是一个个人在"无所事事"的瞬间被定格，很具有耐人寻味的想象空间，因此正合适放在当代无聊的办公室场景里。</p>`,
    category_zh: "文具",
    edition_info_zh: "",
    price: 5,
    currency: "USD",
    description: "Ancient office workers, now adhesive.",
    detailed_description_html: `
  <p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank" rel="noreferrer">Official Selection</a> for 2024 London International Creative Competition (LICC) in Create/Art category, <i><a href="/remains-catalog">Remains</a></i> was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions, making them perfect companions for the mundane modern office.</p>
    `.trim(),
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Remains Sticker Packet",
    image_url: new URL("../assets/products/remainsstickerpacket/* Sticker packet 01.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: true,
    showInStorefront: true,
    category: "Stationery",
    collections: ["Remains"],
    collections_zh: ["遗迹"],
    created_at: new Date().toISOString(),
    paylink: 'https://www.paypal.com/ncp/payment/HV7FLGWWJDRYC'
  },
  {
    id: "every-flush-bath-mat",
    imageFolder: "everyflushnathmat",
    title: "Every flush is a new beginning Bath mat",
    name: "Every flush is a new beginning Bath mat",
    title_zh: "每次冲水都是新的开始 浴室地垫",
    description_zh: "每次冲水都是新的开始。",
    detailed_description_html_zh: `<p>《遗迹》系列曾入选2024年伦敦国际创意大赛(LICC) 艺术创作组别。它诞生于一种淡淡的荒诞感：在研究那些古代陶俑时，我被它们那种亲切、笨拙又风趣的样子吸引。它们看起来不像什么伟大的纪念碑，倒像是一个个人在"无所事事"的瞬间被定格，很具有耐人寻味的想象空间，因此正合适放在当代无聊的办公室场景里。</p>`,
    category_zh: "家居",
    edition_info_zh: "",
    price: 30,
    currency: "USD",
    description: "Every flush is a new beginning.",
    detailed_description_html: `
  <p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank" rel="noreferrer">Official Selection</a> for 2024 London International Creative Competition (LICC) in Create/Art category, <i>Remains</i> was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions, making them perfect companions for the mundane modern office.</p>
    `.trim(),
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Every flush is a new beginning Bath mat",
    image_url: new URL("../assets/products/everyflushnathmat/Fresh Bath Mat 2.png", import.meta.url).href,
    is_active: true,
    printInCatalog: true,
    showInStorefront: true,
    category: "Home Decor",
    collections: ["Remains"],
    collections_zh: ["遗迹"],
    created_at: new Date().toISOString(),
    paylink: 'https://www.paypal.com/ncp/payment/RGB545X9XJW6G'
  },

  {
    id: "black-mirrors",
    imageFolder: "blackmirrors",
    title: "Black Mirrors",
    name: "Black Mirrors",
    title_zh: "黑镜",
    description_zh: "一组原创油画，布面。",
    detailed_description_html_zh: `<p><i>黑镜</i>——油彩与智能手机，布面。我们每天盯着屏幕，屏幕也在打量我们。这两幅画将这种对视定格在画布上：一大一小，一个姿态，两种尺度。</p><p>大幅：12″ × 36″ &nbsp;|&nbsp; 小幅：9″ × 12″<br>共两幅，原创画作。</p>`,
    category_zh: "原创艺术",
    edition_info_zh: "",
    price: 600,
    printInCatalog: false,
    showInStorefront: true,
    currency: "USD",
    description: "Set of 2 original oil paintings. Oil and used smartphone on canvas.",
    detailed_description_html: `<p><i>Black Mirror</i> — Oil and Smartphone on canvas.<br>
Large: 12″ × 36″ &nbsp;|&nbsp; Small: 9″ × 12″<br>
Set of 2 original paintings.</p>`.trim(),
    // dimensions: `Large: 12″ × 36″ · Small: 9″ × 12″`,
    // dimensions_zh: `大幅：12″ × 36″ · 小幅：9″ × 12″`,
    edition_info: null,
    edition_size: null,
    alt_text: "Black Mirrors — set of 2 original paintings",
    image_url: new URL("../assets/products/blackmirrors/Black Mirror 4.jpg", import.meta.url).href,
    is_active: true,
    category: "Original Art",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/links/2XJEQW5UZ3NRU"
  },

  {
    id: "residuals-25-original",
    title: "Residuals #25",
    name: "Residuals #25",
    title_zh: "残留 其二十五",
    description_zh: "《残留》系列原作，纸本水彩，已装裱。",
    detailed_description_html_zh: `<p>《残留》系列的原作——纸本水彩，已装裱，随时可挂。</p>`,
    category_zh: "原创艺术",
    categories_zh: ["原创艺术", FRAMED_ART_CATEGORY_ZH],
    edition_info_zh: "",
    price: 100,
    currency: "USD",
    description: "Original watercolor from the Residuals series, framed and ready to hang.",
    detailed_description_html: `<p>The original watercolor behind <i>Residuals #25</i> — watercolor on paper, framed and ready to hang.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Residuals #25 — original watercolor, framed",
    image_url: "/watercolors/25/main.jpg",
    is_active: true,
    printInCatalog: false,
    showInStorefront: false,
    category: "Original Art",
    categories: ["Original Art", FRAMED_ART_CATEGORY],
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/T259S58429CAL"
  },

  {
    id: "statement-earrings",
    imageFolder: "earrings",
    title: "Game of Power Handmade Lacquer Earrings",
    name: "Game of Power Handmade Lacquer Earrings",
    title_zh: "「权力的游戏」手作大漆耳环",
    description_zh: "手作大漆耳环，结实防水，一物可三用。",
    detailed_description_html_zh: `<p>结实防水。以纸制胎骨，层叠涂覆漆树液和金属色，以多样的材质在耳畔拼贴一点独特，戴上后不会显得很夸张。可以一物多用：既是耳环也是桌面雕塑或书签。</p>`,
    category_zh: "服饰",
    edition_info_zh: "",
    price: 20,
    currency: "USD",
    description: "Handmade urushi lacquer earrings. Waterproof, wearable, doubles as a desk sculpture or bookmark.",
    detailed_description_html: `<p>The <i>Game of Power</i> style — our first foray into traditional urushi lacquerwork. A paper core, layered coat by coat with lacquer sap and metallic pigments. Waterproof and built to last.<br><br>Wears quietly enough that it won't announce itself before you do. Also works as a desk sculpture or bookmark — one object, three lives.</p>`.trim(),
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Statement Earrings — handmade",
    image_url: new URL("../assets/products/earrings/earring 1.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: false,
    categories: ["Jewelry", "Accessories"],
    categories_zh: ["首饰", "服饰"],
    created_at: new Date().toISOString(),
    paylink: "mailto:chunwang.me@gmail.com"
  },
  {
    id: "custom-logo-stamp",
    imageFolder: "logostamp",
    title: "Custom Portrait Stamp",
    name: "Custom Portrait Stamp",
    title_zh: "定制肖像印章",
    description_zh: "你的脸，你的印章。自动上墨，四种尺寸，五种墨色——盖在哪里，哪里就是你的。",
    detailed_description_html_zh: `<p>这枚印章以你的肖像作为印模——不是公司Logo，不是字母组合，是你本人。每次盖下去，都是一次小小的宣示：这件事，我经手了。</p><p>自动上墨设计，无需额外墨垫。四种尺寸可选，五种墨色（黑、蓝、红、绿、紫），适配不同场合的不同气场。适合信封、文件、包装、或者任何你觉得需要留下印记的地方。</p><p>下单后请提供你的肖像图片，我们将为你定制专属印模。</p>`,
    category_zh: "服饰",
    edition_info_zh: "",
    price: 25,
    currency: "USD",
    description: "Your portrait, self-inked and ready to claim anything you touch.",
    detailed_description_html: `<p>Not a monogram. Not a logo. Your actual face — pressed into every document, envelope, and package that leaves your hands. A quiet, slightly absurd assertion of authorship.</p><p>Self-inking mechanism, no separate ink pad required. Available in 4 sizes and 5 ink colours (black, blue, red, green, violet) to suit the occasion's mood. Send your portrait after ordering; the stamp is made to your image.</p>`,
    dimensions: `4 sizes available`,
    dimensions_zh: `四种尺寸可选`,
    edition_info: null,
    edition_size: null,
    alt_text: "Custom Portrait Self-Inking Stamp",
    image_url: new URL("../assets/products/logostamp/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: false,
    category: "Accessories",
    created_at: new Date().toISOString(),
    paylink: ""
  },

  {
    id: "artbox-watercolor",
    imageFolder: "artbox-watercolor",
    title: "Chun Wang Artbox 02",
    name: "Chun Wang Artbox 02",
    title_zh: "王淳艺术礼盒 02",
    description_zh: "一盒9×12英寸水彩印刷品, 精选自《残留》与《静物》两个水彩系列。",
    detailed_description_html_zh: `<p>精选自《残留》与《静物》两个水彩系列，以9×12英寸档案级哑光艺术纸印刷，可直接装框。收于硬质礼盒之中，是将凝视带回家的方式。每张印刷品均有签名和限量版号。</p>`,
    category_zh: "艺术礼盒",
    edition_info_zh: "",
    price: 60,
    currency: "USD",
    description: "Watercolor prints in a box — residuals and still things, made permanent. Signed Edition.",
    detailed_description_html: `<p>A curated selection of 9×12" archival matte fine art paper prints from the <em>Residuals</em> and <em>Still Things</em> watercolor series — works that catch the everyday just after it has been used, just before it disappears. Presented in a rigid artbox and ready to frame. Each art box is signed and editioned.</p>`,
    dimensions: `Box: 13.2″ × 9.8″ × 1.8″ · Prints: 12″ × 9″`,
    dimensions_zh: `礼盒：13.2″ × 9.8″ × 1.8″ · 印刷品：12″ × 9″`,
    edition_info: null,
    edition_size: null,
    alt_text: "Watercolor Artbox — curated 9x12 print collection",
    image_url: new URL("../assets/products/artbox-watercolor/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Art Boxes",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/VZHL787738Y7W"
  },

  {
    id: "a6-binder",
    imageFolder: "binder",
    title: "Versatile A6 Binder",
    name: "Versatile A6 Binder",
    title_zh: "多功能A6活页夹",
    description_zh: "艺术插页与功能内页兼备——一本可以随时重组的日常手册。",
    detailed_description_html_zh: `<p>这款A6活页夹以艺术性与实用性为出发点：内附多种艺术图案插页与功能性内页，可根据个人需求自由组合、随时替换。</p><p>紧凑的A6尺寸便于随身携带，六孔活页设计兼容标准活页内芯。适合作为随身记事本、创意手帐，或单纯作为一个有审美立场的文具收纳工具。</p>`,
    category_zh: "文具",
    edition_info_zh: "",
    price: 15,
    currency: "USD",
    description: "Artwork meets function — an A6 binder with art and utility inserts you can reorganize at will.",
    detailed_description_html: `<p>A compact A6 binder built for the person who refuses to choose between aesthetics and utility. Comes with a selection of artwork inserts alongside functional pages — swap them out, rearrange, make it yours.</p><p>Six-ring mechanism compatible with standard A6 refills. Slim enough for a bag pocket, substantial enough to mean it.</p>`,
    dimensions: "A6 (105 × 148 mm)",
    dimensions_zh: "A6（105 × 148 毫米）",
    edition_info: null,
    edition_size: null,
    alt_text: "Versatile A6 Binder with artwork and functional inserts",
    image_url: new URL("../assets/products/binder/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: false,
    category: "Stationery",
    created_at: new Date().toISOString(),
    paylink: ""
  },

  {
    id: "studio-magnetic-bookmark",
    imageFolder: "studiomagneticbookmark",
    title: "Chun Wang Studio Magnetic Bookmark",
    name: "Chun Wang Studio Magnetic Bookmark",
    title_zh: "王淳工作室磁性书签",
    description_zh: "磁性书签，稳稳夹住你的进度——不折页，不迷路。",
    detailed_description_html_zh: `<p>磁性书签，轻轻一夹，页码分毫不差——毕竟，折页是对书籍的犯罪。</p><p>纤薄坚固，扔进包里也不怕变形。轻松夹上，稳稳固定，取下也干净利落。</p><p><a href="https://www.instagram.com/stories/highlights/17937609768273298/" target="_blank">Instagram</a> 上看实物展示。</p>`,
    category_zh: "文具",
    edition_info_zh: "",
    price: 5,
    currency: "USD",
    description: "A magnetic bookmark that holds your place — no dog-eared betrayals, no lost pages.",
    detailed_description_html: `<p>A magnetic bookmark that clips your place without creasing a single page.</p><p>Slides on, stays put, comes off clean.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Chun Wang Studio Magnetic Bookmark",
    image_url: new URL("../assets/products/studiomagneticbookmark/main.png", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Stationery",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/BAK4Z2KE97GUY"
  },

  {
    id: "mixology-planter-1",
    imageFolder: "mixologyplanter1",
    title: "Leaky Boundaries Planter #1",
    name: "Leaky Boundaries Planter #1",
    title_zh: "《渗漏的边界》种植盆 #1",
    description_zh: "层叠玻璃种植器，盛着水、根须与静静生长的绿意。",
    detailed_description_html_zh: `<p>一件层叠玻璃种植器——透明容器层层叠起，托住一株正在生根蔓延的吊兰。</p><p>半是种植器，半是静物：水、玻璃与绿意，在任何一角落窗台上悄然构成自己的画面。</p>`,
    category_zh: "家居",
    edition_info_zh: "",
    price: 35,
    currency: "USD",
    description: "A layered glass planter, holding water, roots, and quiet green life.",
    detailed_description_html: `<p>A layered glass planter — a clear vessel stacked in tiers, cradling a rooting spider plant as it trails and multiplies.</p><p>Part planter, part Still Things: water, glass, and green making their own quiet composition on any shelf or windowsill.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Leaky Boundaries Planter #1",
    image_url: new URL("../assets/products/mixologyplanter1/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: false,
    category: "Home Decor",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/SKAWTMWVQZHY4"
  },

  {
    id: "mixology-planter-2",
    imageFolder: "mixologyplanter2",
    title: "Leaky Boundaries: Morning in the Nest",
    name: "Leaky Boundaries: Morning in the Nest",
    title_zh: "渗漏的边界 — 巢中清晨",
    description_zh: "四腿巢碗，摇摇晃晃——小人坐在里面等待那片永不凉透的吐司。",
    detailed_description_html_zh: `<p>我的陶瓷作品从实用器型起步——烛台、杯子、碗——而后渗入超现实的景观。</p><p>以泥板手工搭建，施以釉料，每件作品都邀请了非陶瓷的客人：干燥植物、皮毛、玻璃与微型塑料小人。一个小职员在粉色蜡烛下靠着电脑睡着了；一头猪站在盛满花朵的玻璃杯上；一个婴儿在摇摇晃晃的巢碗里等待吐司。这些是功能性容器，也属于梦境逻辑与荒诞，在实用、雕塑与故事之间制造出渗漏的边界。</p><p>手建白炻器巢碗，四腿，釉料，枯枝，微型烤面包机与吐司，小人偶。约 6 × 10 × 18 英寸。</p>`,
    category_zh: "家居",
    edition_info_zh: "",
    price: 35,
    currency: "USD",
    description: "A wobbly nest-bowl on four legs — where a tiny figure waits for toast that never cools.",
    detailed_description_html: `<p>My ceramics begin as functional forms — a candle holder, a cup, a bowl — then leak into surreal landscapes.</p><p>Hand-built in clay with glazes, each piece invites non-ceramic guests: dried plants, fur, glass, and miniature plastic figures. A tiny worker sleeps beside his computer under a pink candle. A pig balances on a flower-filled glass. A baby waits for toast in a wobbly nest-bowl. These are functional containers, but also of dream logic and absurdity, creating leaky boundaries between utility, sculpture, and story.</p><p>Hand-built white stoneware nest-bowl on four legs, glaze, dried twigs, miniature toaster with toast, figure. Approx. 6 × 10 × 18 in.</p>`,
    dimensions: "Hand-built white stoneware nest-bowl on four legs, glaze, dried twigs, miniature toaster with toast, figure · Approx. 6 × 10 × 18 in.",
    edition_info: null,
    edition_size: null,
    alt_text: "Mixology Planter — Morning in the Nest",
    image_url: new URL("../assets/products/mixologyplanter2/Morning_in_the_Nest_1.JPG", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: false,
    category: "Home Decor",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/SKAWTMWVQZHY4"
  },

  {
    id: "mixology-planter-3",
    imageFolder: "mixologyplanter3",
    title: "Leaky Boundaries: Aperitif",
    name: "Leaky Boundaries: Aperitif",
    title_zh: "渗漏的边界 — 开胃酒",
    description_zh: "陶瓷与玻璃打造的花器，缀以仿皮草。",
    detailed_description_html_zh: `<p>我的陶瓷作品从实用器型起步, 而后渗入超现实的景观。</p><p>以泥板手工搭建，施以釉料，每件作品都邀请了非陶瓷的客人：干燥植物、皮毛、玻璃与微型塑料小人。一个小职员在粉色蜡烛下靠着电脑睡着了；一头猪站在盛满花朵的玻璃杯上；一个婴儿在摇摇晃晃的巢碗里等待吐司。这些是功能性容器，也属于梦境逻辑与荒诞，在实用、雕塑与故事之间制造出渗漏的边界。</p><p>陶瓷，玻璃鸡尾酒杯，仿皮草，鲜花，樱桃梗，微型猪偶。约 5 × 5 × 6 英寸。</p>`,
    category_zh: "家居",
    edition_info_zh: "",
    price: 35,
    currency: "USD",
    description: "A working flower vessel in ceramic and glass, dressed in faux fur.",
    detailed_description_html: `<p>My ceramics begin as functional forms, then leak into surreal landscapes.</p><p>Hand-built in clay with glazes, each piece invites non-ceramic guests: dried plants, fur, glass, and miniature plastic figures. A tiny worker sleeps beside his computer under a pink candle. A pig balances on a flower-filled glass. A baby waits for toast in a wobbly nest-bowl. These are functional containers, but also of dream logic and absurdity, creating leaky boundaries between utility, sculpture, and story.</p>`,
    dimensions: "Ceramics, glass cocktail cup, faux fur, miniatures. Approx. 5 × 5 × 6 in.",
    edition_info: null,
    edition_size: null,
    alt_text: "Mixology Planter #3",
    image_url: new URL("../assets/products/mixologyplanter3/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Home Decor",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/SKAWTMWVQZHY4"
  },

  {
    id: "mixology-planter-4",
    imageFolder: "mixologyplanter4",
    title: "Leaky Boundaries: After Hours Altar",
    name: "Leaky Boundaries: After Hours Altar",
    title_zh: "渗漏的边界 — 下班后的祭坛",
    description_zh: "小职员在电脑旁睡去，粉色蜡烛在头顶燃烧——加班时光延伸进了另一个维度。",
    detailed_description_html_zh: `<p>我的陶瓷作品从实用器型起步——烛台、杯子、碗——而后渗入超现实的景观。</p><p>以泥板手工搭建，施以釉料，每件作品都邀请了非陶瓷的客人：干燥植物、皮毛、玻璃与微型塑料小人。一个小职员在粉色蜡烛下靠着电脑睡着了；一头猪站在盛满花朵的玻璃杯上；一个婴儿在摇摇晃晃的巢碗里等待吐司。这些是功能性容器，也属于梦境逻辑与荒诞，在实用、雕塑与故事之间制造出渗漏的边界。</p><p>手建炻器，釉料，蜡烛，干草，微型电脑及人偶。约 5 × 8 × 18 英寸。</p>`,
    category_zh: "家居",
    edition_info_zh: "",
    price: 50,
    currency: "USD",
    description: "A tiny worker asleep at his desk, beneath a pink candle — overtime extended into another dimension.",
    detailed_description_html: `<p>My ceramics begin as functional forms — a candle holder, a cup, a bowl — then leak into surreal landscapes.</p><p>Hand-built in clay with glazes, each piece invites non-ceramic guests: dried plants, fur, glass, and miniature plastic figures. A tiny worker sleeps beside his computer under a pink candle. A pig balances on a flower-filled glass. A baby waits for toast in a wobbly nest-bowl. These are functional containers, but also of dream logic and absurdity, creating leaky boundaries between utility, sculpture, and story.</p><p>Hand-built stoneware, glaze, candle, dried grass, miniature computer and figure. Approx. 5 × 8 × 18 in.</p>`,
    dimensions: "Hand-built stoneware, glaze, candle, dried grass, miniature computer and figure · Approx. 5 × 8 × 18 in.",
    edition_info: null,
    edition_size: null,
    alt_text: "Mixology Planter #4",
    image_url: new URL("../assets/products/mixologyplanter4/main.png", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Home Decor",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/XFL4C5U2KPP98",
    soldOut: true,
  },

  {
    id: "artbox-photography",
    imageFolder: "artbox-photography",
    title: "Chun Wang Artbox 01",
    name: "Chun Wang Artbox 01",
    title_zh: "王淳艺术礼盒 01",
    description_zh: "一盒9×12英寸摄影印刷品——人物、风景，以及凝视本身。",
    detailed_description_html_zh: `<p>精选自《另一个，同一个》、《登场》与《苏格兰高地：视域的英雄主义》三个摄影系列，以9×12英寸档案级哑光艺术纸印刷，可直接装框。收于硬质礼盒之中。每张印刷品均有签名和限量版号。</p>`,
    category_zh: "艺术礼盒",
    edition_info_zh: "",
    price: 60,
    currency: "USD",
    description: "Photography prints in a box — figures, landscapes, and the long look between them. Signed Edition.",
    detailed_description_html: `<p>A curated selection of 9×12" archival matte fine art paper prints from the <em>El Otro, El Mismo</em>, <em>Theater</em>, and <em>Highland Scottlands</em> photography series. Each image is a proposition: that the camera is a philosophical instrument, and looking long enough changes what you see. Presented in a rigid artbox and ready to frame. Each art box is signed and editioned.</p>`,
    dimensions: `Box: 13.2″ × 9.8″ × 1.8″ · Prints: 12″ × 9″`,
    dimensions_zh: `礼盒：13.2″ × 9.8″ × 1.8″ · 印刷品：12″ × 9″`,
    edition_info: null,
    edition_size: null,
    alt_text: "Photography Artbox — curated 9x12 print collection",
    image_url: new URL("../assets/products/artbox-photography/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Art Boxes",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/VZHL787738Y7W"
  },

  {
    id: "mixology-planter-5",
    imageFolder: "mixologyplanter5",
    title: "Leaky Boundaries Candle Holder #2",
    name: "Leaky Boundaries Candle Holder #2",
    title_zh: "《渗漏的边界》烛台 2号",
    description_zh: "实用器型渗入超现实景观——泥土、釉料与不速之客。",
    detailed_description_html_zh: `<p>我的陶瓷作品从实用器型起步——烛台、杯子、碗——而后渗入超现实的景观。</p><p>以泥板手工搭建，施以釉料，每件作品都邀请了非陶瓷的客人：干燥植物、皮毛、玻璃与微型塑料小人。一个小职员在粉色蜡烛下靠着电脑睡着了；一头猪站在盛满花朵的玻璃杯上；一个婴儿在摇摇晃晃的巢碗里等待吐司。这些是功能性容器，也属于梦境逻辑与荒诞，在实用、雕塑与故事之间制造出渗漏的边界。</p>`,
    category_zh: "家居",
    edition_info_zh: "",
    price: 30,
    currency: "USD",
    description: "Functional form leaking into surreal landscape — clay, glaze, and uninvited guests.",
    detailed_description_html: `<p>My ceramics begin as functional forms — a candle holder, a cup, a bowl — then leak into surreal landscapes.</p><p>Hand-built in clay with glazes, each piece invites non-ceramic guests: dried plants, fur, glass, and miniature plastic figures. A tiny worker sleeps beside his computer under a pink candle. A pig balances on a flower-filled glass. A baby waits for toast in a wobbly nest-bowl. These are functional containers, but also of dream logic and absurdity, creating leaky boundaries between utility, sculpture, and story.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Leaky Boundaries Candle Holder #2",
    image_url: new URL("../assets/products/mixologyplanter5/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: false,
    category: "Home Decor",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/SKAWTMWVQZHY4"
  },

  {
    id: "remains-fine-art-print-packet",
    imageFolder: "remains-print-packet",
    title: "Remains Fine Art Print Packet",
    name: "Remains Fine Art Print Packet",
    title_zh: "《遗迹》艺术微喷印刷套装",
    description_zh: "一套《遗迹》系列艺术微喷印刷品——陶俑与当代图像重组进同一时空。",
    detailed_description_html_zh: `<p>《遗迹》系列曾入选2024年伦敦国际创意大赛(LICC)艺术创作组别。系列灵感源自世界各地博物馆的藏品、展陈与物质痕迹，将不同文明中的陶俑形象与当代平面语言重组为同一画面，让过去不再是玻璃柜中的标本，而是参与当下意义生产的共作者。</p><p>本套装收录多张精选画面，以艺术微喷工艺印制于哑光艺术纸，尺寸小巧，方便收藏、装框或随手分享。</p>`,
    category_zh: "艺术微喷印刷",
    edition_info_zh: "",
    price: 20,
    currency: "USD",
    description: "A packet of fine art prints from Remains — ancient terracotta figures recombined into the present tense.",
    detailed_description_html: `<p><i>Remains</i> was <a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank" rel="noreferrer">Officially Selected</a> for the 2024 London International Creative Competition (LICC) in the Create/Art category. Drawing on museum collections and material traces from around the world, the series recombines terracotta figures from different civilizations with contemporary graphic language — the past reassembled as a co-author of the present, rather than a specimen behind glass.</p><p>This packet gathers a selection of images from the series, printed as fine art prints on matte archival paper. Small enough to collect, frame, or pass along.</p>`,
    dimensions: `Collection of 4×6" prints`,
    dimensions_zh: "4×6英寸印刷品套装",
    edition_info: null,
    edition_size: null,
    alt_text: "Remains Fine Art Print Packet",
    image_url: new URL("../assets/products/remains-print-packet/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Fine Art Prints",
    collections: ["Remains"],
    collections_zh: ["遗迹"],
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/36A3JK2CXPH74"
  },

  {
    id: "spirit-21-fine-art-print-packet",
    imageFolder: "spirit21-print-packet",
    title: "In the Spirit of the 21st Century Fine Art Print Packet",
    name: "In the Spirit of the 21st Century Fine Art Print Packet",
    title_zh: "《21世纪精神》艺术微喷印刷套装",
    description_zh: "一套《21世纪精神》系列艺术微喷印刷品——将时代议题转译为可被看见的图景。",
    detailed_description_html_zh: `<p>《21世纪精神》曾入围2021年伦敦国际创意大赛（LICC）决赛，艺术创作类。系列将当代核心社会议题与研究数据转译为人物与场景，试图在快速流动的时代里，打捞一种可被观看、被共感的21世纪精神图景。</p><p>本套装收录多张精选画面，以艺术微喷工艺印制于哑光艺术纸，尺寸小巧，方便收藏、装框或随手分享。</p>`,
    category_zh: "艺术微喷印刷",
    edition_info_zh: "",
    price: 20,
    currency: "USD",
    description: "A packet of fine art prints from In the Spirit of the 21st Century — the era's noise, translated into image.",
    detailed_description_html: `<p><i>In the Spirit of the 21st Century</i> was a Finalist at the 2021 London International Creative Competition (LICC), Create/Art category. The series translates core contemporary social issues and research data into figures and scenes — an attempt to salvage, from an era of rapid flux, a portrait of the 21st-century spirit that can actually be seen and felt.</p><p>This packet gathers a selection of images from the series, printed as fine art prints on matte archival paper. Small enough to collect, frame, or pass along.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "In the Spirit of the 21st Century Fine Art Print Packet",
    image_url: new URL("../assets/products/spirit21-print-packet/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Fine Art Prints",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/59VBZ7ZPA6T7G"
  },

  {
    id: "notes-from-the-road-postcard-packet",
    imageFolder: "notes-postcard-packet",
    title: "Notes from the Road Postcard Packet (Set of 4)",
    name: "Notes from the Road Postcard Packet (Set of 4)",
    title_zh: "《行旅拾记》明信片套装（4张一套）",
    description_zh: "一套《行旅拾记》明信片——途中随手画下的小小观察，寄给别人，或者留给自己。",
    detailed_description_html_zh: `<p><i>行旅拾记</i>是一组在途中完成的水彩速记——车窗边、路旁小桌、一个途经却未曾真正抵达的地方。每一幅都是旅途中间某处撕下的一页。</p><p>本套装收录多张精选画面，印制成明信片，背面留白可书写与邮寄。适合寄给远方的人，或者留在自己的桌上。</p>`,
    category_zh: "文具",
    edition_info_zh: "",
    price: 12,
    currency: "USD",
    description: "A packet of postcards from the road — small watercolor observations, ready to mail or keep.",
    detailed_description_html: `<p><i>Notes from the Road</i> is a set of small watercolor observations made in transit — a window seat, a corner table, a place passed through and not quite arrived at. Each piece is a page torn from somewhere in between.</p><p>This packet gathers a selection of images from the series, printed as postcards with a blank, writable back. Send them, or keep them for yourself.</p>`,
    dimensions: `Set of 4 postcards, 4×6"`,
    dimensions_zh: "4张一套，4×6英寸",
    edition_info: null,
    edition_size: null,
    alt_text: "Notes from the Road Postcard Packet",
    image_url: "/watercolors/44/main.jpg",
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Stationery",
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/L84WH6DJPHR3N"
  },

  {
    id: "spiked-cupcake-choker",
    imageFolder: "spikedcupcakechoker",
    title: "Spiked Cake Choker",
    name: "Spiked Cake Choker",
    title_zh: "尖钉蛋糕挂坠项圈",
    description_zh: "一块奶油小蛋糕，外围一圈银色铆钉。甜，但不好惹。",
    detailed_description_html_zh: `<p>一枚手工捏塑的粘土蛋糕挂坠，覆满白色奶油，缀着细小的红色浆果，垂坠在一圈银色尖钉项圈上。</p><p>不锈钢链条，可调节延长链，聚合物粘土挂坠。颈围尺寸可调节。</p>`,
    category_zh: "首饰",
    collections_zh: ["小用之物"],
    edition_info_zh: "",
    price: 40,
    currency: "USD",
    description: "A frosted little cake, ringed in silver studs. Sweet, but not to be messed with.",
    detailed_description_html: `<p>A hand-sculpted clay cake charm, dolloped in white frosting and studded with tiny red berries, hangs from a collar of silver spikes.</p><p>Stainless steel chain with adjustable extender, polymer clay pendant. Adjustable to fit most necks.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Spiked Cake Choker — handmade clay pendant jewelry",
    image_url: new URL("../assets/products/spikedcupcakechoker/main.webp", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Jewelry",
    collections: ["Slightly Useful Object"],
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/5P3KQYVLS4BWA"
  },

  {
    id: "spiked-strawberry-shortcake-choker",
    imageFolder: "strawberryshortcake",
    title: "Spiked Strawberry Shortcake Choker",
    name: "Spiked Strawberry Shortcake Choker",
    title_zh: "尖钉草莓奶油蛋糕挂坠项圈",
    description_zh: "满载草莓与奶油的小蛋糕，被一圈银色尖钉牢牢护住。",
    detailed_description_html_zh: `<p>一枚手工捏塑的粘土草莓奶油蛋糕挂坠，覆满白色奶油，缀着饱满的草莓切片，垂坠在一圈银色尖钉项圈上。</p><p>不锈钢链条，可调节延长链，聚合物粘土挂坠。颈围尺寸可调节。</p>`,
    category_zh: "首饰",
    collections_zh: ["小用之物"],
    edition_info_zh: "",
    price: 55,
    currency: "USD",
    description: "Piled high with strawberries and cream, guarded by a ring of silver spikes.",
    detailed_description_html: `<p>A hand-sculpted clay strawberry shortcake charm, dolloped in white frosting and topped with plump strawberry slices, hangs from a collar of silver spikes.</p><p>Stainless steel chain with adjustable extender, polymer clay pendant. Adjustable to fit most necks.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Spiked Strawberry Shortcake Choker — handmade clay pendant jewelry",
    image_url: new URL("../assets/products/strawberryshortcake/main.webp", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Jewelry",
    collections: ["Slightly Useful Object"],
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/28A4RZTAX6HMN"
  },

  {
    id: "nyc-hotdog-clip",
    imageFolder: "nychotdog",
    title: "NYC Hotdog Clip",
    name: "NYC Hotdog Clip",
    title_zh: "纽约热狗小夹子",
    description_zh: "一根迷你纽约热狗，别在金属夹子上——街头小吃，但可以戴着走。",
    detailed_description_html_zh: `<p>手工捏塑的聚合物粘土热狗，涂满芥末酱与酸黄瓜碎，比纽约街头餐车做得还讲究，安装在结实的金属夹子上。</p><p>可以夹在背包带、外套翻领、帽檐上——随时随地带一点街头热狗能量。</p><p>聚合物粘土，金属鳄鱼夹。轻巧防水。</p>`,
    category_zh: "首饰",
    collections_zh: ["小用之物"],
    edition_info_zh: "",
    price: 12,
    currency: "USD",
    description: "A miniature NYC hot dog, snapped onto a metal clip — street meat, but make it wearable.",
    detailed_description_html: `<p>A hand-sculpted polymer clay hot dog, dressed in mustard and relish exactly the way a cart on the corner would never quite get it right, mounted on a sturdy metal clip.</p><p>Clip it to a bag strap, a jacket lapel, a hat brim — wherever it needs a little dirty-water-dog energy.</p><p>Polymer clay, metal alligator clip. Lightweight and waterproof.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "NYC Hotdog Clip — handmade clay accessory",
    image_url: "",
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Jewelry",
    collections: ["Slightly Useful Object"],
    created_at: new Date().toISOString(),
    paylink: ""
  },

  {
    id: "rock-necklace",
    imageFolder: "rocknecklace",
    title: "Candy Rocks Necklace",
    name: "Candy Rocks Necklace",
    title_zh: "糖果碎石项链",
    description_zh: "糖果色的手工岩石，坠于链条上。",
    detailed_description_html_zh: `<p>一枚手工雕塑的粘土挂坠，形似淡紫色矿石，缀满彩色糖果般的小颗粒——一半矿石，一半糖果。</p><p>垂坠在可调节长度的项链上，非常轻便。</p>`,
    category_zh: "首饰",
    collections_zh: ["小用之物"],
    edition_info_zh: "",
    price: 38,
    currency: "USD",
    description: "A candy-colored, hand-sculpted stone hung from a chain.",
    detailed_description_html: `<p>A pendant shaped like a lilac stone, hand-sculpted and dusted with tiny jewel-toned flecks — part geode, part candy.</p><p>Hangs from a chain necklace with adjustable length, and just as lightweight as it looks.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Candy Rocks Necklace — handmade clay pendant jewelry",
    image_url: new URL("../assets/products/rocknecklace/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Jewelry",
    collections: ["Slightly Useful Object"],
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/MA66A66KT6VE4"
  },

  {
    id: "egg-bacon-breakfast-magnet",
    imageFolder: "eggbaconmagnets",
    title: "Egg & Bacon Breakfast Magnet",
    name: "Egg & Bacon Breakfast Magnet",
    title_zh: "煎蛋培根早餐磁贴",
    description_zh: "一颗太阳蛋，一片培根。帮你压住收据、外卖单，和那张永远写不完的待办清单。",
    detailed_description_html_zh: `<p>在工作室里手工塑形、手工上色，每一对都略有不同，就像真正的早餐一样。</p><p>有点用。主要提供情感支持。<br><br>细节：<br>手工塑形，手工上色<br>强力磁铁<br>约1.5至2英寸<br>不可食用</p>`,
    category_zh: "家居",
    collections_zh: ["小用之物"],
    edition_info_zh: "",
    price: 15,
    currency: "USD",
    description: "One sunny-side-up egg, one strip of bacon. Here to hold down your receipts, takeout menus, and that to-do list you'll never finish.",
    detailed_description_html: `<p>A perfectly committed relationship.</p><p>One sunny-side-up egg and one strip of bacon, permanently holding hands on your fridge. Slightly useful for holding up that receipt you will never expense, a takeout menu from 2022, or a to-do list titled "be more productive."</p><p>Hand-sculpted and painted in the studio, each pair is a little different — like real breakfast. Strong magnet, soft personality.</p><p>Slightly useful. Mostly emotional support.</p><p>Details:<br>Hand-sculpted, hand-painted<br>Strong fridge-grade magnet<br>Approx. 1.5" - 2" — fits in a real pan, if the pan was for ants<br>Not edible. Very holdable.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Egg & Bacon Breakfast Magnet",
    image_url: new URL("../assets/products/eggbaconmagnets/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Home Decor",
    collections: ["Slightly Useful Object"],
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/9S6TYCMUV7UR2"
  },

  {
    id: "cake-magnet-set",
    imageFolder: "cakemagnetset",
    title: "Sliced Cake Magnet, Set of 3",
    name: "Sliced Cake Magnet, Set of 3",
    title_zh: "蛋糕磁贴三件套",
    description_zh: "三块撒了糖果色碎屑的迷你小蛋糕，紫、粉、黄各一块。强力磁吸。",
    detailed_description_html_zh: `<p>一组三枚手工雕塑的迷你蛋糕磁贴：淡紫、粉红与柠檬黄各一块，表面点缀着彩色糖粒与巧克力碎屑，像刚从蛋糕店橱窗里切下来的一样。</p><p>背面装有磁铁，可贴在冰箱、白板或任何金属表面，用来固定照片、便签或购物清单。三件一组。</p>`,
    category_zh: "家居",
    collections_zh: ["小用之物"],
    edition_info_zh: "",
    price: 15,
    currency: "USD",
    description: "Three mini cakes dusted with candy-colored crumbs, one each in purple, pink, and yellow. Strong magnetic hold.",
    detailed_description_html: `<p>A set of three clay cake slices — lilac, pink, and lemon yellow — sculpted by hand and studded with tiny sprinkles and chocolate flecks, like they were sliced straight from the bakery case.</p><p>Magnetic backing, ready to hold up photos, notes, or a grocery list on your fridge or any metal surface. Sold as a set of three.</p>`,
    dimensions: "",
    edition_info: null,
    edition_size: null,
    alt_text: "Sliced Cake Magnet, Set of 3",
    image_url: new URL("../assets/products/cakemagnetset/main.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Home Decor",
    collections: ["Slightly Useful Object"],
    created_at: new Date().toISOString(),
    paylink: "https://www.paypal.com/ncp/payment/FLW42X2DEFGR2"
  },

  {
    id: "notes-from-the-road-mini-artbox",
    imageFolder: "notes-mini-artbox",
    title: "Notes from the Road Mini Fine Art Print Art Box",
    name: "Notes from the Road Mini Fine Art Print Art Box",
    title_zh: "《行旅拾记》迷你版画礼盒装",
    description_zh: "二十五段途中的观察，收进一只亚麻小盒——整个系列，4×6英寸。",
    detailed_description_html_zh: `<p><i>行旅拾记</i>是一组在途中完成的水彩速记——车窗边、路旁的小桌、一个途经却未曾真正抵达的地方。每一幅都是旅途中间某处撕下的一页。这只礼盒把整个系列收在掌心大小之内。</p><p>内含25张4×6英寸艺术微喷，印制于哑光档案级纸，可随手翻看、装框，或分送他人。外盒为4×6英寸亚麻带盖防潮硬质礼盒，附收藏证书。</p>`,
    category_zh: "艺术礼盒",
    edition_info_zh: "",
    price: 35,
    currency: "USD",
    description: "Twenty-five small views from the road, boxed — an entire series at 4×6 inches.",
    detailed_description_html: `<p><i>Notes from the Road</i> is a set of small watercolor observations made in transit — a window seat, a corner table, a place passed through and not quite arrived at. Each piece is a page torn from somewhere in between. This box holds the whole series in the palm of your hand.</p><p>Inside: 25 fine art prints at 4×6", printed on matte archival paper — loose enough to shuffle through, frame, or hand to someone else. Housed in a 4×6" linen-wrapped rigid box with a moisture-resistant lid. Certificate of authenticity included.</p>`,
    dimensions: `Box: 4×6" linen, lidded · 25 fine art prints, 4×6"`,
    dimensions_zh: `礼盒：4×6英寸亚麻带盖防潮硬盒 · 25张4×6英寸艺术微喷`,
    edition_info: null,
    edition_size: null,
    alt_text: "Notes from the Road Mini Fine Art Print Art Box",
    image_url: "/watercolors/44/main.jpg",
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Art Boxes",
    created_at: new Date().toISOString(),
    paylink: ""
  },

  {
    id: "residuals-framed-fine-art-print",
    imageFolder: "residuals-framed-print",
    title: "Residuals Framed Fine Art Print",
    name: "Residuals Framed Fine Art Print",
    title_zh: "《残留》装裱艺术微喷版画",
    description_zh: "《残留》系列艺术微喷，已装裱签名，拆开即可上墙。",
    detailed_description_html_zh: `<p>《残留》看的是日常刚被用过、尚未消失的那一刻——杯底、碎屑、被搁下的物件。留下的东西，往往比事情本身更诚实。</p><p>艺术微喷印制于档案级哑光纸，5×7英寸卡纸装裱，含框尺寸8×10英寸。含艺术家签名，附收藏证书。到手即可悬挂。</p>`,
    category_zh: "艺术微喷印刷",
    categories_zh: ["艺术微喷印刷", FRAMED_ART_CATEGORY_ZH],
    edition_info_zh: "",
    price: 35,
    currency: "USD",
    description: "A framed print from Residuals — signed, matted, and ready for the wall.",
    detailed_description_html: `<p><i>Residuals</i> looks at the everyday just after it has been used and just before it disappears — the bottom of a cup, a few crumbs, an object set down mid-thought. What's left behind tends to be more honest than the event itself.</p><p>Printed as a fine art print on archival matte paper, matted to 5×7" and framed at 8×10". Signed by the artist and accompanied by a certificate of authenticity. Arrives ready to hang.</p>`,
    dimensions: `Framed: 8×10" · matted to 5×7"`,
    dimensions_zh: `含框尺寸：8×10英寸 · 卡纸装裱至5×7英寸`,
    edition_info: null,
    edition_size: null,
    alt_text: "Residuals framed fine art print, 8x10 inches",
    image_url: "/watercolors/24/main.jpg",
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Fine Art Prints",
    categories: ["Fine Art Prints", FRAMED_ART_CATEGORY],
    created_at: new Date().toISOString(),
    paylink: ""
  },
];

// A folder's main.* file always wins as the cover image, overriding whatever
// image_url is set above — keeps product data correct even if a main.* file
// is added, renamed, or swapped later without editing this file.
export const products = rawProducts.map((product) => {
  const mainUrl = findMainImageUrl((product as { imageFolder?: string }).imageFolder)
  return mainUrl ? { ...product, image_url: mainUrl } : product
})

// Auto-generated from each product's imageFolder — no manual entries needed.
// To add images, drop files into src/assets/products/<imageFolder>/.
// The cover image (image_url) is always sorted first, and the rest of the
// thumbnail row is sorted alphabetically ascending by filename.
export const productImages = products.flatMap((product) => {
  const folder = (product as { imageFolder?: string }).imageFolder
  const coverFilename = product.image_url
    ? decodeURIComponent(product.image_url.split('/').pop() || '')
    : ''
  const folderEntries = folder
    ? Object.entries(_allProductImages).filter(([path]) => path.startsWith(`../assets/products/${folder}/`))
    : []
  const coverInFolder = folderEntries.some(([path]) => (path.split('/').pop() || '') === coverFilename)
  const folderImages = folderEntries
    .sort(([a], [b]) => {
      const aFile = a.split('/').pop() || ''
      const bFile = b.split('/').pop() || ''
      if (aFile === coverFilename) return -1
      if (bFile === coverFilename) return 1
      return a.localeCompare(b)
    })
    .map(([, url]) => url)
  const seriesImages = PRINT_PACKET_SERIES_IMAGES[product.id] ?? []
  let images = [...folderImages, ...seriesImages]
  // The cover can also live outside the imageFolder (e.g. a print-packet
  // product whose cover is a specific watercolor's series image) — if so,
  // pull it to the front by exact URL match instead of relying on array order.
  if (!coverInFolder && product.image_url) {
    const coverIndex = images.indexOf(product.image_url)
    if (coverIndex > 0) {
      images = [images[coverIndex], ...images.slice(0, coverIndex), ...images.slice(coverIndex + 1)]
    }
  }
  return images.map((url, i) => ({
    id: `${product.id}-auto-${i}`,
    product_id: product.id,
    image_url: url,
    display_order: i,
  }))
})

// The product grid flips a card's image on hover to its second photo, if one
// exists — this attaches that second photo's URL onto each product so grid
// cards don't need to know about `productImages` at all.
const secondImageByProductId = new Map<string, string>()
for (const img of productImages) {
  if (img.display_order === 1) secondImageByProductId.set(img.product_id, img.image_url)
}
for (const product of products) {
  const secondImageUrl = secondImageByProductId.get(product.id)
  if (secondImageUrl) (product as { secondImageUrl?: string }).secondImageUrl = secondImageUrl
}

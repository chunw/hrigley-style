// Auto-discovers all images in each product's imageFolder at build time.
// To add images to a product, just drop files into src/assets/products/<imageFolder>/.
const _allProductImages = import.meta.glob(
  '../assets/products/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,gif,webp}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

export const products = [

  {
    id: "book-paintings-2019-2026",
    imageFolder: "book",
    title: "Chun Wang Paintings 2019–2026",
    name: "Chun Wang Paintings 2019–2026",
    title_zh: "Chun Wang绘画集 2019–2026",
    description_zh: "需要那种当代生活鲜少容许的凝视。",
    detailed_description_html_zh: `<p>收录了跨越七年的绘画作品，从水彩到综合媒材，涵盖四个系列的作品：《残留》、《静物》、《遗迹》、《21世纪精神》。</p>`,
    category_zh: "书籍",
    edition_info_zh: "",
    price: 40,
    currency: "USD",
    description: "Demanding the kind of looking that contemporary life rarely permits.",
    detailed_description_html: `<p><i>Chun Wang Paintings 2019–2026</i> collects paintings spanning seven years — from watercolour to mixed media, across four series: <i>Residuals</i>, <i>Still Life</i>, <i>Remains</i>, and <i>Spirit of the 21st Century</i>.</p>`,
    dimensions: `Full color, 40 pages. 6 × 6 inches. Softcover, sleek and lightweight. Soft touch matte finish, velvety to the hand.`,
    dimensions_zh: `全彩印刷，40页，6 × 6英寸。平装本，轻巧灵便，覆哑膜软触感封面。`,
    edition_info: null,
    edition_size: null,
    alt_text: "Chun Wang Paintings 2019–2026 book",
    image_url: new URL("../assets/products/book/book-covers.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: true,
    category: "Books",
    created_at: new Date().toISOString(),
    paylink: ""
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
    created_at: new Date().toISOString(),
    paylink: 'https://www.paypal.com/ncp/payment/WFPH39Q2FQJHU'
  },
  {
    id: "remain-tshirt",
    imageFolder: "remainstshirt",
    title: "Remains T-Shirt",
    name: "Remains T-Shirt",
    title_zh: "《遗迹》T恤",
    description_zh: "为日常通勤者和潮流引领者打造的企业超现实主义T恤。",
    detailed_description_html_zh: `<p>《遗迹》系列曾入选2024年伦敦国际创意大赛(LICC) 艺术创作组别。它诞生于一种淡淡的荒诞感：在研究那些古代陶俑时，我被它们那种亲切、笨拙又风趣的样子吸引。它们看起来不像什么伟大的纪念碑，倒像是一个个人在"无所事事"的瞬间被定格，很具有耐人寻味的想象空间，因此正合适放在当代无聊的办公室场景里。<br>这款T恤采用优质棉质面料制成，穿着舒适，适合日常穿着。<br>尺码：S、M、L</p>`,
    category_zh: "服饰",
    edition_info_zh: "",
    price: 35,
    currency: "USD",
    description: "Corporate Surrealism for the daily commuter and the trendsetter alike.",
    detailed_description_html: `
  <p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank" rel="noreferrer">Official Selection</a> for 2024 London International Creative Competition (LICC) in Create/Art category, <i>Remains</i> was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions, making them perfect companions for the mundane modern office. <br>
This unisex oversized  t-shirt is crafted from soft, premium cotton for everyday comfort. <br>
Sizes available: S, M, L</p>
    `.trim(),
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Remains T-Shirt",
    image_url: new URL("../assets/products/remainstshirt/1.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: true,
    showInStorefront: true,
    category: "Apparel",
    created_at: new Date().toISOString(),
    paylink: 'https://www.paypal.com/ncp/payment/WFPH39Q2FQJHU'
  },
  {
    id: "remains-sticker-packet",
    imageFolder: "remainsstickerpacket",
    title: "Remains Sticker Packet",
    name: "Remains Sticker Packet",
    title_zh: "《遗迹》贴纸套装",
    description_zh: "为日常通勤者和潮流引领者打造的企业超现实主义贴纸套装。",
    detailed_description_html_zh: `<p>《遗迹》系列曾入选2024年伦敦国际创意大赛(LICC) 艺术创作组别。它诞生于一种淡淡的荒诞感：在研究那些古代陶俑时，我被它们那种亲切、笨拙又风趣的样子吸引。它们看起来不像什么伟大的纪念碑，倒像是一个个人在"无所事事"的瞬间被定格，很具有耐人寻味的想象空间，因此正合适放在当代无聊的办公室场景里。</p>`,
    category_zh: "文具",
    edition_info_zh: "",
    price: 5,
    currency: "USD",
    description: "Corporate Surrealism for the daily commuter and the trendsetter alike.",
    detailed_description_html: `
  <p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank" rel="noreferrer">Official Selection</a> for 2024 London International Creative Competition (LICC) in Create/Art category, <i>Remains</i> was a mixed media series born from a subtle sense of the absurd. While studying ancient terracotta figurines, I was captivated by their familiar, awkward, and caught mid-nothing expressions, making them perfect companions for the mundane modern office.</p>
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
    created_at: new Date().toISOString(),
    paylink: 'https://www.paypal.com/ncp/payment/WFPH39Q2FQJHU'
  },
  {
    id: "every-flush-bath-mat",
    imageFolder: "everyflushnathmat",
    title: "Every flush is a new beginning Bath mat",
    name: "Every flush is a new beginning Bath mat",
    title_zh: "每次冲水都是新的开始 浴室地垫",
    description_zh: "每日仪式感，从脚下开始。",
    detailed_description_html_zh: `<p>印花浴室地垫，防滑设计，适合日常使用。</p>`,
    category_zh: "家居",
    edition_info_zh: "",
    price: 30,
    currency: "USD",
    description: "",
    detailed_description_html: ``.trim(),
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Every flush is a new beginning Bath mat",
    image_url: new URL("../assets/products/everyflushnathmat/Fresh Bath Mat 2.png", import.meta.url).href,
    is_active: true,
    printInCatalog: true,
    showInStorefront: true,
    category: "Home",
    created_at: new Date().toISOString(),
    paylink: 'https://www.paypal.com/ncp/payment/WFPH39Q2FQJHU'
  },

  {
    id: "black-mirrors",
    imageFolder: "blackmirrors",
    title: "Black Mirrors",
    name: "Black Mirrors",
    title_zh: "黑镜",
    description_zh: "两幅原创油画。黑镜——油彩与智能手机，布面。",
    detailed_description_html_zh: `<p><i>黑镜</i>——油彩与智能手机，布面。我们每天盯着屏幕，屏幕也在打量我们。这两幅画将这种对视定格在画布上：一大一小，一个姿态，两种尺度。</p><p>大幅：12″ × 36″ &nbsp;|&nbsp; 小幅：9″ × 12″<br>共两幅，原创画作。</p>`,
    category_zh: "原创艺术",
    edition_info_zh: "",
    price: 600,
    currency: "USD",
    description: "Set of 2 original oil paintings. Oil and used smartphone on canvas.",
    detailed_description_html: `<p><i>Black Mirror</i> — Oil and Smartphone on canvas.<br>
Large: 12″ × 36″ &nbsp;|&nbsp; Small: 9″ × 12″<br>
Set of 2 original paintings.</p>`.trim(),
    dimensions: `Large: 12″ × 36″ · Small: 9″ × 12″`,
    dimensions_zh: `大幅：12″ × 36″ · 小幅：9″ × 12″`,
    edition_info: null,
    edition_size: null,
    alt_text: "Black Mirrors — set of 2 original paintings",
    image_url: new URL("../assets/products/blackmirrors/Black Mirror 4.jpg", import.meta.url).href,
    is_active: true,
    printInCatalog: false,
    showInStorefront: false,
    category: "Original Art",
    created_at: new Date().toISOString(),
    paylink: ""
  },

  {
    id: "statement-earrings",
    imageFolder: "earrings",
    title: "Game of Power — Handmade Lacquer Earrings",
    name: "Game of Power — Handmade Lacquer Earrings",
    title_zh: "「权力的游戏」手作大漆耳环",
    description_zh: "手作大漆耳环，结实防水，一物可三用。",
    detailed_description_html_zh: `<p>结实防水。以纸制胎骨，层叠涂覆漆树液和金属色，以多样的材质在耳畔拼贴一点独特，戴上后不会显得很夸张。可以一物多用：既是耳环也是桌面雕塑或书签。</p>`,
    category_zh: "配件",
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
    category: "Accessories",
    created_at: new Date().toISOString(),
    paylink: ""
  },
  {
    id: "custom-logo-stamp",
    imageFolder: "logostamp",
    title: "Custom Portrait Stamp",
    name: "Custom Portrait Stamp",
    title_zh: "定制肖像印章",
    description_zh: "你的脸，你的印章。自动上墨，四种尺寸，五种墨色——盖在哪里，哪里就是你的。",
    detailed_description_html_zh: `<p>这枚印章以你的肖像作为印模——不是公司Logo，不是字母组合，是你本人。每次盖下去，都是一次小小的宣示：这件事，我经手了。</p><p>自动上墨设计，无需额外墨垫。四种尺寸可选，五种墨色（黑、蓝、红、绿、紫），适配不同场合的不同气场。适合信封、文件、包装、或者任何你觉得需要留下印记的地方。</p><p>下单后请提供你的肖像图片，我们将为你定制专属印模。</p>`,
    category_zh: "配件",
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
];

// Auto-generated from each product's imageFolder — no manual entries needed.
// To add images, drop files into src/assets/products/<imageFolder>/.
// The cover image (image_url) is always sorted first.
export const productImages = products.flatMap((product) => {
  const folder = (product as { imageFolder?: string }).imageFolder
  if (!folder) return []
  const prefix = `../assets/products/${folder}/`
  const coverFilename = product.image_url
    ? decodeURIComponent(product.image_url.split('/').pop() || '')
    : ''
  return Object.entries(_allProductImages)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => {
      const aFile = a.split('/').pop() || ''
      const bFile = b.split('/').pop() || ''
      if (aFile === coverFilename) return -1
      if (bFile === coverFilename) return 1
      return a.localeCompare(b)
    })
    .map(([, url], i) => ({
      id: `${product.id}-auto-${i}`,
      product_id: product.id,
      image_url: url,
      display_order: i,
    }))
})

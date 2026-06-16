// Centralized product data (real products)

// const categories = ["ALL", 
//   // "Original Art", 
//   // "Prints/Series", 
// //  "Stationery", 
//   "Apparel", 
//   // "Books", 
//   // "Ceramics", 
//   // "Decor", 
//   // "Accessories", 
//   // "Digital", 
//   // "Service", 
//   // "Misc"
// ];

export const products = [
  {
    id: "tote",
    title: "Remains Tote Bag",
    name: "Remains Tote Bag",
    title_zh: "《遗迹》托特包",
    description_zh: "为日常通勤者和潮流引领者打造的企业超现实主义托特包。",
    detailed_description_html_zh: "《遗迹》系列曾入选伦敦国际创意大赛(LICC) 艺术创作组别。它诞生于一种淡淡的荒诞感：在研究那些古代陶俑时，我被它们那种亲切、笨拙又风趣的样子吸引。它们看起来不像什么伟大的纪念碑，倒像是一个个人在“无所事事”的瞬间被定格，很具有耐人寻味的想象空间，因此正合适放在当代无聊的办公室场景里。这款双面设计tote包由耐磨的100%斜纹棉布制成，坚固的棉质提手确保了频繁使用时的舒适度。",
    category_zh: "服饰",
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
];

export const productImages = [
   { id: "8", product_id: "horse-year-card", image_url: new URL("../assets/products/horseyearpostcard/3.jpg", import.meta.url).href, display_order: 0 },
   { id: "horse-year-card-2", product_id: "horse-year-card", image_url: new URL("../assets/products/horseyearpostcard/2.jpg", import.meta.url).href, display_order: 0 },
   { id: "9", product_id: "horse-year-card", image_url: new URL("../assets/products/horseyearpostcard/4.jpg", import.meta.url).href, display_order: 0 },
  
  
  { id: "2", product_id: "tote", image_url: new URL("../assets/products/remainstote/Remains Tote 12.jpg", import.meta.url).href, display_order: 0 },
  { id: "6", product_id: "tote", image_url: new URL("../assets/products/remainstote/Remains Tote 11.jpg", import.meta.url).href, display_order: 0 },
{ id: "3", product_id: "tote", image_url: new URL("../assets/products/remainstote/Remains Tote 13.jpg", import.meta.url).href, display_order: 0 },
 { id: "10", product_id: "tote", image_url: new URL("../assets/products/remainstote/1.jpg", import.meta.url).href, display_order: 0 },
{ id: "11", product_id: "tote", image_url: new URL("../assets/products/remainstote/2.jpg", import.meta.url).href, display_order: 0 },

//   { id: "4", product_id: "tote", image_url: new URL("../assets/products/remainstote/Remains Tote 9.jpg", import.meta.url).href, display_order: 0 },
// { id: "5", product_id: "tote", image_url: new URL("../assets/products/remainstote/Remains Tote 10.jpg", import.meta.url).href, display_order: 0 },

];

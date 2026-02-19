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
    price: 39,
    currency: "USD",
    description: "Corporate Surrealism for the daily commuter and the trendsetters alike.",
    detailed_description_html: `
  <p><a href="https://www.licc.uk/winners/winner.php?id=2-36390-25&OS=true" target="_blank" rel="noreferrer">Official Selection for the 2024 London International Creative Competition (LICC) in Create/Art</a> category, the <i>Remains</i> series was born from a subtle sense of the absurd.  While studying ancient terracotta figurines, I found myself captivated by their familiar, awkward, and caught mid-nothing looks. They did not feel like monuments, but rather, their expressions leave a fascinating space for the imagination, making them perfect companions for the mundane settings of contemporary offices and modern life. <br>
This tote is crafted from durable 100% cotton twill. The sturdy cotton handles ensure comfort and resilience for frequent use. <br>
Dimensions: 35 x 35 cm</p>
    `.trim(),
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Remains Tote Bag",
    image_url: new URL("../assets/products/remainstote/Remains Tote 12.jpg", import.meta.url).href,
    is_active: true,
    category: "Apparel",
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

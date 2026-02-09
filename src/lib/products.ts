// Centralized product data (real products)
export const products = [
//   {
//     id: "horse-year-card",
//     title: "Year of the Horse Special Edition Card",
//     name: "Year of the Horse Special Edition Card",
//     price: 3.5,
//     currency: "USD",
//     description: "Featuring two original designs as exhibited at the United Nation Headquarters, New York. ",
//     detailed_description: "Printed on 100 lbs. paper. 5 x 7 inches. ",
//     dimensions: "Please provide a shipping address when you order.",
//     edition_info: null,
//     edition_size: null,
//     alt_text: "Year of the Horse Special Edition Card",
//     image_url: new URL("../assets/products/horseyearpostcard/4.jpg", import.meta.url).href,
//     is_active: true,
//     category: "Stationery",
//     created_at: new Date().toISOString(),
//   },
  {
    id: "tote",
    title: "Remains Tote Bag",
    name: "Remains Tote Bag",
    price: 39,
    currency: "USD",
    description: "Corporate Surrealism for commuters and high-fashion people alike.",
    detailed_description:`The Remains series began with a sense of quiet amusement, inspired by ancient ceramic figures that felt familiar, awkward, and caught mid-nothing. By placing durable historical forms next to disposable, banal systems of daily life, the work leans into absurdity, where ancient permanence meets modern triviality. 
    
This tote is crafted from durable 100% cotton twill. The sturdy cotton handles ensure comfort and resilience for frequent use. 
Dimension: 14 x 14 x 3 inches`,
    dimensions: ``,
    edition_info: null,
    edition_size: null,
    alt_text: "Remains Tote Bag",
    image_url: new URL("../assets/products/remainstote/Remains Tote 12.jpg", import.meta.url).href,
    is_active: true,
    category: "Apparel",
    created_at: new Date().toISOString(),
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

  { id: "4", product_id: "tote", image_url: new URL("../assets/products/remainstote/Remains Tote 9.jpg", import.meta.url).href, display_order: 0 },
{ id: "5", product_id: "tote", image_url: new URL("../assets/products/remainstote/Remains Tote 10.jpg", import.meta.url).href, display_order: 0 },

];

import ProductCard from "./ProductCard";
import poster1 from "@/assets/poster-1.jpg";
import mugProduct from "@/assets/mug-product.jpg";
import tshirtProduct from "@/assets/tshirt-product.jpg";

const products = [
  {
    id: "1",
    name: "I THOUGHT THIS WAS A GOOD IDEA",
    price: "£25",
    image: poster1,
    category: "POSTERS"
  },
  {
    id: "2",
    name: "PROBABLY NOT COFFEE",
    price: "£18",
    image: mugProduct,
    category: "HOMEWARES"
  },
  {
    id: "3",
    name: "I AM VERY IMPORTANT",
    price: "£35",
    image: tshirtProduct,
    category: "CLOTHING"
  },
  {
    id: "4",
    name: "WHAT EVEN IS THIS",
    price: "£15",
    image: poster1,
    category: "CARDS"
  },
  {
    id: "5",
    name: "SUSPICIOUS ACTIVITIES",
    price: "£28",
    image: mugProduct,
    category: "LIMITED EDITIONS"
  },
  {
    id: "6",
    name: "CLEARLY A MISTAKE",
    price: "£40",
    image: tshirtProduct,
    category: "BOOKS"
  }
];

const categories = ["ALL", "POSTERS", "CARDS", "LIMITED EDITIONS", "BOOKS", "CLOTHING", "ACCESSORIES", "HOMEWARES"];

const ProductGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="handwritten text-sm px-4 py-2 border-2 border-border hover:border-primary hover:text-primary transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="handwritten text-sm px-8 py-3 border-2 border-border hover:border-primary hover:text-primary transition-colors">
            LOAD MORE REALLY GOOD STUFF
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
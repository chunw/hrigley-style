import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

const ProductCard = ({ name, price, image, category }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 border-2 border-border">
      <CardContent className="p-4">
        <div className="aspect-square bg-muted mb-4 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs handwritten text-muted-foreground">{category}</p>
          <h3 className="handwritten text-lg leading-tight">{name}</h3>
          <p className="handwritten text-xl font-bold">{price}</p>
          
          <Button 
            className="w-full handwritten bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            ADD TO BAG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
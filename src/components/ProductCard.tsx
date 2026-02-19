import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  category: string | null;
}

const ProductCard = ({ id, name, title, description, price, currency, image_url, category, paylink }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    // 检查 gtag 是否存在（防止脚本还没加载完就点击报错）
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_paypal_link', {
        'event_category': 'ecommerce',
        'event_label': 'Chun Wang Shop Item - ' + (title || name),
        'value': 1 // 你可以标记这个动作的权重
      });
    }
    e.stopPropagation(); // Prevent card navigation when clicking button
    window.open(paylink, '_blank');
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 border-2 border-border cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-4">
        <div className="aspect-square bg-black mb-4 overflow-hidden">
          <img 
            src={image_url || "/placeholder.svg"} 
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              console.log('Image failed to load:', image_url);
              e.currentTarget.src = "/placeholder.svg";
            }}
            loading="lazy"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs handwritten text-muted-foreground">{category}</p>
          <h3 className="text-lg leading-tight handwritten">{title || name}</h3>
          {description && (
            <p className="text-sm font-helvetica text-muted-foreground line-clamp-2">{description}</p>
          )}
          <p className="text-lg font-bold handwritten">
            {currency === 'gbp' ? '£' : '$'}{price.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground font-helvetica">Shipping included</p>
       
          <Button 
            variant="outline-pink"
            className="w-full handwritten"
            size="sm"
            onClick={handleOrderNow}
          >
            <b>ORDER NOW</b>
          </Button>

             </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
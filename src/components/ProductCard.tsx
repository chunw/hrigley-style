import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const ProductCard = ({ id, name, title, description, price, currency, image_url, category }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation when clicking buy button
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { productId: id }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive",
      });
      console.error('Payment error:', error);
    }
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
          <h3 className="handwritten text-lg leading-tight">{title || name}</h3>
          {description && (
            <p className="text-sm font-semibold text-muted-foreground line-clamp-2">{description}</p>
          )}
          <p className="handwritten text-lg font-bold">
            {currency === 'gbp' ? '£' : '$'}{price.toFixed(2)}
          </p>
          
          <Button 
            variant="outline-pink"
            className="w-full handwritten"
            size="sm"
            onClick={handleBuyNow}
          >
            <b>BUY NOW</b>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
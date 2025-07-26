import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useProductDetails, useProductImages, useRelatedProducts } from "@/hooks/useProductDetails";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading: productLoading, error: productError } = useProductDetails(id!);
  const { data: images, isLoading: imagesLoading } = useProductImages(id!);
  const { data: relatedProducts } = useRelatedProducts(product?.category || "", id!);

  if (productLoading || imagesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Combine main product image with additional images from product_images table
  const allImages = [
    { image_url: product.image_url, alt_text: product.name || product.title },
    ...(images || [])
  ].filter(img => img.image_url); // Filter out any null/undefined image URLs
  
  const currentImage = allImages[selectedImageIndex];

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'gbp' ? '£' : currency === 'eur' ? '€' : '$';
    return `${symbol}${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 handwritten"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 border-2 border-primary/20">
              <img
                src={currentImage?.image_url || "/placeholder.svg"}
                alt={currentImage?.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Carousel */}
            {allImages.length > 1 && (
              <div className="w-full">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {allImages.map((image, index) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/4">
                        <button
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImageIndex === index 
                              ? 'border-primary' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image.image_url || "/placeholder.svg"}
                            alt={image.alt_text || `${product.name} view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="shrigley-title text-3xl md:text-4xl leading-tight mb-2">
                {product.title || product.name}
              </h1>
              {product.category && (
                <Badge variant="secondary" className="handwritten text-sm">
                  {product.category}
                </Badge>
              )}
            </div>

            <div className="text-2xl font-bold text-primary">
              {formatPrice(product.price, product.currency)}
            </div>

            {product.description && (
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground font-helvetica">{product.description}</p>
              </div>
            )}

            {product.detailed_description && (
              <div className="space-y-2">
                <h3 className="font-semibold">Details</h3>
                <div className="text-muted-foreground font-helvetica whitespace-pre-wrap">
                  {product.detailed_description}
                </div>
              </div>
            )}

            {product.dimensions && (
              <div className="space-y-2">
                <h3 className="font-semibold">Dimensions</h3>
                <p className="text-muted-foreground font-helvetica">{product.dimensions}</p>
              </div>
            )}

            {product.edition_info && (
              <div className="space-y-2">
                <h3 className="font-semibold">Edition Info</h3>
                <p className="text-muted-foreground font-helvetica">{product.edition_info}</p>
              </div>
            )}

            {product.edition_size && (
              <div className="space-y-2">
                <h3 className="font-semibold">Edition Size</h3>
                <p className="text-muted-foreground font-helvetica">Limited edition of {product.edition_size}</p>
              </div>
            )}

            <div className="pt-4">
              <Button 
                variant="outline-pink"
                size="lg" 
                onClick={handleAddToCart}
                className="w-full handwritten text-lg font-bold px-8 py-6"
              >
                ADD TO CART
              </Button>
            </div>

            <div className="text-sm text-muted-foreground font-helvetica space-y-1">
              <p>This print is sold unframed.</p>
              <p>It is possible to pay for this work in instalments.</p>
              <p>** If you order from outside the EU: VAT equivalent of 5% of the price will be removed in the checkout **</p>
              <p>Important info: as stated in our cancellation policy, if you order this print and then decide to cancel, we charge a 5% cancellation charge to cover the refund fees we incur.</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="shrigley-title text-2xl md:text-3xl mb-8 text-center">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  title={relatedProduct.title}
                  description={relatedProduct.description}
                  price={relatedProduct.price}
                  currency={relatedProduct.currency}
                  image_url={relatedProduct.image_url}
                  category={relatedProduct.category}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
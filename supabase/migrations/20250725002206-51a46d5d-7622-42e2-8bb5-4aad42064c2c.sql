-- Create products table to store product information
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'gbp',
  image_url TEXT,
  description TEXT,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to view active products (public store)
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Create policy for admin access (you can modify this later based on your admin setup)
CREATE POLICY "Admin can manage products" 
ON public.products 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample products
INSERT INTO public.products (name, price, currency, image_url, description, category) VALUES
('I THOUGHT THIS WAS A GOOD IDEA', 25.00, 'gbp', NULL, 'A really good poster that makes you think', 'PRINTED MATTER'),
('PROBABLY NOT COFFEE', 18.00, 'gbp', NULL, 'A mug for things that are probably not coffee', 'ACCESSORIES'),
('I AM VERY IMPORTANT', 35.00, 'gbp', NULL, 'Declare your importance with this fine garment', 'LIMITED EDITIONS'),
('WHAT EVEN IS THIS', 15.00, 'gbp', NULL, 'An excellent question in card form', 'PRINTED MATTER'),
('SUSPICIOUS ACTIVITIES', 28.00, 'gbp', NULL, 'For all your suspicious activity needs', 'LIMITED EDITIONS'),
('CLEARLY A MISTAKE', 40.00, 'gbp', NULL, 'Sometimes mistakes are the best thing that happens', 'ACCESSORIES');
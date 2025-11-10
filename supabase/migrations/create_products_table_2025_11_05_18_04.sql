-- Create products table for Pi Network shop
CREATE TABLE IF NOT EXISTS public.products_2025_11_05_18_04 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage INTEGER DEFAULT 0,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  specifications TEXT,
  category TEXT DEFAULT 'smartphone',
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders_2025_11_05_18_04 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products_2025_11_05_18_04(id),
  customer_email TEXT,
  customer_name TEXT,
  passphrase TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert 15 phone products
INSERT INTO public.products_2025_11_05_18_04 (name, description, price, original_price, discount_percentage, image_url, rating, review_count, specifications) VALUES
('iPhone 16 Pro Max', 'Latest flagship with A18 Pro chip', 1299.00, 1499.00, 13, '/images/iphone-16-pro-max.jpg', 4.9, 2847, 'A18 Pro Chip • 48MP Camera • 6.9" Display'),
('Samsung Galaxy S24 Ultra', 'Premium Android with S Pen', 1199.00, 1399.00, 14, '/images/galaxy-s24-ultra.jpg', 4.8, 1923, 'Snapdragon 8 Gen 3 • 200MP Camera • S Pen'),
('iPhone 15 Pro', 'Titanium design with USB-C', 999.00, 1199.00, 17, '/images/iphone-15-pro.jpg', 4.7, 3421, 'A17 Pro Chip • Titanium • USB-C'),
('Google Pixel 8 Pro', 'AI-powered photography', 899.00, 999.00, 10, '/images/pixel-8-pro.jpg', 4.6, 1567, 'Tensor G3 • Magic Eraser • 7 years updates'),
('OnePlus 12', 'Flagship killer with fast charging', 799.00, 899.00, 11, '/images/oneplus-12.jpg', 4.5, 892, 'Snapdragon 8 Gen 3 • 100W charging • Hasselblad'),
('Xiaomi 14 Ultra', 'Photography flagship', 1099.00, 1299.00, 15, '/images/xiaomi-14-ultra.jpg', 4.8, 1234, 'Snapdragon 8 Gen 3 • Leica cameras • 90W charging'),
('iPhone 14 Pro Max', 'Dynamic Island innovation', 899.00, 1099.00, 18, '/images/iphone-14-pro-max.jpg', 4.7, 4567, 'A16 Bionic • Dynamic Island • 48MP Pro camera'),
('Samsung Galaxy S23 FE', 'Fan Edition flagship', 599.00, 699.00, 14, '/images/galaxy-s23-fe.jpg', 4.4, 987, 'Exynos 2200 • 50MP camera • 120Hz display'),
('Nothing Phone 2', 'Transparent design', 699.00, 799.00, 13, '/images/nothing-phone-2.jpg', 4.3, 756, 'Snapdragon 8+ Gen 1 • Glyph Interface • 120Hz'),
('Realme GT 5 Pro', 'Gaming powerhouse', 549.00, 649.00, 15, '/images/realme-gt-5-pro.jpg', 4.5, 643, 'Snapdragon 8 Gen 3 • 144Hz • 100W SuperVOOC'),
('Oppo Find X7 Ultra', 'Hasselblad cameras', 999.00, 1199.00, 17, '/images/oppo-find-x7-ultra.jpg', 4.6, 1123, 'Snapdragon 8 Gen 3 • Hasselblad • Periscope zoom'),
('Vivo X100 Pro', 'Portrait photography', 849.00, 999.00, 15, '/images/vivo-x100-pro.jpg', 4.5, 876, 'Dimensity 9300 • Zeiss optics • 120W charging'),
('Honor Magic 6 Pro', 'AI photography', 799.00, 899.00, 11, '/images/honor-magic-6-pro.jpg', 4.4, 654, 'Snapdragon 8 Gen 3 • AI photography • 80W wireless'),
('Motorola Edge 50 Ultra', 'Premium mid-range', 699.00, 799.00, 13, '/images/motorola-edge-50-ultra.jpg', 4.3, 432, 'Snapdragon 8s Gen 3 • 125W charging • Clean Android'),
('Asus ROG Phone 8', 'Gaming beast', 1199.00, 1399.00, 14, '/images/asus-rog-phone-8.jpg', 4.7, 1987, 'Snapdragon 8 Gen 3 • Gaming triggers • 165Hz display');

-- Enable RLS
ALTER TABLE public.products_2025_11_05_18_04 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_2025_11_05_18_04 ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read access)
CREATE POLICY "Allow public read access to products" ON public.products_2025_11_05_18_04
FOR SELECT USING (true);

-- Create policies for orders (allow insert for anyone)
CREATE POLICY "Allow insert orders" ON public.orders_2025_11_05_18_04
FOR INSERT WITH CHECK (true);
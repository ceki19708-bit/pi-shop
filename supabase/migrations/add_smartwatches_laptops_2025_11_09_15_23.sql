-- Insert 15 new products: 8 smartwatches and 7 laptops
INSERT INTO public.products_2025_11_05_18_04 (name, description, price, original_price, discount_percentage, image_url, rating, review_count, specifications, category) VALUES

-- Smartwatches (8 products)
('Apple Watch Ultra 2', 'Most rugged and capable Apple Watch', 799.00, 899.00, 11, '/images/smartwatches_3.jpeg', 4.8, 1456, 'Titanium Case • GPS + Cellular • Action Button • 36hr Battery', 'smartwatch'),
('Samsung Galaxy Watch 6 Classic', 'Premium Android smartwatch with rotating bezel', 429.00, 499.00, 14, '/images/smartwatches_7.jpeg', 4.7, 2134, 'Wear OS • Rotating Bezel • Health Sensors • 40hr Battery', 'smartwatch'),
('Apple Watch Series 9', 'Advanced health and fitness features', 399.00, 449.00, 11, '/images/smartwatches_2.jpeg', 4.6, 3245, 'S9 Chip • Double Tap • Precision Finding • ECG', 'smartwatch'),
('Samsung Galaxy Watch 6', 'Sleek design with comprehensive health tracking', 329.00, 379.00, 13, '/images/smartwatches_5.jpeg', 4.5, 1876, 'Wear OS • Body Composition • Sleep Tracking • Fast Charging', 'smartwatch'),
('Garmin Fenix 7X', 'Ultimate multisport GPS watch', 699.00, 799.00, 13, '/images/smartwatches_1.jpeg', 4.9, 987, 'Solar Charging • Multi-GNSS • 28-day Battery • Rugged Design', 'smartwatch'),
('Fitbit Sense 2', 'Advanced health and fitness smartwatch', 249.00, 299.00, 17, '/images/smartwatches_6.jpeg', 4.4, 1567, 'Stress Management • ECG • SpO2 • 6+ day Battery', 'smartwatch'),
('Huawei Watch GT 4', 'Elegant smartwatch with long battery life', 279.00, 329.00, 15, '/images/smartwatches_4.jpeg', 4.5, 1234, 'HarmonyOS • 14-day Battery • Health Monitoring • Premium Design', 'smartwatch'),
('Amazfit GTR 4', 'Feature-rich smartwatch with GPS', 199.00, 249.00, 20, '/images/smartwatches_8.jpeg', 4.3, 892, 'Zepp OS • 14-day Battery • 150+ Sports Modes • Always-on Display', 'smartwatch'),

-- Laptops (7 products)
('MacBook Pro 16" M3 Max', 'Ultimate creative powerhouse', 3499.00, 3999.00, 13, '/images/laptops_1.jpeg', 4.9, 1876, 'M3 Max Chip • 36GB RAM • 1TB SSD • Liquid Retina XDR Display', 'laptop'),
('Dell XPS 15 OLED', 'Premium Windows laptop with stunning display', 2299.00, 2699.00, 15, '/images/laptops_2.jpeg', 4.7, 1456, 'Intel i9 • RTX 4070 • 32GB RAM • 15.6" 4K OLED • Carbon Fiber', 'laptop'),
('MacBook Air 15" M3', 'Incredibly thin and light powerhouse', 1299.00, 1499.00, 13, '/images/laptops_3.jpeg', 4.8, 2345, 'M3 Chip • 16GB RAM • 512GB SSD • 15.3" Liquid Retina • All-day Battery', 'laptop'),
('HP Spectre x360 16', 'Convertible laptop with premium design', 1799.00, 2099.00, 14, '/images/laptops_4.jpeg', 4.6, 1234, 'Intel i7 • RTX 4050 • 16GB RAM • 16" 3K+ OLED • 360° Hinge', 'laptop'),
('Lenovo ThinkPad X1 Carbon', 'Business ultrabook with legendary durability', 1899.00, 2199.00, 14, '/images/laptops_5.jpeg', 4.7, 1567, 'Intel i7 • 32GB RAM • 1TB SSD • 14" 2.8K • Military-grade Tested', 'laptop'),
('ASUS ROG Zephyrus G16', 'Gaming laptop with creator features', 2499.00, 2899.00, 14, '/images/laptops_6.jpeg', 4.8, 987, 'Intel i9 • RTX 4080 • 32GB RAM • 16" 240Hz OLED • ROG Nebula Display', 'laptop'),
('Surface Laptop Studio 2', 'Versatile laptop for creators and professionals', 1999.00, 2299.00, 13, '/images/laptops_7.jpeg', 4.5, 1123, 'Intel i7 • RTX 4060 • 32GB RAM • 14.4" PixelSense • Dynamic Woven Hinge', 'laptop');
-- Add color and storage options to products table
ALTER TABLE public.products_2025_11_05_18_04 
ADD COLUMN available_colors TEXT[] DEFAULT ARRAY['Space Black', 'Silver', 'Gold'],
ADD COLUMN available_storage TEXT[] DEFAULT ARRAY['128GB', '256GB', '512GB', '1TB'];

-- Add selected color and storage to orders table
ALTER TABLE public.orders_2025_11_05_18_04 
ADD COLUMN selected_color TEXT,
ADD COLUMN selected_storage TEXT;

-- Update existing products with specific color and storage options
UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
  available_storage = ARRAY['256GB', '512GB', '1TB']
WHERE name LIKE '%iPhone%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Phantom Black', 'Cream', 'Green', 'Violet'],
  available_storage = ARRAY['256GB', '512GB', '1TB']
WHERE name LIKE '%Samsung Galaxy S24 Ultra%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Obsidian', 'Porcelain', 'Bay Blue'],
  available_storage = ARRAY['128GB', '256GB', '512GB', '1TB']
WHERE name LIKE '%Google Pixel%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Flowy Emerald', 'Silky Black', 'Rock Grey'],
  available_storage = ARRAY['256GB', '512GB', '1TB']
WHERE name LIKE '%OnePlus%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Black', 'White'],
  available_storage = ARRAY['256GB', '512GB', '1TB']
WHERE name LIKE '%Xiaomi%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Dark Grey', 'Light Grey'],
  available_storage = ARRAY['128GB', '256GB', '512GB']
WHERE name LIKE '%Nothing%';

-- Update smartwatches with band colors and sizes
UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Orange Alpine Loop', 'Blue Alpine Loop', 'Green Alpine Loop', 'Indigo Alpine Loop'],
  available_storage = ARRAY['49mm', '45mm']
WHERE name LIKE '%Apple Watch Ultra%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Midnight', 'Starlight', 'Silver', 'Product Red'],
  available_storage = ARRAY['41mm', '45mm']
WHERE name LIKE '%Apple Watch Series%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Graphite', 'Silver', 'Gold'],
  available_storage = ARRAY['40mm', '44mm']
WHERE name LIKE '%Samsung Galaxy Watch%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Black', 'Solar Flare Orange'],
  available_storage = ARRAY['47mm', '51mm']
WHERE name LIKE '%Garmin%';

-- Update laptops with colors and RAM/Storage configs
UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Space Black', 'Silver'],
  available_storage = ARRAY['512GB SSD', '1TB SSD', '2TB SSD', '4TB SSD']
WHERE name LIKE '%MacBook%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Platinum Silver', 'Graphite'],
  available_storage = ARRAY['512GB SSD', '1TB SSD', '2TB SSD']
WHERE name LIKE '%Dell XPS%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Nocturne Blue', 'Natural Silver'],
  available_storage = ARRAY['512GB SSD', '1TB SSD']
WHERE name LIKE '%HP Spectre%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Carbon Black', 'Storm Grey'],
  available_storage = ARRAY['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD']
WHERE name LIKE '%ThinkPad%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Eclipse Gray', 'Off Black'],
  available_storage = ARRAY['1TB SSD', '2TB SSD']
WHERE name LIKE '%ASUS ROG%';

UPDATE public.products_2025_11_05_18_04 SET 
  available_colors = ARRAY['Platinum', 'Sapphire'],
  available_storage = ARRAY['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD']
WHERE name LIKE '%Surface%';
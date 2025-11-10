-- Add billing_address column to orders table
ALTER TABLE public.orders_2025_11_05_18_04 
ADD COLUMN billing_address TEXT;
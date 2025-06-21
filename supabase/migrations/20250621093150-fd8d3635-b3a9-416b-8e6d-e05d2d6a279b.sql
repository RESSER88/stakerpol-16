
-- Dodaj publiczne polityki SELECT dla tabeli products (umożliwi odczyt wszystkim użytkownikom)
CREATE POLICY "Public can view all products"
ON public.products FOR SELECT
USING (true);

-- Dodaj publiczne polityki SELECT dla tabeli product_images (umożliwi odczyt wszystkim użytkownikom)  
CREATE POLICY "Public can view all product images"
ON public.product_images FOR SELECT
USING (true);

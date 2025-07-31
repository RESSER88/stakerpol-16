
-- Dodanie kolumny slug do tabeli products
ALTER TABLE public.products 
ADD COLUMN slug text;

-- Utworzenie unique index na slug
CREATE UNIQUE INDEX products_slug_idx ON public.products (slug);

-- Funkcja do generowania slug-ów z nazwy produktu
CREATE OR REPLACE FUNCTION generate_product_slug(product_name text, serial_number text DEFAULT NULL)
RETURNS text AS $$
DECLARE
    base_slug text;
    final_slug text;
    counter integer := 1;
BEGIN
    -- Normalizacja nazwy produktu do slug
    base_slug := lower(product_name);
    base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    -- Dodanie numeru seryjnego jeśli jest dostępny
    IF serial_number IS NOT NULL AND serial_number != '' THEN
        base_slug := base_slug || '-' || serial_number;
    END IF;
    
    final_slug := base_slug;
    
    -- Sprawdzenie unikalności i dodanie liczby jeśli potrzeba
    WHILE EXISTS (SELECT 1 FROM public.products WHERE slug = final_slug) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Wygenerowanie slug-ów dla istniejących produktów
UPDATE public.products 
SET slug = generate_product_slug(name, serial_number) 
WHERE slug IS NULL;

-- Ustawienie slug jako NOT NULL po wygenerowaniu wartości
ALTER TABLE public.products 
ALTER COLUMN slug SET NOT NULL;

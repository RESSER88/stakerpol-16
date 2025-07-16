-- Fix search_path vulnerabilities in all database functions

-- 1. Update get_unposted_product function
CREATE OR REPLACE FUNCTION public.get_unposted_product(platform_name text, auto_reset boolean DEFAULT true)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    result JSON;
    available_count INTEGER;
BEGIN
    -- Sprawdź czy są dostępne nieopublikowane produkty
    SELECT COUNT(*)
    INTO available_count
    FROM public.products p
    WHERE p.id NOT IN (
        SELECT product_id 
        FROM public.social_media_posts 
        WHERE platform = platform_name
    )
    AND EXISTS (
        SELECT 1 FROM public.product_images pi 
        WHERE pi.product_id = p.id
    );
    
    -- Jeśli nie ma dostępnych produktów i auto_reset jest włączony
    IF available_count = 0 AND auto_reset THEN
        -- Reset rotacji dla tej platformy
        DELETE FROM public.social_media_posts 
        WHERE platform = platform_name;
        
        -- Log automatycznego resetu
        RAISE NOTICE 'Auto-reset executed for platform: %', platform_name;
    END IF;
    
    -- Pobierz losowy nieopublikowany produkt z pełnymi danymi
    SELECT json_build_object(
        'product', row_to_json(p.*),
        'images', COALESCE(array_agg(
            json_build_object(
                'id', pi.id,
                'image_url', pi.image_url,
                'alt_text', pi.alt_text,
                'display_order', pi.display_order
            ) ORDER BY pi.display_order
        ) FILTER (WHERE pi.id IS NOT NULL), '{}'),
        'auto_reset_executed', (available_count = 0 AND auto_reset)
    )
    INTO result
    FROM public.products p
    LEFT JOIN public.product_images pi ON p.id = pi.product_id
    WHERE p.id NOT IN (
        SELECT product_id 
        FROM public.social_media_posts 
        WHERE platform = platform_name
    )
    AND EXISTS (
        SELECT 1 FROM public.product_images pi2 
        WHERE pi2.product_id = p.id
    )
    GROUP BY p.id, p.name, p.serial_number, p.short_description, 
             p.detailed_description, p.condition, p.production_year,
             p.working_hours, p.lift_height, p.lift_capacity_initial,
             p.lift_capacity_mast, p.free_lift, p.min_height,
             p.dimensions, p.drive_type, p.mast, p.wheels,
             p.foldable_platform, p.battery, p.initial_lift,
             p.additional_options, p.image_url, p.created_at, p.updated_at
    ORDER BY RANDOM()
    LIMIT 1;
    
    RETURN result;
END;
$function$;

-- 2. Update log_social_post function
CREATE OR REPLACE FUNCTION public.log_social_post(product_uuid uuid, platform_name text, external_post_id text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    result JSON;
BEGIN
    INSERT INTO public.social_media_posts (product_id, platform, post_id)
    VALUES (product_uuid, platform_name, external_post_id)
    ON CONFLICT (product_id, platform) 
    DO UPDATE SET posted_at = now(), post_id = EXCLUDED.post_id
    RETURNING json_build_object(
        'success', true,
        'product_id', product_id,
        'platform', platform,
        'posted_at', posted_at
    ) INTO result;
    
    RETURN result;
END;
$function$;

-- 3. Update reset_platform_rotation function
CREATE OR REPLACE FUNCTION public.reset_platform_rotation(platform_name text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    deleted_count INTEGER;
    result JSON;
BEGIN
    DELETE FROM public.social_media_posts 
    WHERE platform = platform_name;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    SELECT json_build_object(
        'success', true,
        'platform', platform_name,
        'deleted_posts', deleted_count,
        'reset_at', now()
    ) INTO result;
    
    RETURN result;
END;
$function$;

-- 4. Update get_rotation_stats function
CREATE OR REPLACE FUNCTION public.get_rotation_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    result JSON;
    total_products_with_images INTEGER;
BEGIN
    -- Pobierz całkowitą liczbę produktów z obrazami
    SELECT COUNT(*) 
    INTO total_products_with_images
    FROM public.products p 
    WHERE EXISTS(
        SELECT 1 FROM public.product_images pi 
        WHERE pi.product_id = p.id
    );
    
    SELECT json_build_object(
        'total_products_with_images', total_products_with_images,
        'stats', json_agg(
            json_build_object(
                'platform', platform,
                'posted_products', count,
                'remaining_products', (
                    total_products_with_images - count
                ),
                'rotation_progress_percent', 
                CASE 
                    WHEN total_products_with_images > 0 
                    THEN ROUND((count::DECIMAL / total_products_with_images * 100), 1)
                    ELSE 0 
                END,
                'needs_reset', (count >= total_products_with_images)
            )
        )
    )
    INTO result
    FROM (
        SELECT 
            platform,
            COUNT(*) as count
        FROM public.social_media_posts 
        GROUP BY platform
        
        UNION ALL
        
        SELECT 'telegram', 0 WHERE NOT EXISTS (SELECT 1 FROM public.social_media_posts WHERE platform = 'telegram')
        UNION ALL
        SELECT 'instagram', 0 WHERE NOT EXISTS (SELECT 1 FROM public.social_media_posts WHERE platform = 'instagram')
        UNION ALL
        SELECT 'facebook', 0 WHERE NOT EXISTS (SELECT 1 FROM public.social_media_posts WHERE platform = 'facebook')
        UNION ALL
        SELECT 'tiktok', 0 WHERE NOT EXISTS (SELECT 1 FROM public.social_media_posts WHERE platform = 'tiktok')
    ) stats;
    
    RETURN result;
END;
$function$;

-- 5. Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- 6. Update get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$function$;

-- 7. Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  user_count INTEGER;
BEGIN
  -- Count existing users
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  -- If this is the first user or the user email is info@stakerpol.pl, make them admin
  IF user_count <= 1 OR NEW.email = 'info@stakerpol.pl' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 8. Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;
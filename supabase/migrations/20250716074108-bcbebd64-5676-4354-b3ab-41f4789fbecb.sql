-- Create debugging version of get_unposted_product function
CREATE OR REPLACE FUNCTION public.get_unposted_product_debug(platform_name text, auto_reset boolean DEFAULT true)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    result JSON;
    available_count INTEGER;
    debug_info JSONB;
    total_products INTEGER;
    total_with_images INTEGER;
    posted_count INTEGER;
BEGIN
    -- Collect debug information
    SELECT COUNT(*) INTO total_products FROM public.products;
    
    SELECT COUNT(*) INTO total_with_images 
    FROM public.products p 
    WHERE EXISTS (
        SELECT 1 FROM public.product_images pi 
        WHERE pi.product_id = p.id
    );
    
    SELECT COUNT(*) INTO posted_count 
    FROM public.social_media_posts 
    WHERE platform = platform_name;
    
    -- Log debug info
    RAISE NOTICE 'DEBUG: Platform: %, Total products: %, With images: %, Posted: %', 
        platform_name, total_products, total_with_images, posted_count;
    
    -- Check available unposted products
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
    
    RAISE NOTICE 'DEBUG: Available unposted products: %', available_count;
    
    -- Auto-reset logic
    IF available_count = 0 AND auto_reset THEN
        DELETE FROM public.social_media_posts 
        WHERE platform = platform_name;
        
        GET DIAGNOSTICS posted_count = ROW_COUNT;
        RAISE NOTICE 'DEBUG: Auto-reset executed, deleted % posts', posted_count;
    END IF;
    
    -- Build debug info
    debug_info := jsonb_build_object(
        'timestamp', now(),
        'platform', platform_name,
        'total_products', total_products,
        'products_with_images', total_with_images,
        'posted_products', posted_count,
        'available_products', available_count,
        'auto_reset_executed', (available_count = 0 AND auto_reset)
    );
    
    -- Get random unposted product
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
        'debug_info', debug_info
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
    
    -- Log final result
    RAISE NOTICE 'DEBUG: Function completed, returning product: %', 
        CASE WHEN result IS NOT NULL THEN 'YES' ELSE 'NO' END;
    
    RETURN result;
END;
$function$;
-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.user_roles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM public.user_roles WHERE id = (SELECT auth.uid())) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search customers by name
CREATE OR REPLACE FUNCTION public.search_customers(search_query TEXT)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  middle_initial TEXT,
  address TEXT,
  phone_number TEXT,
  email TEXT,
  unit_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.first_name,
    c.last_name,
    c.middle_initial,
    c.address,
    c.phone_number,
    c.email,
    COUNT(u.id) as unit_count
  FROM public.customers c
  LEFT JOIN public.units u ON c.id = u.customer_id
  WHERE 
    c.first_name ILIKE '%' || search_query || '%' OR
    c.last_name ILIKE '%' || search_query || '%' OR
    (c.first_name || ' ' || c.last_name) ILIKE '%' || search_query || '%'
  GROUP BY c.id
  ORDER BY c.last_name, c.first_name
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get customer with units and job history
CREATE OR REPLACE FUNCTION public.get_customer_profile(customer_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'customer', (
      SELECT row_to_json(c) 
      FROM public.customers c 
      WHERE c.id = customer_id
    ),
    'units', (
      SELECT json_agg(row_to_json(u))
      FROM public.units u
      WHERE u.customer_id = customer_id
    ),
    'jobs', (
      SELECT json_agg(
        json_build_object(
          'id', j.id,
          'work_date', j.work_date,
          'duration_hours', j.duration_hours,
          'remarks', j.remarks,
          'unit', (
            SELECT row_to_json(u)
            FROM public.units u
            WHERE u.id = j.unit_id
          ),
          'items', (
            SELECT json_agg(row_to_json(ji))
            FROM public.job_items ji
            WHERE ji.job_id = j.id
          ),
          'created_at', j.created_at
        )
      )
      FROM public.jobs j
      WHERE j.customer_id = customer_id
      ORDER BY j.work_date DESC
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


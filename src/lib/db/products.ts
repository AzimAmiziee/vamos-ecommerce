import { createClient } from '@/lib/supabase/server';

export interface DBProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string | null;
  hover_image: string | null;
  category: string;
  collection: string | null;
  description: string | null;
  sizes: string[];
  rating: number;
  in_stock: boolean;
  sort_order: number;
}

export async function getProducts(): Promise<DBProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getProducts error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getProductById(id: string): Promise<DBProduct | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  return data ?? null;
}

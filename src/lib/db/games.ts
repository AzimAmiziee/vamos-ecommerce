import { createServerSupabase } from '@/lib/supabase';

export interface DBGamePackage {
  id: string;
  game_id: string;
  package_key: string;
  amount: string;
  price: number;
  bonus: string | null;
  popular: boolean;
  sort_order: number;
  package_type: 'currency' | 'subscription' | 'bundle';
}

export interface DBGame {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  currency: string;
  color: string;
  color_secondary: string;
  image: string | null;
  category: 'Mobile Game' | 'PC Game' | 'Voucher';
  description: string | null;
  sort_order: number;
  game_packages?: DBGamePackage[];
}

export async function getGames(): Promise<DBGame[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('games')
    .select('*, game_packages(*)')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getGames error:', error.message);
    return [];
  }
  return (data ?? []) as DBGame[];
}

export async function getGameBySlug(slug: string): Promise<DBGame | null> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('games')
    .select('*, game_packages(*)')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (!data) return null;
  const game = data as DBGame;
  if (game.game_packages) {
    game.game_packages = game.game_packages.sort((a, b) => a.sort_order - b.sort_order);
  }
  return game;
}

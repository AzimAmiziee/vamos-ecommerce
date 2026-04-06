import { createClient } from '@/lib/supabase/client';

export interface TopSpender {
  rank: number;
  user_id: string;
  display_name: string;
  total_spent: number;
  total_points: number;
  order_count: number;
}

export interface ActiveSeason {
  name: string;
  short_name: string;
  start_date: string;
  end_date: string;
  prize_desc: string | null;
}

export async function getTopSpenders(): Promise<TopSpender[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (createClient() as any).rpc('get_top_spenders', { p_limit: 5 });
  if (error) return [];
  return (data ?? []) as TopSpender[];
}

export async function getActiveSeason(): Promise<ActiveSeason | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (createClient() as any).rpc('get_active_season');
  if (error || !data?.length) return null;
  return data[0] as ActiveSeason;
}

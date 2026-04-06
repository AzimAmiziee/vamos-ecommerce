import { createClient } from '@/lib/supabase/client';

export interface DBMatch {
  id: string;
  season: string;
  week: number | null;
  match_date: string;
  home_team: string;
  away_team: string;
  home_logo: string | null;
  away_logo: string | null;
  format: 'Bo1' | 'Bo3' | 'Bo5';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  home_score: number | null;
  away_score: number | null;
  is_vamos_home: boolean;
  sort_order: number;
}

export interface DBPrediction {
  id: string;
  user_id: string;
  match_id: string;
  pred_home: number;
  pred_away: number;
  is_correct: boolean | null;
  points_awarded: number;
}

export async function getMatches(): Promise<DBMatch[]> {
  const { data } = await createClient()
    .from('matches')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data ?? []) as DBMatch[];
}

export async function getUserPredictions(userId: string): Promise<DBPrediction[]> {
  const { data } = await createClient()
    .from('predictions')
    .select('*')
    .eq('user_id', userId);
  return (data ?? []) as DBPrediction[];
}

export async function submitPrediction(
  userId: string,
  matchId: string,
  predHome: number,
  predAway: number,
): Promise<boolean> {
  const { error } = await createClient().from('predictions').upsert({
    user_id: userId,
    match_id: matchId,
    pred_home: predHome,
    pred_away: predAway,
    is_correct: null,
    points_awarded: 0,
  }, { onConflict: 'user_id,match_id' });

  return !error;
}

import { createServerSupabase } from '@/lib/supabase';

// team logo map — local storage paths
const TEAM_LOGOS: Record<string, string> = {
  'Team Vamos':      '/storage/teams/vamos.webp',
  'SRG Esports':     '/storage/teams/srg.webp',
  'RRQ Tora':        '/storage/teams/rrq.webp',
  'Invictus Gaming': '/storage/teams/invictus.webp',
  'Bigetron MY':     '/storage/teams/bigetron.webp',
  'AC Esports':      '/storage/teams/acesports.webp',
  'Team Flash':      '/storage/teams/teamflash.webp',
  'Team Rey':        '/storage/teams/teamrey.webp',
  'Todak':           '/storage/teams/todak.webp',
};

export interface DBStanding {
  id: string;
  season: string;
  week: number | null;
  rank: number;
  team: string;
  logo?: string;
  match_wins: number;
  match_losses: number;
  game_wins: number;
  game_losses: number;
  points: number;
  is_vamos: boolean;
}

export async function getStandings(season = 'MPL MY S17'): Promise<DBStanding[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('standings')
    .select('*')
    .eq('season', season)
    .order('rank', { ascending: true });

  if (error) {
    console.error('getStandings error:', error.message);
    return [];
  }
  return (data ?? []).map((row) => ({ ...row, logo: TEAM_LOGOS[row.team] ?? null }));
}

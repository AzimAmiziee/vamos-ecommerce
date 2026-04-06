import { createClient } from '@/lib/supabase/server';

const S = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage`;

const TEAM_LOGOS: Record<string, string> = {
  'Team Vamos':      `${S}/teams/vamos.webp`,
  'SRG Esports':     `${S}/teams/srg.webp`,
  'RRQ Tora':        `${S}/teams/rrq.webp`,
  'Invictus Gaming': `${S}/teams/invictus.webp`,
  'Bigetron MY':     `${S}/teams/bigetron.webp`,
  'AC Esports':      `${S}/teams/acesports.webp`,
  'Team Flash':      `${S}/teams/teamflash.webp`,
  'Team Rey':        `${S}/teams/teamrey.webp`,
  'Todak':           `${S}/teams/todak.webp`,
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

export async function getActiveSeason(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'active_season')
    .single();
  return data?.value ?? 'MPL MY S17';
}

export async function getStandings(season?: string): Promise<DBStanding[]> {
  const supabase = await createClient();
  const activeSeason = season ?? await getActiveSeason();
  const { data, error } = await supabase
    .from('standings')
    .select('*')
    .eq('season', activeSeason)
    .order('rank', { ascending: true });

  if (error) {
    console.error('getStandings error:', error.message);
    return [];
  }
  return (data ?? []).map((row) => ({ ...row, logo: TEAM_LOGOS[row.team] ?? null }));
}

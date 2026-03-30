import Header from '@/app/components/Header';
import { getStandings } from '@/lib/db/standings';

export const revalidate = 300;

const RANK_STYLE: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: 'bg-yellow-500/20',  text: 'text-yellow-400',  label: '1st' },
  2: { bg: 'bg-gray-400/15',    text: 'text-gray-300',    label: '2nd' },
  3: { bg: 'bg-amber-700/20',   text: 'text-amber-600',   label: '3rd' },
};

export default async function StandingsPage() {
  const standings = await getStandings();

  const season = standings[0]?.season ?? 'MPL MY S17';
  const week   = standings[0]?.week;

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #040d14 0%, #071219 50%, #040d14 100%)' }}>
        <div className="absolute inset-0 bg-grid-lines opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full bg-[#42deef] opacity-[0.05] blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">{season}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
            League <span className="text-shimmer">Standings</span>
          </h1>
          {week && (
            <p className="text-gray-500 text-sm uppercase tracking-widest">
              Updated after <span className="text-white font-black">Week {week}</span>
            </p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {standings.length === 0 ? (
          <div className="text-center py-20 text-gray-600 uppercase tracking-widest text-xs">
            Standings not available yet.
          </div>
        ) : (
          <div className="space-y-2">

            {/* Header row */}
            <div className="hidden md:grid grid-cols-[48px_1fr_80px_80px_80px_80px_64px] items-center px-5 py-3 mb-1">
              <div className="text-[#42deef] text-[10px] font-black uppercase tracking-widest text-center">#</div>
              <div className="text-[#42deef] text-[10px] font-black uppercase tracking-widest">Team</div>
              <div className="text-[#42deef] text-[10px] font-black uppercase tracking-widest text-center">W</div>
              <div className="text-[#42deef] text-[10px] font-black uppercase tracking-widest text-center">L</div>
              <div className="text-[#42deef] text-[10px] font-black uppercase tracking-widest text-center">GW</div>
              <div className="text-[#42deef] text-[10px] font-black uppercase tracking-widest text-center">GL</div>
              <div className="text-[#42deef] text-[10px] font-black uppercase tracking-widest text-center">Pts</div>
            </div>

            {standings.map((entry) => {
              const rankStyle = RANK_STYLE[entry.rank];
              const isTop3 = entry.rank <= 3;

              return (
                <div
                  key={entry.id}
                  className={`relative group grid grid-cols-[48px_1fr_auto] md:grid-cols-[48px_1fr_80px_80px_80px_80px_64px] items-center px-5 py-4 border transition-all duration-200 overflow-hidden ${
                    entry.is_vamos
                      ? 'border-[#42deef]/40 bg-[#42deef]/5 hover:bg-[#42deef]/8 hover:border-[#42deef]/60'
                      : 'border-[#1A1A1A] bg-[#060d14] hover:border-[#2A2A2A] hover:bg-[#0A0A0A]'
                  }`}
                >
                  {/* Vamos glow accent */}
                  {entry.is_vamos && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#42deef]" />
                  )}

                  {/* Rank */}
                  <div className="flex items-center justify-center">
                    {rankStyle ? (
                      <div className={`w-8 h-8 flex items-center justify-center text-[11px] font-black rounded-full ${rankStyle.bg} ${rankStyle.text}`}>
                        {entry.rank}
                      </div>
                    ) : (
                      <span className={`text-sm font-black ${entry.is_vamos ? 'text-[#42deef]' : 'text-gray-600'}`}>
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Team name + logo */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 shrink-0 flex items-center justify-center rounded overflow-hidden border ${
                      entry.is_vamos ? 'border-[#42deef]/30 bg-[#42deef]/5' : 'border-[#1A1A1A] bg-[#0A0A0A]'
                    }`}>
                      {entry.logo ? (
                        <img
                          src={entry.logo}
                          alt={entry.team}
                          className="w-7 h-7 object-contain"
                        />
                      ) : (
                        <span className="text-gray-600 font-black text-[10px]">
                          {entry.team.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-black text-sm uppercase tracking-wide truncate ${entry.is_vamos ? 'text-[#42deef]' : 'text-white'}`}>
                        {entry.team}
                      </p>
                      {/* Mobile: show record inline */}
                      <p className="md:hidden text-gray-600 text-[10px] mt-0.5">
                        {entry.match_wins}W–{entry.match_losses}L · {entry.points} pts
                      </p>
                    </div>
                    {entry.is_vamos && (
                      <span className="hidden sm:inline-block bg-[#42deef] text-[#0A0A0A] text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 shrink-0">
                        US
                      </span>
                    )}
                  </div>

                  {/* Stats — hidden on mobile */}
                  <div className="hidden md:flex items-center justify-center">
                    <span className={`text-sm font-black ${entry.match_wins > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                      {entry.match_wins}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <span className={`text-sm font-black ${entry.match_losses > 0 ? 'text-red-400/80' : 'text-gray-600'}`}>
                      {entry.match_losses}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <span className="text-sm text-gray-400">{entry.game_wins}</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <span className="text-sm text-gray-400">{entry.game_losses}</span>
                  </div>

                  {/* Points */}
                  <div className="flex items-center justify-end md:justify-center gap-1">
                    <span className={`font-black text-lg leading-none ${entry.is_vamos ? 'text-[#42deef]' : isTop3 ? RANK_STYLE[entry.rank].text : 'text-white'}`}>
                      {entry.points}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-widest">
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" /> 1st Place
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-widest">
            <div className="w-3 h-3 rounded-full bg-gray-300/60" /> 2nd Place
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-widest">
            <div className="w-3 h-3 rounded-full bg-amber-700/80" /> 3rd Place
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-widest">
            <div className="w-3 h-3 bg-[#42deef]" /> Team Vamos
          </div>
          <p className="text-gray-700 text-[10px] uppercase tracking-widest ml-auto">
            W=Match Wins · L=Match Losses · GW=Game Wins · GL=Game Losses · Pts=Points
          </p>
        </div>
      </div>
    </div>
  );
}

import Header from '@/app/components/Header';
import Link from 'next/link';

const S = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage`;

const players = [
  { name: '2FAST',   image: 'https://www.vamos.com.my/cdn/shop/files/FREE_FIRE_PLAYER-2FAST.jpg?v=1744094878' },
  { name: 'ZUEZZ',   image: 'https://www.vamos.com.my/cdn/shop/files/FREE_FIRE_PLAYER-ZUEZZ.jpg?v=1744094878' },
  { name: 'LUFYYY',  image: 'https://www.vamos.com.my/cdn/shop/files/FREE_FIRE_PLAYER-LUFYYY.jpg?v=1744094879' },
  { name: 'THEAXEL', image: 'https://www.vamos.com.my/cdn/shop/files/FREE_FIRE_PLAYER-THEAXEL.jpg?v=1744094878' },
  { name: 'RAJA',    image: 'https://www.vamos.com.my/cdn/shop/files/FREE_FIRE_PLAYER-RAJA.jpg?v=1744094878' },
  { name: 'JUN',     image: 'https://www.vamos.com.my/cdn/shop/files/FREE_FIRE_PLAYER-JUN.jpg?v=1744094878' },
];

export default function FreeFirePage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A0A0A] pt-24 pb-20 px-4">
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[#42deef] opacity-[0.02] -skew-x-12 -translate-x-32" />
          <div className="absolute top-1/3 left-1/4 w-px h-48 bg-[#42deef] opacity-20" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-px bg-[#42deef] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-[#42deef]" />
                <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">Team Vamos</span>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none mb-3">
                FREE<br />
                <span className="text-[#42deef]">FIRE</span>
              </h1>
              <p className="text-gray-400 leading-relaxed max-w-md mb-8">
                Free Fire is a mobile battle royale where 50 players fight to be the last one standing.
                Fast-paced 10-minute matches, character abilities, and razor-sharp strategy —
                Team Vamos brings Malaysian firepower to every squad.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-[#42deef] text-[#0A0A0A] px-8 py-3 font-black text-xs tracking-[0.2em] uppercase hover:bg-[#1cc5d9] transition-colors"
                >
                  Shop Merch
                </Link>
                <Link
                  href="#roster"
                  className="border border-[#444] text-white px-8 py-3 font-black text-xs tracking-[0.2em] uppercase hover:border-white transition-colors"
                >
                  View Roster
                </Link>
              </div>
            </div>

            {/* Right — FF Logo */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#42deef] opacity-10 blur-3xl scale-125 rounded-full" />
                <img
                  src="https://www.vamos.com.my/cdn/shop/files/freefire.png?v=1760690109&width=400"
                  alt="Free Fire"
                  className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#42deef] py-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Squad Size',    value: '6' },
              { label: 'Game',          value: 'Free Fire' },
              { label: 'Platform',      value: 'Mobile' },
              { label: 'Region',        value: 'MY' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[#0A0A0A] font-black text-3xl md:text-4xl">{stat.value}</div>
                <div className="text-[#0A0A0A]/60 text-xs uppercase tracking-[0.2em] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Player Roster */}
      <section id="roster" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#42deef]" />
              <span className="text-[#42deef] text-xs font-black tracking-[0.3em] uppercase">Squad Lineup</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase">
              Meet The <span className="text-[#42deef]">Roster</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {players.map((player) => (
              <div
                key={player.name}
                className="group bg-[#111] border border-[#1A1A1A] hover:border-[#42deef] transition-colors duration-300 overflow-hidden"
              >
                {/* Player Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0A]">
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-6 h-0.5 bg-[#42deef] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-0 left-0 w-0.5 h-6 bg-[#42deef] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Player Name */}
                <div className="p-3 text-center">
                  <p className="text-white font-black uppercase tracking-widest text-xs group-hover:text-[#42deef] transition-colors">
                    {player.name}
                  </p>
                  <p className="text-gray-600 text-xs uppercase tracking-widest mt-0.5">Player</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Game */}
      <section className="py-20 px-4 bg-[#0D0D0D] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#42deef]" />
                <span className="text-[#42deef] text-xs font-black tracking-[0.3em] uppercase">About the Game</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6 leading-tight">
                Battle Royale <br />
                <span className="text-[#42deef]">Redefined</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-5">
                Free Fire drops 50 players onto a remote island where only one squad survives. The play zone
                shrinks with every passing second, forcing every player into closer, more brutal confrontations.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Matches last approximately 10 minutes — short, sharp, and unforgiving. Characters come with
                unique special abilities, adding a layer of tactical depth that separates amateurs from pros.
                Team Vamos plays at that elite level.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-[#111] border border-[#1A1A1A] flex items-center justify-center overflow-hidden relative">
                <img
                  src={`${S}/freefire/free-fire.webp`}
                  alt="Free Fire"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-10 h-1 bg-[#42deef]" />
                <div className="absolute top-0 left-0 w-1 h-10 bg-[#42deef]" />
                <div className="absolute bottom-0 right-0 w-10 h-1 bg-[#42deef]" />
                <div className="absolute bottom-0 right-0 w-1 h-10 bg-[#42deef]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop CTA */}
      <section className="py-20 px-4 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#42deef] opacity-5 blur-3xl rounded-full" />
        </div>
        <div className="max-w-xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black tracking-[0.3em] uppercase">Official Merch</span>
            <div className="h-px w-8 bg-[#42deef]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
            Rep The <span className="text-[#42deef]">Squad</span>
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            Wear the colours of Team Vamos. Official merchandise available in the store now.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#42deef] text-[#0A0A0A] px-12 py-4 font-black text-xs tracking-[0.2em] uppercase hover:bg-[#1cc5d9] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}

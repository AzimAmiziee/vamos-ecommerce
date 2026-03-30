-- ============================================================
-- Update all image paths to use local /storage/ paths
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── PRODUCTS ─────────────────────────────────────────────────
update public.products set
  image = '/storage/products/jersey-home.jpg',
  hover_image = '/storage/products/jersey-home-hover.jpg'
where name = 'Team Vamos S16 Pro Kit Jersey (HOME)';

update public.products set
  image = '/storage/products/jersey-away.jpg',
  hover_image = '/storage/products/jersey-away-hover.jpg'
where name = 'Team Vamos S16 Pro Kit Jersey (AWAY)';

update public.products set
  image = '/storage/products/uno-dos-tres.jpg',
  hover_image = '/storage/products/uno-dos-tres-hover.jpg'
where name = 'UNO DOS TRES';

update public.products set
  image = '/storage/products/dare-to-be-hated.jpg',
  hover_image = '/storage/products/dare-to-be-hated-hover.jpg'
where name = 'DARE TO BE HATED';

update public.products set
  image = '/storage/products/hometown-villain.jpg',
  hover_image = '/storage/products/hometown-villain-hover.jpg'
where name = 'HOMETOWN VILLAIN';

update public.products set
  image = '/storage/products/mafla.jpg',
  hover_image = '/storage/products/mafla-hover.jpg'
where name = 'Mafla';

-- ── GAMES ────────────────────────────────────────────────────
update public.games set image = '/storage/games/mlbb.png'         where slug = 'mobile-legends';
update public.games set image = '/storage/games/free-fire.png'    where slug = 'free-fire';
update public.games set image = '/storage/games/pubg.png'         where slug = 'pubg-mobile';
update public.games set image = '/storage/games/codm.png'         where slug = 'call-of-duty-mobile';
update public.games set image = '/storage/games/genshin.svg'      where slug = 'genshin-impact';
update public.games set image = '/storage/games/hsr.png'          where slug = 'honkai-star-rail';
update public.games set image = '/storage/games/zzz.svg'          where slug = 'zenless-zone-zero';
update public.games set image = '/storage/games/arena-breakout.jpg' where slug = 'arena-breakout';
update public.games set image = '/storage/games/eggy-party.jpg'   where slug = 'eggy-party';
update public.games set image = '/storage/games/ragnarok.png'     where slug = 'ragnarok-origin';
update public.games set image = '/storage/games/valorant.png'     where slug = 'valorant';
update public.games set image = '/storage/games/hsr.png'          where slug = 'honkai-star-rail-pc';
update public.games set image = '/storage/games/genshin.svg'      where slug = 'genshin-impact-pc';
update public.games set image = '/storage/games/roblox.png'       where slug = 'roblox';
update public.games set image = '/storage/games/garena.png'       where slug = 'garena-shells';
update public.games set image = '/storage/games/google-play.png'  where slug = 'google-play';
update public.games set image = '/storage/games/steam.svg'        where slug = 'steam-wallet';

-- Update all product images from .jpg to .webp
update public.products set
  image       = '/storage/products/jersey-home.webp',
  hover_image = '/storage/products/jersey-home-hover.webp'
where image like '%jersey-home%' and image not like '%-away%';

update public.products set
  image       = '/storage/products/jersey-away.webp',
  hover_image = '/storage/products/jersey-away-hover.webp'
where image like '%jersey-away%';

update public.products set
  image       = '/storage/products/uno-dos-tres.webp',
  hover_image = '/storage/products/uno-dos-tres-hover.webp'
where image like '%uno-dos-tres%';

update public.products set
  image       = '/storage/products/dare-to-be-hated.webp',
  hover_image = '/storage/products/dare-to-be-hated-hover.webp'
where image like '%dare-to-be-hated%';

update public.products set
  image       = '/storage/products/hometown-villain.webp',
  hover_image = '/storage/products/hometown-villain-hover.webp'
where image like '%hometown-villain%';

update public.products set
  image       = '/storage/products/mafla.webp',
  hover_image = '/storage/products/mafla-hover.webp'
where image like '%mafla%';

-- Update all game images from .png/.jpg to .webp (SVGs stay as-is)
update public.games set image = '/storage/games/mlbb.webp'          where slug = 'mobile-legends';
update public.games set image = '/storage/games/free-fire.webp'     where slug = 'free-fire';
update public.games set image = '/storage/games/pubg.webp'          where slug = 'pubg-mobile';
update public.games set image = '/storage/games/codm.webp'          where slug = 'call-of-duty-mobile';
update public.games set image = '/storage/games/hsr.webp'           where slug = 'honkai-star-rail';
update public.games set image = '/storage/games/arena-breakout.webp' where slug = 'arena-breakout';
update public.games set image = '/storage/games/eggy-party.webp'    where slug = 'eggy-party';
update public.games set image = '/storage/games/ragnarok.webp'      where slug = 'ragnarok-origin';
update public.games set image = '/storage/games/valorant.webp'      where slug = 'valorant';
update public.games set image = '/storage/games/hsr.webp'           where slug = 'honkai-star-rail-pc';
update public.games set image = '/storage/games/roblox.webp'        where slug = 'roblox';
update public.games set image = '/storage/games/garena.webp'        where slug = 'garena-shells';
update public.games set image = '/storage/games/google-play.webp'   where slug = 'google-play';

-- Team logos are mapped in code (src/lib/db/standings.ts) — no DB column needed

-- Update matches home_logo and away_logo
update public.matches set
  home_logo = replace(home_logo, '.png', '.webp'),
  away_logo = replace(away_logo, '.png', '.webp')
where home_logo like '%.png' or away_logo like '%.png';

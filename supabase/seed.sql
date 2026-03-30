-- ============================================================
-- Team Vamos — Seed Data
-- Run AFTER 001_schema.sql
-- ============================================================

-- ── PRODUCTS ─────────────────────────────────────────────────
insert into public.products (name, price, image, hover_image, category, collection, description, sizes, rating, sort_order) values
(
  'Team Vamos S16 Pro Kit Jersey (HOME)', 119,
  '/storage/products/jersey-home.jpg',
  '/storage/products/jersey-home-hover.jpg',
  'S16 Collection', 'S16 Collection',
  'No filters. No fear. No excuses. It''s Mask Off. Pro-level performance jersey engineered for the main stage.',
  ARRAY['XS','S','M','L','XL','2XL','3XL','4XL','5XL','6XL'], 5.0, 1
),
(
  'Team Vamos S16 Pro Kit Jersey (AWAY)', 119,
  '/storage/products/jersey-away.jpg',
  '/storage/products/jersey-away-hover.jpg',
  'S16 Collection', 'S16 Collection',
  'Engineered with pro-level performance and savage design. Built for the away battles where legends are made.',
  ARRAY['XS','S','M','L','XL','2XL','3XL','4XL','5XL','6XL'], 5.0, 2
),
(
  'UNO DOS TRES', 79,
  '/storage/products/uno-dos-tres.jpg',
  '/storage/products/uno-dos-tres-hover.jpg',
  'Street Wear', 'CTRL + PLAY',
  'Designed for those who take control and hit play on their own rules. Own the game, own the look.',
  ARRAY['S','M','L','XL','XXL'], 4.8, 3
),
(
  'DARE TO BE HATED', 79,
  '/storage/products/dare-to-be-hated.jpg',
  '/storage/products/dare-to-be-hated-hover.jpg',
  'Street Wear', 'CTRL + PLAY',
  'Playful graphics, loud statements, rebel-core nostalgia. For those who dare to stand out.',
  ARRAY['S','M','L','XL','XXL'], 4.9, 4
),
(
  'HOMETOWN VILLAIN', 79,
  '/storage/products/hometown-villain.jpg',
  '/storage/products/hometown-villain-hover.jpg',
  'Street Wear', 'CTRL + PLAY',
  'Designed to celebrate your identity. Be the villain of your own story — unapologetically.',
  ARRAY['S','L','XL','XXL'], 4.7, 5
),
(
  'Mafla', 79,
  '/storage/products/mafla.jpg',
  '/storage/products/mafla-hover.jpg',
  'S15 Collection', 'S15 Collection',
  'Part of the iconic Season 15 collection. A piece of Vamos history you can wear.',
  ARRAY['S','M','L','XL','XXL'], 4.6, 6
);

-- ── GAMES ────────────────────────────────────────────────────
-- Mobile Legends: Bang Bang
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('mobile-legends', 'Mobile Legends: Bang Bang', 'MLBB', 'Diamonds', '#1a6fd4', '#0d3d7a',
    '/storage/games/mlbb.png',
    'Mobile Game', 'Top up Mobile Legends diamonds instantly. Cheapest price guaranteed.', 1)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('ml-1','22 Diamonds',2.00,false,1),('ml-2','42 Diamonds',3.43,false,2),
    ('ml-3','84 Diamonds',6.86,false,3),('ml-4','140 Diamonds',11.44,false,4),
    ('ml-5','210 Diamonds',16.96,true,5),('ml-6','284 Diamonds',22.99,false,6),
    ('ml-7','397 Diamonds',32.20,false,7),('ml-8','570 Diamonds',46.04,false,8),
    ('ml-9','858 Diamonds',69.19,false,9),('ml-10','1000 Diamonds',80.52,true,10),
    ('ml-11','2162 Diamonds',172.48,false,11),('ml-12','5952 Diamonds',460.90,false,12),
    ('ml-wp','Weekly Diamond Pass',10.18,false,13),('ml-tp','Twilight Pass',48.95,false,14)
  ) as t(k,a,p,pop,s);

-- Free Fire
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('free-fire', 'Free Fire', 'FF', 'Diamonds', '#f97316', '#7c2d12',
    '/storage/games/free-fire.png',
    'Mobile Game', 'Top up Free Fire diamonds fast and cheap. Instant delivery.', 2)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('ff-1','25 Diamonds',1.00,false,1),('ff-2','50 Diamonds',2.10,false,2),
    ('ff-3','100 Diamonds',3.87,false,3),('ff-4','200 Diamonds',7.74,false,4),
    ('ff-5','310 Diamonds',11.71,true,5),('ff-6','520 Diamonds',19.54,false,6),
    ('ff-7','1060 Diamonds',38.70,true,7),('ff-8','2180 Diamonds',78.33,false,8),
    ('ff-9','5600 Diamonds',193.52,false,9),('ff-10','Weekly Membership',6.40,false,10),
    ('ff-11','Monthly Membership',32.22,false,11)
  ) as t(k,a,p,pop,s);

-- PUBG Mobile
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('pubg-mobile', 'PUBG Mobile', 'PUBG', 'UC', '#eab308', '#713f12',
    '/storage/games/pubg.png',
    'Mobile Game', 'Top up PUBG Mobile UC. Get bonus UC on every purchase.', 3)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, bonus, popular, sort_order) select
  g.id, k, a, p, b, pop, s from g,
  (values
    ('pubg-1','60 UC',4.73,null,false,1),('pubg-2','120 UC',9.45,null,false,2),
    ('pubg-3','300 UC',23.80,'+25',true,3),('pubg-4','600 UC',47.64,'+60',false,4),
    ('pubg-5','1500 UC',119.18,'+300',true,5),('pubg-6','3000 UC',238.40,'+850',false,6),
    ('pubg-7','6000 UC',476.86,'+2100',false,7)
  ) as t(k,a,p,b,pop,s);

-- Call of Duty Mobile
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('call-of-duty-mobile', 'Call of Duty Mobile', 'CODM', 'CP', '#22c55e', '#14532d',
    '/storage/games/codm.png',
    'Mobile Game', 'Top up COD Mobile CP. Unlock weapons, skins and Battle Pass.', 4)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, bonus, popular, sort_order) select
  g.id, k, a, p, b, pop, s from g,
  (values
    ('cod-1','114 CP',5.40,null,false,1),('cod-2','230 CP',10.80,'+23',false,2),
    ('cod-3','460 CP',21.60,'+69',true,3),('cod-4','690 CP',32.40,'+104',false,4),
    ('cod-5','1150 CP',54.00,'+173',true,5),('cod-6','2300 CP',108.00,'+460',false,6),
    ('cod-7','4600 CP',216.00,'+1840',false,7)
  ) as t(k,a,p,b,pop,s);

-- Genshin Impact
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('genshin-impact', 'Genshin Impact', 'Genshin', 'Genesis Crystals', '#06b6d4', '#164e63',
    '/storage/games/genshin.svg',
    'Mobile Game', 'Top up Genshin Impact Genesis Crystals. Convert to Primogems instantly.', 5)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('gs-1','60 Genesis Crystals',3.88,false,1),('gs-2','300+30 Genesis Crystals',19.80,false,2),
    ('gs-3','980+110 Genesis Crystals',59.60,true,3),('gs-4','1980+260 Genesis Crystals',129.25,false,4),
    ('gs-5','3280+600 Genesis Crystals',198.90,true,5),('gs-6','6480+1600 Genesis Crystals',397.90,false,6),
    ('gs-7','Blessing of the Welkin Moon',19.80,false,7)
  ) as t(k,a,p,pop,s);

-- Honkai: Star Rail
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('honkai-star-rail', 'Honkai: Star Rail', 'HSR', 'Oneiric Shards', '#8b5cf6', '#2e1065',
    '/storage/games/hsr.png',
    'Mobile Game', 'Top up Honkai Star Rail Oneiric Shards. Fast and reliable.', 6)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('hsr-1','60 Oneiric Shards',4.88,false,1),('hsr-2','300+30 Oneiric Shards',19.80,false,2),
    ('hsr-3','980+110 Oneiric Shards',59.60,true,3),('hsr-4','1980+260 Oneiric Shards',129.25,false,4),
    ('hsr-5','3280+600 Oneiric Shards',198.90,true,5),('hsr-6','6480+1600 Oneiric Shards',397.90,false,6),
    ('hsr-7','Express Supply Pass',19.80,false,7)
  ) as t(k,a,p,pop,s);

-- Zenless Zone Zero
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('zenless-zone-zero', 'Zenless Zone Zero', 'ZZZ', 'Monochrome', '#f59e0b', '#451a03',
    '/storage/games/zzz.svg',
    'Mobile Game', 'Top up Zenless Zone Zero Monochrome. Exchange for Polychrome and pulls.', 7)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('zzz-1','60 Monochrome',4.88,false,1),('zzz-2','300+30 Monochrome',19.80,false,2),
    ('zzz-3','980+110 Monochrome',59.60,true,3),('zzz-4','1980+260 Monochrome',129.25,false,4),
    ('zzz-5','3280+600 Monochrome',198.90,true,5),('zzz-6','6480+1600 Monochrome',397.90,false,6),
    ('zzz-7','All Pack Monochrome',810.33,false,7),('zzz-8','Inter-Knot Membership',19.80,false,8)
  ) as t(k,a,p,pop,s);

-- Arena Breakout
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('arena-breakout', 'Arena Breakout', 'AB', 'Bonds', '#84cc16', '#1a2e05',
    '/storage/games/arena-breakout.jpg',
    'Mobile Game', 'Top up Arena Breakout Bonds. Gear up and dominate the battlefield.', 8)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('ab-1','60+6 Bonds',4.88,false,1),('ab-2','310+25 Bonds',22.79,true,2),
    ('ab-3','630+45 Bonds',49.65,false,3),('ab-4','1580+110 Bonds',119.30,true,4),
    ('ab-5','3200+200 Bonds',228.75,false,5),('ab-6','6500+320 Bonds',497.40,false,6),
    ('ab-7','Beginner Select',4.88,false,7),('ab-8','Advanced Battle Pass',22.79,false,8),
    ('ab-9','Bulletproof Case Privileges',14.83,false,9),('ab-10','Premium Battle Pass',72.54,false,10)
  ) as t(k,a,p,pop,s);

-- Eggy Party
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('eggy-party', 'Eggy Party', 'Eggy', 'Eggy Coins', '#facc15', '#422006',
    '/storage/games/eggy-party.jpg',
    'Mobile Game', 'Top up Eggy Party coins. Join the party and unlock exclusive items.', 9)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('ep-1','10 Eggy Coins',1.00,false,1),('ep-2','60+3 Eggy Coins',3.88,false,2),
    ('ep-3','120+6 Eggy Coins',7.46,false,3),('ep-4','300+24 Eggy Coins',18.91,true,4),
    ('ep-5','700+57 Eggy Coins',44.78,true,5),('ep-6','1380+144 Eggy Coins',87.56,false,6),
    ('ep-7','2080+216 Eggy Coins',131.34,false,7),('ep-8','3450+423 Eggy Coins',164.52,false,8),
    ('ep-9','6880+903 Eggy Coins',327.53,false,9),('ep-10','Weekly Egg Coin Pack',3.88,false,10),
    ('ep-11','Yoyo Membership',7.46,false,11)
  ) as t(k,a,p,pop,s);

-- Ragnarok Origin
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('ragnarok-origin', 'Ragnarok Origin', 'RO', 'Nyan Berry', '#e11d48', '#4c0519',
    '/storage/games/ragnarok.png',
    'Mobile Game', 'Top up Ragnarok Origin Nyan Berry. Power up your character today.', 10)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('ro-1','40 Nyan Berry',4.58,false,1),('ro-2','125 Nyan Berry',13.53,false,2),
    ('ro-3','210 Nyan Berry',22.49,false,3),('ro-4','430 Nyan Berry',43.38,true,4),
    ('ro-5','900 Nyan Berry',90.15,true,5),('ro-6','2300 Nyan Berry',229.45,false,6),
    ('ro-7','4800 Nyan Berry',468.25,false,7),('ro-8','9600 Nyan Berry',935.90,false,8)
  ) as t(k,a,p,pop,s);

-- Valorant
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('valorant', 'Valorant', 'VAL', 'VP', '#ef4444', '#7f1d1d',
    '/storage/games/valorant.png',
    'PC Game', 'Top up Valorant Points (VP). Buy skins, battle pass and more.', 11)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('val-1','475 VP',19.75,false,1),('val-2','1000 VP',40.65,true,2),
    ('val-3','2050 VP',79.30,true,3),('val-4','3650 VP',138.43,false,4),
    ('val-5','5350 VP',197.46,false,5),('val-6','11000 VP',395.86,false,6)
  ) as t(k,a,p,pop,s);

-- Honkai Star Rail PC
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('honkai-star-rail-pc', 'Honkai: Star Rail (PC)', 'HSR PC', 'Oneiric Shards', '#a78bfa', '#2e1065',
    '/storage/games/hsr.png',
    'PC Game', 'Top up Honkai Star Rail on PC. Same prices, instant delivery.', 12)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('hsr-pc-1','60 Oneiric Shards',4.88,false,1),('hsr-pc-2','300+30 Oneiric Shards',19.80,false,2),
    ('hsr-pc-3','980+110 Oneiric Shards',59.60,true,3),('hsr-pc-4','1980+260 Oneiric Shards',129.25,false,4),
    ('hsr-pc-5','3280+600 Oneiric Shards',198.90,true,5),('hsr-pc-6','6480+1600 Oneiric Shards',397.90,false,6)
  ) as t(k,a,p,pop,s);

-- Genshin Impact PC
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('genshin-impact-pc', 'Genshin Impact (PC)', 'Genshin PC', 'Genesis Crystals', '#38bdf8', '#0c4a6e',
    '/storage/games/genshin.svg',
    'PC Game', 'Top up Genshin Impact on PC. Fast and secure top up.', 13)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('gs-pc-1','60 Genesis Crystals',3.88,false,1),('gs-pc-2','300+30 Genesis Crystals',19.80,false,2),
    ('gs-pc-3','980+110 Genesis Crystals',59.60,true,3),('gs-pc-4','1980+260 Genesis Crystals',129.25,false,4),
    ('gs-pc-5','3280+600 Genesis Crystals',198.90,true,5),('gs-pc-6','6480+1600 Genesis Crystals',397.90,false,6)
  ) as t(k,a,p,pop,s);

-- Roblox
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('roblox', 'Roblox', 'Roblox', 'Robux', '#dc2626', '#450a0a',
    '/storage/games/roblox.png',
    'Voucher', 'Top up Roblox Robux. Buy avatars, game passes and exclusive items.', 14)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('rob-1','800 Robux',42.04,false,1),('rob-2','2000 Robux',102.25,true,2),
    ('rob-3','4500 Robux',207.28,true,3),('rob-4','10000 Robux',428.96,false,4)
  ) as t(k,a,p,pop,s);

-- Garena Shells
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('garena-shells', 'Garena Shells', 'Garena', 'Shells', '#f97316', '#431407',
    '/storage/games/garena.png',
    'Voucher', 'Top up Garena Shells for Free Fire, AOV, FIFA Online and more.', 15)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('gar-1','60 Shells',3.00,false,1),('gar-2','120 Shells',6.00,false,2),
    ('gar-3','300 Shells',15.00,true,3),('gar-4','600 Shells',30.00,false,4),
    ('gar-5','1200 Shells',60.00,true,5),('gar-6','3000 Shells',150.00,false,6),
    ('gar-7','6000 Shells',300.00,false,7)
  ) as t(k,a,p,pop,s);

-- Google Play
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('google-play', 'Google Play', 'G-Play', 'Credit', '#4ade80', '#052e16',
    '/storage/games/google-play.png',
    'Voucher', 'Google Play gift card. Use for any app, game or subscription on Google Play.', 16)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('gp-1','RM 5 Credit',5.00,false,1),('gp-2','RM 10 Credit',10.00,false,2),
    ('gp-3','RM 15 Credit',15.00,false,3),('gp-4','RM 30 Credit',30.00,true,4),
    ('gp-5','RM 50 Credit',50.00,true,5),('gp-6','RM 100 Credit',100.00,false,6),
    ('gp-7','RM 200 Credit',200.00,false,7)
  ) as t(k,a,p,pop,s);

-- Steam Wallet
with g as (
  insert into public.games (slug, name, short_name, currency, color, color_secondary, image, category, description, sort_order)
  values ('steam-wallet', 'Steam Wallet', 'Steam', 'Wallet Credit', '#60a5fa', '#1e3a5f',
    '/storage/games/steam.svg',
    'Voucher', 'Steam wallet top up. Buy games, DLC and items on Steam.', 17)
  returning id
)
insert into public.game_packages (game_id, package_key, amount, price, popular, sort_order) select
  g.id, k, a, p, pop, s from g,
  (values
    ('sw-1','RM 10 Credit',10.00,false,1),('sw-2','RM 20 Credit',20.00,false,2),
    ('sw-3','RM 30 Credit',30.00,false,3),('sw-4','RM 50 Credit',50.00,true,4),
    ('sw-5','RM 100 Credit',100.00,true,5),('sw-6','RM 200 Credit',200.00,false,6)
  ) as t(k,a,p,pop,s);

-- ── ARTICLES ─────────────────────────────────────────────────
insert into public.articles (slug, title, excerpt, paragraphs, category, author, read_time, published_at) values
(
  'team-vamos-third-place-mplmy-s16-week4',
  'Team Vamos Holds Firm at 3rd — Week 4 Recap',
  'A commanding Week 4 sees Team Vamos cement their top-three standing with a 6-3 match record and 17 points in MPL MY Season 16.',
  ARRAY[
    'Team Vamos closed out Week 4 of MPL MY Season 16 in commanding fashion, maintaining their 3rd place standing with a 6-3 match record and 17 points on the board. The team continued to demonstrate why they are considered one of the most dangerous squads in the league.',
    'The week was headlined by a back-to-back series victory over Homebois — a match-up that showcased the squad''s strategic depth and in-game adaptability. Key performances from the jungler and gold laner set the tempo, with the team executing late-game macro at an elite level under immense pressure.',
    'Coach Amin reflected on the week''s results: "The boys are hungry. We know the road ahead is tough, but our teamwork this week proves we belong at the top. We''re not done yet — not even close."',
    'With SRG OG Esports setting a blistering pace at the top of the table, Team Vamos remains locked in and focused on building consistent momentum heading into Week 5. Every single match is an opportunity to close the gap.',
    'Catch all the live action every weekend on MPL MY''s official channels. Show your support — wear the jersey, cheer loud, and let''s vamos.'
  ],
  'Match Report', 'Team Vamos Media', 3, '2026-03-25 10:00:00+08'
),
(
  'behind-the-grind-team-vamos-gaming-house',
  'Behind the Grind: Inside the Team Vamos Gaming House',
  'A look inside the daily routines, sacrifices, and bonds that drive Team Vamos forward every single day.',
  ARRAY[
    'Life in a professional esports gaming house isn''t all highlight clips and trophies. For Team Vamos, it''s early mornings, late-night scrims, VOD reviews, and an unwavering commitment to constant improvement.',
    'The day typically starts at 9AM with physical conditioning — yes, esports athletes train their bodies as well as their minds. After warm-ups and breakfast, the team dives into structured practice blocks focused on specific match-ups, rotations, and in-game communication.',
    'Afternoons are dedicated to individual growth. Players review their own gameplay, identify weaknesses, and work one-on-one with the coaching staff. Mental performance coaching is also part of the programme, helping players manage pressure during high-stakes moments on the main stage.',
    'By evening, the full roster assembles for team scrimmages against other MPL-level squads. These sessions are intense, competitive, and invaluable — each one a simulation of what awaits on the official stage every weekend.',
    'It''s a lifestyle that demands sacrifice. But for every player on Team Vamos, there''s nowhere else they''d rather be. The shared goal, the brotherhood, and the love of the game make every long grind worth it.'
  ],
  'Team News', 'Team Vamos Media', 4, '2026-03-20 10:00:00+08'
),
(
  'season-16-jersey-collection-now-live',
  'The Season 16 Official Jersey Is Now Live',
  'The wait is over. Team Vamos''s Season 16 official jersey collection is now available exclusively at the official store.',
  ARRAY[
    'Crafted for competition and built for fans, the Team Vamos Season 16 official jersey is finally here. Available now at our official store, the new design represents everything the team stands for — boldness, precision, and Malaysian pride.',
    'This season''s jersey features a sleek black base with the iconic Team Vamos cyan accent lines running through the shoulders and collar. The MPL MY Season 16 patch is embroidered on the left sleeve, making it a must-have collectible for every Vamos fan.',
    'The jersey is made from a breathable, lightweight performance fabric — the same type worn by the players on the main stage. Whether you''re in the crowd at a live event, at a watch party, or gaming at home, you''ll feel like part of the team.',
    'Sizes range from XS to 3XL. Due to high demand from previous seasons, we strongly encourage early orders. Stock is limited, and once it''s sold out, it''s gone.',
    'Head to the official Team Vamos store now and secure yours today. Wear the badge. Rep the grind.'
  ],
  'Merchandise', 'Team Vamos Store', 2, '2026-03-15 10:00:00+08'
),
(
  'vamos-rising-journey-mplmy-season-16',
  'Vamos Rising: Our Journey Into MPL MY Season 16',
  'From grassroots beginnings to the MPL MY mainstage — the story of how Team Vamos became one of Malaysian esports'' most exciting franchises.',
  ARRAY[
    'Every great team has an origin story. For Team Vamos, it started with a group of passionate Malaysian gamers who believed they could compete at the highest level — and refused to stop until they proved it.',
    'Founded with a vision to put Malaysian esports on the global map, Team Vamos built its identity on a culture of relentless improvement. The early days were humble: limited resources, small budgets, but enormous hunger. That hunger never left.',
    'Season by season, the team evolved. Rosters were refined, coaching structures were professionalised, and the fanbase grew organically — built on authentic connection and consistency, not manufactured hype. The Vamos community became one of the most loyal in the region.',
    'Now in MPL MY Season 16, Team Vamos competes as one of the top franchises in Malaysia''s premier mobile gaming league. The 50,000+ community, the official merchandise store, the growing social following — all of it is proof of what''s possible when passion meets discipline.',
    'The journey isn''t over. The team has its eyes firmly on championship glory, and with every match, every week, and every season, Team Vamos gets closer to the top. This is just the beginning.'
  ],
  'Community', 'Team Vamos Media', 4, '2026-03-10 10:00:00+08'
);

-- ── STANDINGS ────────────────────────────────────────────────
insert into public.standings (season, week, rank, team, match_wins, match_losses, game_wins, game_losses, points, is_vamos) values
('MPL MY S16', 4, 1,  'SRG OG ESPORTS',   9, 0, 18, 3,  24, false),
('MPL MY S16', 4, 2,  'CG ESPORTS',        5, 4, 13, 8,  18, false),
('MPL MY S16', 4, 3,  'TEAM VAMOS',        6, 3, 13, 8,  17, true),
('MPL MY S16', 4, 4,  'HOMEBOIS',          5, 4, 11, 9,  15, false),
('MPL MY S16', 4, 5,  'MONSTER VICIOUS',   5, 4, 10, 8,  15, false),
('MPL MY S16', 4, 6,  'AERO ESPORTS',      4, 5, 10, 11, 13, false),
('MPL MY S16', 4, 7,  'UNTITLED',          4, 5, 9,  11, 12, false),
('MPL MY S16', 4, 8,  'TEAM REY',          3, 6, 7,  14, 8,  false),
('MPL MY S16', 4, 9,  'TODAK',             3, 6, 7,  14, 8,  false),
('MPL MY S16', 4, 10, 'GAMESMY KELANTAN',  1, 8, 5,  17, 5,  false);

-- ── REWARDS ──────────────────────────────────────────────────
insert into public.rewards (title, description, points_required, category, icon, badge, value_label, fields_type, sort_order) values
(
  'Vamos Official T-Shirt',
  'Redeem an exclusive Vamos team tee. Available in all sizes. Shipped to your door within 5–7 business days.',
  2000, 'Merchandise', '👕', null, 'Worth RM89', 'merch', 1
),
(
  'Vamos Cap + Hoodie Bundle',
  'Grab the full Vamos street look — signature team cap paired with a limited hoodie. Limited stock available.',
  3000, 'Merchandise', '🧢', 'Popular', 'Worth RM159', 'merch', 2
),
(
  'Gaming House Tour',
  'Step inside the Vamos Gaming House. See where the pros train, grind scrims, and prepare for MPL. Exclusive access for loyal fans.',
  3000, 'Experience', '🏠', 'Fan Favourite', 'Exclusive Experience', 'experience', 3
),
(
  'Photo with MPL Player + Signed Jersey',
  'Meet your favourite Vamos MPL player in person. Get a photo together and walk away with a personally signed Vamos jersey.',
  5000, 'Experience', '🏆', 'Max Tier', 'Priceless', 'experience', 4
);

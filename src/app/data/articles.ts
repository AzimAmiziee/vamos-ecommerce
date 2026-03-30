export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  date: string;
  category: 'Match Report' | 'Team News' | 'Merchandise' | 'Community';
  readTime: number;
  author: string;
}

export const articles: Article[] = [
  {
    id: 1,
    slug: 'team-vamos-third-place-mplmy-s16-week4',
    title: 'Team Vamos Holds Firm at 3rd — Week 4 Recap',
    excerpt:
      'A commanding Week 4 sees Team Vamos cement their top-three standing with a 6-3 match record and 17 points in MPL MY Season 16.',
    paragraphs: [
      'Team Vamos closed out Week 4 of MPL MY Season 16 in commanding fashion, maintaining their 3rd place standing with a 6-3 match record and 17 points on the board. The team continued to demonstrate why they are considered one of the most dangerous squads in the league.',
      'The week was headlined by a back-to-back series victory over Homebois — a match-up that showcased the squad\'s strategic depth and in-game adaptability. Key performances from the jungler and gold laner set the tempo, with the team executing late-game macro at an elite level under immense pressure.',
      'Coach Amin reflected on the week\'s results: "The boys are hungry. We know the road ahead is tough, but our teamwork this week proves we belong at the top. We\'re not done yet — not even close."',
      'With SRG OG Esports setting a blistering pace at the top of the table, Team Vamos remains locked in and focused on building consistent momentum heading into Week 5. Every single match is an opportunity to close the gap.',
      'Catch all the live action every weekend on MPL MY\'s official channels. Show your support — wear the jersey, cheer loud, and let\'s vamos.',
    ],
    date: '2026-03-25',
    category: 'Match Report',
    readTime: 3,
    author: 'Team Vamos Media',
  },
  {
    id: 2,
    slug: 'behind-the-grind-team-vamos-gaming-house',
    title: 'Behind the Grind: Inside the Team Vamos Gaming House',
    excerpt:
      'A look inside the daily routines, sacrifices, and bonds that drive Team Vamos forward every single day.',
    paragraphs: [
      'Life in a professional esports gaming house isn\'t all highlight clips and trophies. For Team Vamos, it\'s early mornings, late-night scrims, VOD reviews, and an unwavering commitment to constant improvement.',
      'The day typically starts at 9AM with physical conditioning — yes, esports athletes train their bodies as well as their minds. After warm-ups and breakfast, the team dives into structured practice blocks focused on specific match-ups, rotations, and in-game communication.',
      'Afternoons are dedicated to individual growth. Players review their own gameplay, identify weaknesses, and work one-on-one with the coaching staff. Mental performance coaching is also part of the programme, helping players manage pressure during high-stakes moments on the main stage.',
      'By evening, the full roster assembles for team scrimmages against other MPL-level squads. These sessions are intense, competitive, and invaluable — each one a simulation of what awaits on the official stage every weekend.',
      'It\'s a lifestyle that demands sacrifice. But for every player on Team Vamos, there\'s nowhere else they\'d rather be. The shared goal, the brotherhood, and the love of the game make every long grind worth it.',
    ],
    date: '2026-03-20',
    category: 'Team News',
    readTime: 4,
    author: 'Team Vamos Media',
  },
  {
    id: 3,
    slug: 'season-16-jersey-collection-now-live',
    title: 'The Season 16 Official Jersey Is Now Live',
    excerpt:
      'The wait is over. Team Vamos\'s Season 16 official jersey collection is now available exclusively at the official store.',
    paragraphs: [
      'Crafted for competition and built for fans, the Team Vamos Season 16 official jersey is finally here. Available now at our official store, the new design represents everything the team stands for — boldness, precision, and Malaysian pride.',
      'This season\'s jersey features a sleek black base with the iconic Team Vamos cyan accent lines running through the shoulders and collar. The MPL MY Season 16 patch is embroidered on the left sleeve, making it a must-have collectible for every Vamos fan.',
      'The jersey is made from a breathable, lightweight performance fabric — the same type worn by the players on the main stage. Whether you\'re in the crowd at a live event, at a watch party, or gaming at home, you\'ll feel like part of the team.',
      'Sizes range from XS to 3XL. Due to high demand from previous seasons, we strongly encourage early orders. Stock is limited, and once it\'s sold out, it\'s gone.',
      'Head to the official Team Vamos store now and secure yours today. Wear the badge. Rep the grind.',
    ],
    date: '2026-03-15',
    category: 'Merchandise',
    readTime: 2,
    author: 'Team Vamos Store',
  },
  {
    id: 4,
    slug: 'vamos-rising-journey-mplmy-season-16',
    title: 'Vamos Rising: Our Journey Into MPL MY Season 16',
    excerpt:
      'From grassroots beginnings to the MPL MY mainstage — the story of how Team Vamos became one of Malaysian esports\' most exciting franchises.',
    paragraphs: [
      'Every great team has an origin story. For Team Vamos, it started with a group of passionate Malaysian gamers who believed they could compete at the highest level — and refused to stop until they proved it.',
      'Founded with a vision to put Malaysian esports on the global map, Team Vamos built its identity on a culture of relentless improvement. The early days were humble: limited resources, small budgets, but enormous hunger. That hunger never left.',
      'Season by season, the team evolved. Rosters were refined, coaching structures were professionalised, and the fanbase grew organically — built on authentic connection and consistency, not manufactured hype. The Vamos community became one of the most loyal in the region.',
      'Now in MPL MY Season 16, Team Vamos competes as one of the top franchises in Malaysia\'s premier mobile gaming league. The 50,000+ community, the official merchandise store, the growing social following — all of it is proof of what\'s possible when passion meets discipline.',
      'The journey isn\'t over. The team has its eyes firmly on championship glory, and with every match, every week, and every season, Team Vamos gets closer to the top. This is just the beginning.',
    ],
    date: '2026-03-10',
    category: 'Community',
    readTime: 4,
    author: 'Team Vamos Media',
  },
];

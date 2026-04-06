export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  category: string;
  collection: string;
  description: string;
  sizes?: string[];
  rating: number;
}

const S = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage`;

export const products: Product[] = [
  {
    id: '1',
    name: 'Team Vamos S16 Pro Kit Jersey (HOME)',
    price: 119,
    image: `${S}/products/jersey-home.webp`,
    hoverImage: `${S}/products/jersey-home-hover.webp`,
    category: 'S16 Collection',
    collection: 'S16 Collection',
    description: 'No filters. No fear. No excuses. It\'s Mask Off. Pro-level performance jersey engineered for the main stage.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
    rating: 5.0,
  },
  {
    id: '2',
    name: 'Team Vamos S16 Pro Kit Jersey (AWAY)',
    price: 119,
    image: `${S}/products/jersey-away.webp`,
    hoverImage: `${S}/products/jersey-away-hover.webp`,
    category: 'S16 Collection',
    collection: 'S16 Collection',
    description: 'Engineered with pro-level performance and savage design. Built for the away battles where legends are made.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
    rating: 5.0,
  },
  {
    id: '3',
    name: 'UNO DOS TRES',
    price: 79,
    image: `${S}/products/uno-dos-tres.webp`,
    hoverImage: `${S}/products/uno-dos-tres-hover.webp`,
    category: 'Street Wear',
    collection: 'CTRL + PLAY',
    description: 'Designed for those who take control and hit play on their own rules. Own the game, own the look.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
  },
  {
    id: '4',
    name: 'DARE TO BE HATED',
    price: 79,
    image: `${S}/products/dare-to-be-hated.webp`,
    hoverImage: `${S}/products/dare-to-be-hated-hover.webp`,
    category: 'Street Wear',
    collection: 'CTRL + PLAY',
    description: 'Playful graphics, loud statements, rebel-core nostalgia. For those who dare to stand out.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
  },
  {
    id: '5',
    name: 'HOMETOWN VILLAIN',
    price: 79,
    image: `${S}/products/hometown-villain.webp`,
    hoverImage: `${S}/products/hometown-villain-hover.webp`,
    category: 'Street Wear',
    collection: 'CTRL + PLAY',
    description: 'Designed to celebrate your identity. Be the villain of your own story — unapologetically.',
    sizes: ['S', 'L', 'XL', 'XXL'],
    rating: 4.7,
  },
  {
    id: '6',
    name: 'Mafla',
    price: 79,
    image: `${S}/products/mafla.webp`,
    hoverImage: `${S}/products/mafla-hover.webp`,
    category: 'S15 Collection',
    collection: 'S15 Collection',
    description: 'Part of the iconic Season 15 collection. A piece of Vamos history you can wear.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6,
  },
];

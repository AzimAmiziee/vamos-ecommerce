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

export const products: Product[] = [
  {
    id: '1',
    name: 'Team Vamos S16 Pro Kit Jersey (HOME)',
    price: 119,
    image: 'https://www.vamos.com.my/cdn/shop/files/CopyofIGPost-34.jpg?v=1758980786',
    hoverImage: 'https://www.vamos.com.my/cdn/shop/files/Copy_of_IG_Post-19.jpg?v=1758980969',
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
    image: 'https://www.vamos.com.my/cdn/shop/files/DSC04167.jpg?v=1759818506',
    hoverImage: 'https://www.vamos.com.my/cdn/shop/files/DSC04183_59036f12-c928-4302-8255-1ca2ce11dca3.jpg?v=1759899645',
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
    image: 'https://www.vamos.com.my/cdn/shop/files/IGPost-07.jpg?v=1750671216',
    hoverImage: 'https://www.vamos.com.my/cdn/shop/files/IGPost-08.jpg?v=1750671216',
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
    image: 'https://www.vamos.com.my/cdn/shop/files/IGPost-13.jpg?v=1750671359',
    hoverImage: 'https://www.vamos.com.my/cdn/shop/files/IGPost-30.jpg?v=1750671359',
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
    image: 'https://www.vamos.com.my/cdn/shop/files/IGPost-26.jpg?v=1750671324',
    hoverImage: 'https://www.vamos.com.my/cdn/shop/files/IGPost-17.jpg?v=1750671324',
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
    image: 'https://www.vamos.com.my/cdn/shop/files/WhatsApp_Image_2024-10-10_at_21.30.55_697ef59e.jpg?v=1728567187',
    hoverImage: 'https://www.vamos.com.my/cdn/shop/files/WhatsApp_Image_2024-10-10_at_21.30.56_624294ee.jpg?v=1728567187',
    category: 'S15 Collection',
    collection: 'S15 Collection',
    description: 'Part of the iconic Season 15 collection. A piece of Vamos history you can wear.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.6,
  },
];

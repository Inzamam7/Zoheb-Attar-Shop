import type { Product, Category } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Classic Attars', slug: 'classic-attars' },
  { id: '2', name: 'Floral Scents', slug: 'floral-scents' },
  { id: '3', name: 'Woody Notes', slug: 'woody-notes' },
  { id: '4', name: 'Limited Edition', slug: 'limited-edition' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Oud',
    description: 'A majestic blend of rich oud and warm spices.',
    longDescription: 'Experience the epitome of luxury with Royal Oud. This exquisite attar features a deep, resonant oud base, artfully combined with a symphony of warm spices like saffron and cardamom. Perfect for special occasions or when you want to make a statement.',
    price: 75.00,
    categorySlug: 'classic-attars',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'perfume bottle',
    featured: true,
    rating: 5,
  },
  {
    id: '2',
    name: 'Jasmine Bloom',
    description: 'Pure essence of fresh jasmine flowers in full bloom.',
    longDescription: 'Jasmine Bloom captures the delicate and intoxicating aroma of freshly picked jasmine flowers. This floral attar is light, airy, and incredibly romantic, evoking a serene walk through a blooming garden at dusk.',
    price: 45.00,
    categorySlug: 'floral-scents',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'white flowers',
    featured: true,
    rating: 4,
  },
  {
    id: '3',
    name: 'Sandalwood Serenity',
    description: 'Calming and creamy sandalwood with a hint of sweetness.',
    longDescription: 'Find your inner peace with Sandalwood Serenity. This attar offers the classic, creamy, and smooth notes of pure sandalwood, enhanced by a subtle touch of natural sweetness. Ideal for meditation or daily wear.',
    price: 55.00,
    categorySlug: 'woody-notes',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'wooden texture',
    rating: 4,
  },
  {
    id: '4',
    name: 'Mystic Amber',
    description: 'A warm, resinous amber with a touch of vanilla.',
    longDescription: 'Mystic Amber is a captivating fragrance that wraps you in a warm, resinous embrace. Notes of rich amber are beautifully balanced with a hint of sweet vanilla, creating a comforting and alluring scent.',
    price: 60.00,
    categorySlug: 'classic-attars',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'golden liquid',
    featured: true,
    rating: 5,
  },
  {
    id: '5',
    name: 'Rose Garden',
    description: 'The timeless elegance of freshly cut roses.',
    longDescription: 'Step into a Rose Garden with this classic attar. It beautifully captures the multifaceted fragrance of fresh roses, from their velvety petals to their green stems. A truly timeless and elegant scent.',
    price: 50.00,
    categorySlug: 'floral-scents',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'red roses',
    rating: 4
  },
  {
    id: '6',
    name: 'Desert Mirage',
    description: 'An exotic blend of rare desert spices and musk.',
    longDescription: 'Desert Mirage is a limited edition attar that transports you to an oasis of exotic aromas. A unique combination of rare desert spices, precious woods, and a soft musk base creates an unforgettable and adventurous fragrance.',
    price: 90.00,
    categorySlug: 'limited-edition',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'desert landscape',
    featured: true,
    rating: 5
  },
];

export const getProductById = (id: string): Product | undefined => products.find(p => p.id === id);

export const getProductsByCategory = (slug: string): Product[] => products.filter(p => p.categorySlug === slug);

export const getFeaturedProducts = (): Product[] => products.filter(p => p.featured);

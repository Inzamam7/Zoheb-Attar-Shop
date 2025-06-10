export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  categorySlug: string;
  imageUrl: string;
  imageHint?: string;
  featured?: boolean;
  rating?: number; // Optional, 1-5
};

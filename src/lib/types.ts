
export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ProductPrice = {
  size: string; // e.g., "3ml", "6ml", "12ml"
  price: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  prices: ProductPrice[]; // Changed from single price to array of prices
  categorySlug: string;
  imageUrl: string;
  imageHint?: string;
  featured?: boolean;
  rating?: number; // Optional, 1-5
  isNewArrival?: boolean; // Added for new arrivals
  highlightedNewAttar?: boolean; // For the new spotlight section
};

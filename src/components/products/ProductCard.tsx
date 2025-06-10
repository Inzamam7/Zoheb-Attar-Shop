
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Star } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';

interface ProductCardProps {
  product: Product;
}

const WHATSAPP_NUMBER = "917397865199"; // Consistent WhatsApp number

export default function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: `${product.name} removed from wishlist.` });
    } else {
      addToWishlist(product.id);
      toast({ title: `${product.name} added to wishlist!` });
    }
  };

  const whatsappMessage = `Hi Zoheb Attar Shop,\n\nI'd like to place an order:\n\nProduct: ${product.name}\nQuantity: 1 (Please confirm or specify desired quantity)\n\nMy Details:\nShipping Address: [Please provide your full address]\n\nPayment Preference: [e.g., Cash on Delivery, Online Transfer - Please specify]\n\nLooking forward to your confirmation!`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col rounded-lg">
      <Link href={`/products/${product.id}`} className="block group h-full flex flex-col">
        <CardHeader className="p-0 relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={product.imageHint || "perfume bottle"}
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline mb-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">{product.description}</CardDescription>
          {product.rating && (
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < product.rating! ? 'text-secondary fill-secondary' : 'text-muted-foreground/50'}`}
                />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">({product.rating})</span>
            </div>
          )}
          <p className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
        </CardContent>
      </Link>
      {/* Link removed from wrapping CardFooter to allow separate button actions */}
      <CardFooter className="p-4 pt-0 mt-auto flex flex-col sm:flex-row gap-2">
        <Button asChild size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon className="mr-2 h-4 w-4" /> Buy Now
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleWishlistToggle}
          className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label={isWishlisted(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`mr-2 h-4 w-4 ${isWishlisted(product.id) ? 'fill-primary' : ''}`} />
          {isWishlisted(product.id) ? 'Wishlisted' : 'Wishlist'}
        </Button>
      </CardFooter>
    </Card>
  );
}

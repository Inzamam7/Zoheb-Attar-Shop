"use client";

import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  productId: string;
  productName: string;
}

export default function WishlistButton({ productId, productName }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const handleWishlistToggle = () => {
    if (isWishlisted(productId)) {
      removeFromWishlist(productId);
      toast({ title: `${productName} removed from wishlist.` });
    } else {
      addToWishlist(productId);
      toast({ title: `${productName} added to wishlist!`, variant: 'default' });
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleWishlistToggle}
      className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
      aria-label={isWishlisted(productId) ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
    >
      <Heart className={`mr-2 h-5 w-5 ${isWishlisted(productId) ? 'fill-primary' : ''}`} />
      {isWishlisted(productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
    </Button>
  );
}

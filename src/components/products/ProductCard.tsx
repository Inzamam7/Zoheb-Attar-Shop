
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductPrice } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Star } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface ProductCardProps {
  product: Product;
}

const WHATSAPP_NUMBER = "917397865199";

export default function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast();

  const [selectedPriceInfo, setSelectedPriceInfo] = useState<ProductPrice>(() => 
    product.prices && product.prices.length > 0 
      ? product.prices[0] 
      : { size: "N/A", price: 0 }
  );

  // Effect to update selectedPriceInfo when the product prop changes.
  // This is crucial for components reused in lists/marquees where the product prop might change.
  useEffect(() => {
    setSelectedPriceInfo(
      product.prices && product.prices.length > 0
        ? product.prices[0]
        : { size: "N/A", price: 0 }
    );
  }, [product]); // Only depend on the product prop.

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

  const handleSizeChange = (sizeValue: string) => {
    const newPriceInfo = product.prices.find(p => p.size === sizeValue);
    if (newPriceInfo) {
      setSelectedPriceInfo(newPriceInfo);
    }
  };

  const whatsappMessage = `Hello Zoheb Attar Shop, I want to buy ${product.name} (Size: ${selectedPriceInfo.size}, Quantity: 1). Can you please provide more information?`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col rounded-lg">
      <Link href={`/products/${product.id}`} className="block group flex flex-col flex-grow">
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
          
          <div className="mt-2 space-y-1">
            {product.prices && product.prices.length > 0 && (
              <div>
                <Label htmlFor={`size-select-${product.id}`} className="text-xs font-medium text-muted-foreground">Select Size:</Label>
                <Select value={selectedPriceInfo.size} onValueChange={handleSizeChange}>
                  <SelectTrigger id={`size-select-${product.id}`} className="w-full h-9 mt-0.5 text-sm">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.prices.map(p => (
                      <SelectItem key={p.size} value={p.size} className="text-sm">
                        {p.size} - ${p.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <p className="text-lg font-semibold text-primary pt-1">
              ${selectedPriceInfo.price.toFixed(2)} 
              {selectedPriceInfo.size !== "N/A" && <span className="text-sm font-normal text-muted-foreground"> ({selectedPriceInfo.size})</span>}
            </p>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-2 mt-auto flex flex-col sm:flex-row gap-2">
        <Button asChild size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white" disabled={selectedPriceInfo.size === "N/A"}>
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
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

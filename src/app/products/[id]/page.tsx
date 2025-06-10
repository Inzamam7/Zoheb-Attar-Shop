
"use client";
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductById, products as allProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ChevronLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import WishlistButton from '@/components/products/WishlistButton';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { useState, useEffect } from 'react';
import type { ProductPrice } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id,
  }));
}

const WHATSAPP_NUMBER = "917397865199";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  const [selectedPriceInfo, setSelectedPriceInfo] = useState<ProductPrice | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);


  useEffect(() => {
    if (product && product.prices.length > 0) {
      setSelectedPriceInfo(product.prices[0]); // Default to the first size option
    }
  }, [product]);

  if (!product) {
    notFound();
  }
  
  if (!selectedPriceInfo && product && product.prices.length > 0) {
    // Fallback if state hasn't initialized yet (e.g. during SSR or first client render)
     setSelectedPriceInfo(product.prices[0]);
  }


  const relatedProducts = allProducts
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 3);

  const handleSizeChange = (sizeValue: string) => {
    const newPriceInfo = product.prices.find(p => p.size === sizeValue);
    if (newPriceInfo) {
      setSelectedPriceInfo(newPriceInfo);
      setOrderQuantity(1); // Reset quantity when size changes
    }
  };

  const currentPrice = selectedPriceInfo ? selectedPriceInfo.price * orderQuantity : 0;
  const currentSize = selectedPriceInfo ? selectedPriceInfo.size : "N/A";

  const whatsappMessage = `Hi Zoheb Attar Shop,\n\nI'd like to place an order:\n\nProduct: ${product.name}\nSize: ${currentSize}\nPrice per unit: $${selectedPriceInfo?.price.toFixed(2)}\nQuantity: ${orderQuantity}\nTotal Price: $${currentPrice.toFixed(2)}\n\nMy Details:\nShipping Address: [Please provide your full address]\n\nPayment Preference: [e.g., Cash on Delivery, Online Transfer - Please specify]\n\nLooking forward to your confirmation! (Product ID: ${product.id})`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-12">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/products">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
      </Button>

      <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={600}
            className="object-cover w-full aspect-[4/3]"
            data-ai-hint={product.imageHint || "perfume bottle"}
            priority
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
          
          {product.rating && (
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < product.rating! ? 'text-secondary fill-secondary' : 'text-muted-foreground/30'}`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({product.rating} stars)</span>
            </div>
          )}

          {product.prices && product.prices.length > 0 && selectedPriceInfo && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="size-select" className="text-sm font-medium">Select Size:</Label>
                <Select value={selectedPriceInfo.size} onValueChange={handleSizeChange}>
                  <SelectTrigger id="size-select" className="w-full sm:w-[200px] mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.prices.map(p => (
                      <SelectItem key={p.size} value={p.size}>
                        {p.size} - ${p.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity-input" className="text-sm font-medium">Quantity:</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" size="icon" onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))} disabled={orderQuantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input 
                    id="quantity-input"
                    type="number" 
                    value={orderQuantity} 
                    readOnly 
                    className="w-16 h-10 text-center border border-input rounded-md"
                  />
                  <Button variant="outline" size="icon" onClick={() => setOrderQuantity(prev => prev + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-2xl font-semibold text-primary">
                Total: ${currentPrice.toFixed(2)}
              </p>
            </div>
          )}
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.longDescription || product.description}
          </p>

          <div className="pt-4 space-y-3">
            <Button size="lg" className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-primary-foreground shadow-md transition-all hover:shadow-lg">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart (Demo)
            </Button>
            <div className="flex flex-col sm:flex-row sm:gap-4 space-y-3 sm:space-y-0">
              <WishlistButton productId={product.id} productName={product.name} />
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-green-500 text-green-600 hover:bg-green-500 hover:text-white" disabled={!selectedPriceInfo}>
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon className="mr-2 h-5 w-5" /> Order on WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8 font-headline">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

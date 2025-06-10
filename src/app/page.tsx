
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { getFeaturedProducts, getNewArrivals, getHighlightedNewAttars } from '@/lib/data';
import Image from 'next/image';
import { PackagePlus, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const highlightedNewAttars = getHighlightedNewAttars();

  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [centeredItemKey, setCenteredItemKey] = useState<string | null>(null);
  const marqueeContentRef = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const isClickPausedRef = useRef(false); // Ref to track if pause was due to a click

  const marqueeAttarsDuplicated = highlightedNewAttars.length > 0 ? [...highlightedNewAttars, ...highlightedNewAttars] : [];

  const handleProductCardWrapperClick = (itemKey: string) => {
    setIsMarqueePaused(true);
    setCenteredItemKey(itemKey);
    isClickPausedRef.current = true; // Mark that pause is due to click
  };

  useEffect(() => {
    const marqueeNode = marqueeContainerRef.current;
    const contentNode = marqueeContentRef.current;

    if (!marqueeNode || !contentNode || marqueeAttarsDuplicated.length === 0) return;

    const items = Array.from(contentNode.children) as HTMLElement[];
    if (items.length === 0) return;

    // If marquee is paused by click, don't let observer override centered item
    if (isMarqueePaused && isClickPausedRef.current && centeredItemKey) {
        // We might still want to ensure the clicked item *is* visually centered if observer didn't catch it
        // but typically the click handler sets it correctly.
        // For now, just return to prevent observer from changing `centeredItemKey`.
        return;
    }


    const observer = new IntersectionObserver(
      (entries) => {
        // If marquee is paused by click, don't process observer entries
        if (isClickPausedRef.current && isMarqueePaused) return;

        let closestItem: HTMLElement | null = null;
        let minDistance = Infinity;

        const marqueeContainerRect = marqueeNode.getBoundingClientRect();
        if (marqueeContainerRect.width === 0) return;
        const containerCenter = marqueeContainerRect.left + marqueeContainerRect.width / 2;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemRect = entry.target.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(containerCenter - itemCenter);

            if (distance < minDistance && entry.intersectionRatio > 0.05) {
              minDistance = distance;
              closestItem = entry.target as HTMLElement;
            }
          }
        });

        if (closestItem) {
          const newKey = closestItem.dataset.itemKey || null;
          // Only update if the key has actually changed
          if (newKey !== centeredItemKey) {
            setCenteredItemKey(newKey);
          }
        } else {
           const anyIntersecting = entries.some(e => e.isIntersecting && e.intersectionRatio > 0.01);
           // Only update if not paused by click and key needs to change
           if (!anyIntersecting && !isClickPausedRef.current && centeredItemKey !== null) {
             setCenteredItemKey(null);
           }
        }
      },
      {
        root: marqueeNode,
        threshold: Array.from({ length: 101 }, (_, i) => i * 0.01),
      }
    );

    items.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      items.forEach((item) => {
        if (item) observer.unobserve(item);
      });
      observer.disconnect();
    };
    // centeredItemKey is a dependency because its current value is used in the logic.
    // isMarqueePaused is a dependency because the observer behavior changes based on it.
  }, [highlightedNewAttars, isMarqueePaused, centeredItemKey, marqueeAttarsDuplicated.length]);


  const handleMouseEnter = () => {
    if (!isClickPausedRef.current) { // Only pause on hover if not click-paused
      setIsMarqueePaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isClickPausedRef.current) { // Only resume on leave if not click-paused
      setIsMarqueePaused(false);
    }
  };


  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-lg overflow-hidden shadow-xl min-h-[400px] md:min-h-[500px] flex items-center justify-center text-center p-8 bg-gradient-to-br from-primary via-red-500 to-secondary">
        <div className="absolute inset-0 opacity-20">
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline mb-6 text-primary-foreground drop-shadow-md">
            Discover Your Signature Scent
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 drop-shadow-sm">
            Explore our curated collection of exquisite attars and fine fragrances, crafted with tradition and passion.
          </p>
          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-yellow-400 hover:text-secondary-foreground font-semibold px-10 py-6 text-lg shadow-lg transition-transform hover:scale-105">
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>

      {/* Spotlight New Attars Section */}
      {highlightedNewAttars.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-center mb-10 font-headline flex items-center justify-center">
            <Sparkles className="mr-3 h-8 w-8 text-secondary" />
            Spotlight: New Attars
          </h2>
          <div
            ref={marqueeContainerRef}
            className="marquee-container"
            role="region"
            aria-label="Spotlight New Attars Marquee"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // Add an outer click handler to reset click-pause if user clicks outside a card
            onClick={(e) => {
              if (e.target === marqueeContainerRef.current || e.target === marqueeContentRef.current) {
                if (isClickPausedRef.current) {
                  isClickPausedRef.current = false;
                  setIsMarqueePaused(false); // Resume if it was click-paused
                  // Optionally, clear centeredItemKey if desired when clicking background
                  // setCenteredItemKey(null);
                }
              }
            }}
          >
            <div
              ref={marqueeContentRef}
              className={cn("marquee-content", { 'paused': isMarqueePaused })}
            >
              {marqueeAttarsDuplicated.map((product, index) => {
                const itemKey = `${product.id}-${index}`;
                return (
                  <div
                    key={itemKey}
                    data-item-key={itemKey}
                    className={cn(
                      "marquee-item",
                      { 'is-centered': centeredItemKey === itemKey }
                    )}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent outer click handler if card is clicked
                      handleProductCardWrapperClick(itemKey);
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 font-headline">Featured Attars</h2>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No featured products available at the moment.</p>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-card rounded-lg shadow-md">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">Why Zoheb Attar Shop?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <Image src="https://placehold.co/80x80.png" alt="Authentic Quality" width={80} height={80} className="rounded-full bg-secondary p-2" data-ai-hint="quality seal" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-headline">Authentic Quality</h3>
              <p className="text-muted-foreground">Handpicked, pure ingredients for long-lasting and genuine fragrances.</p>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-4">
                 <Image src="https://placehold.co/80x80.png" alt="Unique Scents" width={80} height={80} className="rounded-full bg-secondary p-2" data-ai-hint="perfume variety" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-headline">Unique Scents</h3>
              <p className="text-muted-foreground">A diverse collection ranging from classic to contemporary attars.</p>
            </div>
            <div className="p-6">
               <div className="flex justify-center mb-4">
                 <Image src="https://placehold.co/80x80.png" alt="Customer Satisfaction" width={80} height={80} className="rounded-full bg-secondary p-2" data-ai-hint="happy customer" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-headline">Customer Satisfaction</h3>
              <p className="text-muted-foreground">Dedicated to providing an exceptional shopping experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


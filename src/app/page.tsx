
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

  const marqueeAttarsDuplicated = highlightedNewAttars.length > 0 ? [...highlightedNewAttars, ...highlightedNewAttars] : [];

  const handleProductCardWrapperClick = (itemKey: string) => {
    setIsMarqueePaused(true);
    setCenteredItemKey(itemKey); 
  };

  useEffect(() => {
    const marqueeNode = marqueeContainerRef.current;
    const contentNode = marqueeContentRef.current;

    if (!marqueeNode || !contentNode || marqueeAttarsDuplicated.length === 0) {
      if (isMarqueePaused && !centeredItemKey && contentNode && marqueeNode) {
        const itemsForManualCheck = Array.from(contentNode.children) as HTMLElement[];
        let closestItemManual: HTMLElement | null = null;
        let minDistanceManual = Infinity;
        const marqueeContainerRectManual = marqueeNode.getBoundingClientRect();
        const containerCenterManual = marqueeContainerRectManual.left + marqueeContainerRectManual.width / 2;

        itemsForManualCheck.forEach(itemEl => {
            const itemRect = itemEl.getBoundingClientRect();
            if (itemRect.right > marqueeContainerRectManual.left && itemRect.left < marqueeContainerRectManual.right) {
                const itemCenter = itemRect.left + itemRect.width / 2;
                const distance = Math.abs(containerCenterManual - itemCenter);
                if (distance < minDistanceManual) {
                    minDistanceManual = distance;
                    closestItemManual = itemEl;
                }
            }
        });
        if (closestItemManual) {
            setCenteredItemKey(closestItemManual.dataset.itemKey || null);
        }
      }
      return;
    }

    const items = Array.from(contentNode.children) as HTMLElement[];
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isMarqueePaused && centeredItemKey) return; 

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

            if (distance < minDistance && entry.intersectionRatio > 0.05) { // Check for at least 5% visibility
              minDistance = distance;
              closestItem = entry.target as HTMLElement;
            }
          }
        });
        
        if (closestItem) {
          setCenteredItemKey(closestItem.dataset.itemKey || null);
        } else {
           const anyIntersecting = entries.some(e => e.isIntersecting && e.intersectionRatio > 0.01); // A very low threshold
           if (!anyIntersecting && !isMarqueePaused) { // Only clear if not paused and nothing is visible
             setCenteredItemKey(null);
           }
        }
      },
      {
        root: marqueeNode,
        threshold: Array.from({ length: 101 }, (_, i) => i * 0.01), // Check every 1% for smoother updates
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
  }, [highlightedNewAttars, isMarqueePaused, centeredItemKey, marqueeAttarsDuplicated.length]);


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
            onMouseEnter={() => { if (!isMarqueePaused) setIsMarqueePaused(true); }} // Pause on hover only if not already click-paused
            onMouseLeave={() => { 
              // Resume on leave only if it was paused by hover, not by click
              // This is a bit tricky; for now, let's assume if it's paused and a specific item is centered due to a click, we don't auto-resume.
              // A simpler approach: always resume on mouse leave if no item is specifically centered by a click.
              // For now, to avoid complex state, let's stick to simple pause/resume on hover if not click-paused.
              // If you want more sophisticated hover pause/resume logic, let me know.
              // Current logic: if it's paused and a centeredItemKey is set (implying a click might have happened), don't resume.
              // If it's paused and NO centeredItemKey, it was likely a generic hover, so resume.
              if (isMarqueePaused && !centeredItemKey) setIsMarqueePaused(false); 
              // Or even simpler: if you want hover to always pause/resume regardless of click state (unless you manually unpause later)
              // setIsMarqueePaused(true); on enter, setIsMarqueePaused(false); on leave.
              // The current implementation: onMouseLeave={() => setIsMarqueePaused(false)} will resume animation if mouse leaves
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
                    onClick={() => handleProductCardWrapperClick(itemKey)}
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


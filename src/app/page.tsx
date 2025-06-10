import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { getFeaturedProducts, getNewArrivals } from '@/lib/data';
import Image from 'next/image';
import { PackagePlus } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-lg overflow-hidden shadow-xl min-h-[400px] md:min-h-[500px] flex items-center justify-center text-center p-8 bg-gradient-to-br from-primary via-red-500 to-secondary">
        <div className="absolute inset-0 opacity-20">
           {/* Optional: add subtle background image pattern here if desired */}
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

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-center mb-10 font-headline flex items-center justify-center">
            <PackagePlus className="mr-3 h-8 w-8 text-primary" />
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

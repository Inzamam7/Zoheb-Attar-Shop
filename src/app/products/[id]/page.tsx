import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductById, products as allProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Heart, Star, ShoppingCart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import WishlistButton from '@/components/products/WishlistButton'; // Separate component for client-side logic

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 3);

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

          <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.longDescription || product.description}
          </p>

          <div className="pt-4 space-y-3 sm:space-y-0 sm:flex sm:gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-primary-foreground shadow-md transition-all hover:shadow-lg">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart (Demo)
            </Button>
            <WishlistButton productId={product.id} productName={product.name} />
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

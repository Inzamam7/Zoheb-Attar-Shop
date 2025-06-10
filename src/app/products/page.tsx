"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { products as allProducts, categories } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const querySearchTerm = searchParams.get('q') || '';
    const queryCategory = searchParams.get('category') || 'all';
    setSearchTerm(querySearchTerm);
    setSelectedCategory(queryCategory);
  }, [searchParams]);

  useEffect(() => {
    let tempProducts = [...allProducts];

    if (searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(product => product.categorySlug === selectedCategory);
    }

    if (sortOption === 'price-asc') {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      tempProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      tempProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'featured') {
      tempProducts.sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.name.localeCompare(b.name));
    } else if (sortOption === 'new-arrivals') {
      tempProducts.sort((a,b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0) || a.name.localeCompare(b.name));
    }


    setFilteredProducts(tempProducts);
  }, [selectedCategory, sortOption, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortOption('featured');
    setSearchTerm('');
  };

  const filterControls = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 font-headline">Category</h3>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 font-headline">Sort By</h3>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="new-arrivals">New Arrivals</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={clearFilters} variant="outline" className="w-full">
        <X className="mr-2 h-4 w-4" /> Clear Filters
      </Button>
    </div>
  );


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">Our Attar Collection</h1>
        <p className="text-muted-foreground mt-2">
          Browse our exclusive range of authentic attars and fragrances.
          {searchTerm && ` Showing results for "${searchTerm}".`}
        </p>
      </div>

      <div className="md:hidden mb-4">
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> Filters & Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6 w-[300px]">
            <h2 className="text-xl font-bold mb-4 font-headline">Filters & Sort</h2>
            {filterControls}
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="hidden md:block md:w-1/4 lg:w-1/5 p-6 bg-card rounded-lg shadow-md h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-4 font-headline">Refine Your Search</h2>
          {filterControls}
        </aside>

        <main className="md:w-3/4 lg:w-4/5">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold mb-4">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any products matching your current filters. Try adjusting your search or filters.
              </p>
              <Button onClick={clearFilters} variant="default">
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

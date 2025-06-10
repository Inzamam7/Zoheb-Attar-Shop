"use client";
import Link from 'next/link';
import { Flame, Heart, Search, Sparkles, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link href={href} passHref>
    <Button variant="ghost" className="text-sm font-medium hover:bg-primary/10 hover:text-primary" onClick={onClick}>
      {children}
    </Button>
  </Link>
);

export default function Header() {
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const navItems = (
    <>
      <NavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
      <NavLink href="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</NavLink>
      <NavLink href="/summarizer" onClick={() => setIsMobileMenuOpen(false)}>
        <Sparkles className="mr-2 h-4 w-4 text-primary" /> AI Summarizer
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Zoheb Attar Shop Home">
          <Flame className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline text-primary">Zoheb Attar Shop</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          {navItems}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="h-9 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 h-9 w-9 text-muted-foreground hover:text-primary" aria-label="Submit search">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Link href="/wishlist" passHref>
            <Button variant="ghost" size="icon" className="relative text-primary hover:bg-primary/10" aria-label={`View wishlist, ${wishlistCount} items`}>
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>
          <div className="md:hidden">
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-6">
                <div className="flex flex-col space-y-4">
                 <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="self-end" aria-label="Close menu">
                      <X className="h-6 w-6" />
                    </Button>
                  </SheetClose>
                  {navItems}
                   <form onSubmit={(e) => {handleSearch(e); setIsMobileMenuOpen(false);}} className="flex items-center relative mt-4">
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="h-9 pr-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search products"
                    />
                    <Button type="submit" variant="ghost" size="icon" className="absolute right-0 h-9 w-9 text-muted-foreground hover:text-primary" aria-label="Submit search">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Zoheb Attar Shop. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Crafted with passion for fine fragrances.
        </p>
      </div>
    </footer>
  );
}

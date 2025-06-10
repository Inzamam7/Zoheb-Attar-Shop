
import Link from 'next/link';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';

const WHATSAPP_NUMBER = "917397865199";
const WHATSAPP_MESSAGE = "Hello Zoheb Attar Shop!";

export default function Footer() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <footer className="bg-accent text-accent-foreground py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Zoheb Attar Shop. All rights reserved.
        </p>
        <div className="mt-3 flex justify-center items-center space-x-4">
          <Link href="/contact" className="text-xs hover:text-primary transition-colors">
            Contact Us
          </Link>
          <span className="text-xs">|</span>
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-green-400 transition-colors flex items-center">
            <WhatsappIcon className="h-4 w-4 mr-1" /> Chat on WhatsApp
          </Link>
        </div>
        <p className="text-xs mt-3">
          Crafted with passion for fine fragrances.
        </p>
      </div>
    </footer>
  );
}

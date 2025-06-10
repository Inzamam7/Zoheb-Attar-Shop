import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import Image from 'next/image';

const WHATSAPP_NUMBER = "12345678900"; // Replace with your actual number e.g. 15551234567
const WHATSAPP_MESSAGE = "Hello Zoheb Attar Shop!";

export default function ContactPage() {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">Get In Touch</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          We&apos;d love to hear from you! Whether you have a question about our products, an order, or just want to say hello, feel free to reach out.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Contact Information</CardTitle>
            <CardDescription>Find us or drop us a line.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold">Our Address</h3>
                <p className="text-muted-foreground">123 Fragrance Lane, Scent City, Perfumistan 45678</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-muted-foreground">
                  <Link href="tel:+15552766200" className="hover:text-primary">+1 (555) AROMA-00</Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-muted-foreground">
                  <Link href="mailto:contact@zohebattar.com" className="hover:text-primary">contact@zohebattar.com</Link>
                </p>
              </div>
            </div>
             <div className="flex items-start gap-4 pt-4 border-t border-border">
              <WhatsappIcon className="h-6 w-6 text-green-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold">Chat on WhatsApp</h3>
                <p className="text-muted-foreground mb-2">For quick inquiries and orders.</p>
                <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                  <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon className="mr-2 h-4 w-4" /> Start Chat
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image 
            src="https://placehold.co/800x600.png" 
            alt="Customer service representative" 
            width={800} 
            height={600}
            className="object-cover w-full h-full aspect-[4/3]"
            data-ai-hint="customer service contact"
          />
        </div>
      </div>
    </div>
  );
}

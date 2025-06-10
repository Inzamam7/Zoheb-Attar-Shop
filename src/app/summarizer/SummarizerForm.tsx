"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { generateSummaryAction } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function SummarizerForm() {
  const [productDetails, setProductDetails] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary('');

    const result = await generateSummaryAction(productDetails);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.summary) {
      setSummary(result.summary);
      toast({
        title: "Summary Generated!",
        description: "Your product summary is ready.",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          AI Product Summarizer
        </CardTitle>
        <CardDescription>
          Enter your product details below and let our AI generate a concise and engaging summary for you.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="productDetails" className="block text-sm font-medium mb-1">
              Product Details
            </label>
            <Textarea
              id="productDetails"
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              placeholder="Describe your product, its features, benefits, target audience, etc. The more detail, the better the summary!"
              rows={8}
              className="shadow-inner"
              required
              disabled={isLoading}
            />
             <p className="text-xs text-muted-foreground mt-1">Minimum 50 characters recommended for best results.</p>
          </div>
          {summary && (
            <div className="space-y-2 p-4 bg-secondary/20 rounded-md border border-secondary">
              <h3 className="text-lg font-semibold font-headline text-primary">Generated Summary:</h3>
              <p className="text-sm whitespace-pre-wrap">{summary}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !productDetails.trim()} className="w-full bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 text-primary-foreground shadow-md transition-all hover:shadow-lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

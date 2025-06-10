import SummarizerForm from './SummarizerForm';

export default function SummarizerPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">AI-Powered Product Descriptions</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Leverage the power of AI to create compelling product summaries effortlessly. Perfect for your e-commerce listings, marketing copy, and more.
        </p>
      </div>
      <SummarizerForm />
    </div>
  );
}

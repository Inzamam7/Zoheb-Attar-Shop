
import { notFound } from 'next/navigation';
import { getProductById, products as allProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import ProductDetailsClient from './ProductDetailsClient';

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id,
  }));
}

interface ProductDetailsPageProps {
  params: { id: string };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const relatedProductsData = allProducts
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 3);

  return <ProductDetailsClient product={product} relatedProducts={relatedProductsData} />;
}

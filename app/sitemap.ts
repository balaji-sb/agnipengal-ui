import { MetadataRoute } from 'next';
import api from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com';

    // Static routes
    const routes = ['', '/products', '/deals', '/combos', '/contact', '/login', '/register'].map(
      (route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
      }),
    );

    try {
      // Fetch categories and products for dynamic routes
      const [categoriesRes, productsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products?limit=1000'), // Adjust limit as needed
      ]);

      const categories = categoriesRes.data.data || [];
      const products = productsRes.data.data || [];

      const categoryUrls = categories.map((category: any) => ({
        url: `${baseUrl}/category/${category.slug || category._id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      const productUrls = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.slug || product._id}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

      return [...routes, ...categoryUrls, ...productUrls];
    } catch (error) {
      console.error('Sitemap generation error:', error);
      return routes;
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [];
  }
}

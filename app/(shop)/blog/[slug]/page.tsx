import React from 'react';
import Image from 'next/image';
import api from '@/lib/api-server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Calendar, Tag, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getBlog(slug: string) {
  try {
    const res = await api.get(`/blogs/slug/${slug}`);
    // api-server returns { data: ... }
    return res.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  if (!blog) {
    return { title: 'Blog Not Found' };
  }

  const plainContent = blog.content ? blog.content.replace(/<[^>]*>?/gm, '').slice(0, 160) : '';

  return {
    title: `${blog.title} | Agnipengal Blog`,
    description: plainContent,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: plainContent,
      url: `${siteUrl}/blog/${slug}`,
      images: blog.image ? [{ url: blog.image }] : [],
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: [blog.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: plainContent,
      images: blog.image ? [blog.image] : [],
    },
    keywords: [
      blog.title,
      blog.category,
      'women entrepreneur stories',
      'Agnipengal blog',
    ],
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');
  const publishDate = blog.publishedAt || blog.createdAt;

  return (
    <article className='bg-white min-h-screen overflow-x-hidden'>
      {/* BreadcrumbList Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${siteUrl}/blog`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: blog.title,
                item: `${siteUrl}/blog/${slug}`,
              },
            ],
          }),
        }}
      />

      {/* BlogPosting Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            image: blog.image ? [blog.image] : [],
            datePublished: publishDate,
            dateModified: blog.updatedAt || publishDate,
            author: [
              {
                '@type': 'Person',
                name: blog.author,
              },
            ],
            publisher: {
              '@type': 'Organization',
              name: 'Agnipengal',
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
              },
            },
            description: blog.content ? blog.content.replace(/<[^>]*>?/gm, '').slice(0, 160) : '',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${siteUrl}/blog/${slug}`,
            },
          }),
        }}
      />

      {/* Blog Hero */}
      <div className='bg-gray-900 py-16 md:py-24 relative overflow-hidden'>
        <div className='absolute inset-0 bg-pink-600/10 mix-blend-overlay' />
        <div className='container mx-auto px-4 relative z-10'>
          <Link
            href='/blog'
            className='inline-flex items-center text-pink-400 hover:text-pink-300 mb-8 transition-colors group'
          >
            <ChevronLeft className='w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform' />
            Back to Blog
          </Link>
          <div className='max-w-4xl'>
            <div className='flex items-center gap-3 mb-6'>
              <span className='bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider'>
                {blog.category}
              </span>
              <span className='text-gray-400 text-sm flex items-center gap-1'>
                <Calendar className='w-3 h-3' />
                {new Date(publishDate).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h1 className='text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-8 leading-tight break-words'>
              {blog.title}
            </h1>
            <div className='flex items-center text-gray-300 gap-4 border-t border-gray-800 pt-8'>
              <div className='flex items-center gap-2'>
                <div className='w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold'>
                  {blog.author?.[0]}
                </div>
                <div>
                  <div className='text-sm font-bold text-white'>{blog.author}</div>
                  <div className='text-xs text-gray-500'>Author</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className='container mx-auto px-4 py-12 md:py-16'>
        <div className='max-w-4xl mx-auto'>
          {blog.image && (
            <div className='mb-8 md:mb-12 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px]'>
              <Image src={blog.image} alt={blog.title} fill className='object-cover' priority />
            </div>
          )}

          <div
            className='prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none text-gray-700 
                       w-full break-words overflow-x-hidden
                       prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mt-8 md:prose-headings:mt-12
                       prose-p:leading-relaxed prose-li:leading-loose
                       prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-2xl prose-img:shadow-lg'
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className='mt-16 pt-8 border-t border-gray-100 flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-400 text-sm'>
              <Tag className='w-4 h-4' />
              <span>
                Categorized in: <span className='text-gray-900 font-medium'>{blog.category}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

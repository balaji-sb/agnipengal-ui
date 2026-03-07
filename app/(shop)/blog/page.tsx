import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Metadata } from 'next';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | Agnipengal – Stories of Women Entrepreneurs',
  description:
    'Read the latest stories, tips, and updates from Agnipengal. Empowering women entrepreneurs through knowledge and community.',
  keywords: [
    'blog agnipengal',
    'women entrepreneur stories',
    'embroidery tips',
    'tailoring business india',
    'made in india marketplace',
    'women entrepreneur blog',
  ],
  alternates: {
    canonical: 'https://agnipengal.com/blog',
  },
};

async function getBlogs() {
  try {
    const res = await api.get('/blogs', { params: { isPublic: 'true' } });
    return res.data || [];
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className='bg-gray-50 min-h-screen pb-20'>
      {/* Hero Section */}
      <div className='bg-white border-b border-gray-100 mb-12'>
        <div className='container mx-auto px-4 py-16 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>Our Blog</h1>
          <p className='text-gray-500 max-w-2xl mx-auto'>
            Insights, updates, and stories from the heart of our women entrepreneur community.
          </p>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        {blogs.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogs.map((blog: any) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className='group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
              >
                {/* Image Container */}
                <div className='relative h-60 w-full overflow-hidden bg-gray-100'>
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-300'>
                      <span className='font-bold text-4xl'>{blog.title[0]}</span>
                    </div>
                  )}
                  <div className='absolute top-4 left-4 z-10'>
                    <span className='bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider'>
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className='p-6'>
                  <div className='flex items-center gap-4 text-xs text-gray-400 mb-3'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-3 h-3' />
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className='flex items-center gap-1'>
                      <User className='w-3 h-3' />
                      {blog.author}
                    </div>
                  </div>
                  <h2 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2'>
                    {blog.title}
                  </h2>
                  <div
                    className='text-gray-500 text-sm line-clamp-3 mb-6'
                    dangerouslySetInnerHTML={{
                      __html: blog.content.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
                    }}
                  />
                  <div className='flex items-center text-pink-600 font-bold text-sm'>
                    Read More
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200'>
            <p className='text-gray-500 text-xl'>
              We&apos;re currently crafting some amazing stories. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

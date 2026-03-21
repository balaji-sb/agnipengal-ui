import React from 'react';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import ContactForm from './ContactForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return {
    title: 'Contact Us | Agnipengal – Support for Women Entrepreneurs',
    description:
      'Have questions? Contact Agnipengal for support, partnership inquiries, or general feedback. We are here to empower your business journey.',
    keywords: [
      'contact Agnipengal',
      'women entrepreneur support India',
      'Agnipengal customer service',
      'partnership inquiries Agnipengal',
      'contact female entrepreneurs marketplace',
    ],
    openGraph: {
      title: 'Contact Us | Agnipengal',
      description: 'Get in touch with the Agnipengal team for support and inquiries.',
      url: `${siteUrl}/contact`,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Us | Agnipengal',
      description: 'Reach out to us for any assistance or partnership details.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/contact`,
    },
  };
}

export default async function ContactPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return (
    <div className='bg-gray-50 min-h-screen pb-20'>
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
                name: 'Contact',
                item: `${siteUrl}/contact`,
              },
            ],
          }),
        }}
      />

      {/* ContactPage Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Agnipengal',
            description: 'Contact information and form for Agnipengal - Women Owned Marketplace.',
            url: `${siteUrl}/contact`,
            mainEntity: {
              '@type': 'Organization',
              name: 'Agnipengal',
              email: 'agnipengal16@gmail.com',
              telephone: '+91 8088663116',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Chennai',
                addressRegion: 'Tamil Nadu',
                addressCountry: 'IN',
              },
            },
          }),
        }}
      />

      {/* Hero Section */}
      <div className='bg-white border-b border-gray-100'>
        <div className='container mx-auto px-4 py-20 text-center relative overflow-hidden'>
          <div className='absolute top-0 left-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 animate-blob' />
          <div className='absolute bottom-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000' />

          <h1 className='text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight relative z-10'>
            Get in{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600'>
              Touch
            </span>
          </h1>
          <p className='text-gray-500 text-lg md:text-xl max-w-2xl mx-auto relative z-10'>
            Have questions about our products or partnership programs? We&apos;re here to help you
            empower your business journey.
          </p>
        </div>
      </div>

      <div className='container mx-auto px-4 -mt-10 overflow-x-hidden'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Contact Info Cards */}
          <div className='lg:col-span-4 space-y-6'>
            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1'>
              <div className='w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6'>
                <Mail className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Email Us</h3>
              <p className='text-gray-500 mb-4'>Our friendly team is here to help.</p>
              <a
                href='mailto:agnipengal16@gmail.com'
                className='text-pink-600 font-bold hover:underline'
              >
                agnipengal16@gmail.com
              </a>
            </div>

            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1'>
              <div className='w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6'>
                <Phone className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Call Us</h3>
              <p className='text-gray-500 mb-4'>Mon-Fri from 9am to 6pm.</p>
              <a href='tel:+918088663116' className='text-orange-600 font-bold hover:underline'>
                +91 8088663116
              </a>
            </div>

            <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1'>
              <div className='w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6'>
                <MapPin className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Office</h3>
              <p className='text-gray-500 mb-4'>Come say hello at our office.</p>
              <p className='text-gray-900 font-medium'>
                Chennai, Tamil Nadu,
                <br />
                India
              </p>
            </div>

            {/* Social Media Links */}
            <div className='bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl text-white'>
              <h3 className='text-xl font-bold mb-6 flex items-center gap-2'>
                <Send className='w-5 h-5 text-pink-500' />
                Follow Our Journey
              </h3>
              <div className='grid grid-cols-3 gap-4'>
                <a
                  href='https://www.instagram.com/agnipengal/'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-pink-600/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-pink-500'
                  >
                    <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
                    <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
                    <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    Insta
                  </span>
                </a>
                <a
                  href='https://www.facebook.com/agnipengal'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-blue-600/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-blue-500'
                  >
                    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    FB
                  </span>
                </a>
                <a
                  href='https://www.youtube.com/@agnipengaldotcom'
                  target='_blank'
                  className='flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl hover:bg-red-600/20 transition-all border border-white/10'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-red-500'
                  >
                    <path d='M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17' />
                    <path d='m10 15 5-3-5-3z' />
                  </svg>
                  <span className='text-[10px] uppercase tracking-wider font-bold opacity-60'>
                    YT
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-8'>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

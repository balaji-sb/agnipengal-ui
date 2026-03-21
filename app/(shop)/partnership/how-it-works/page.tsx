import React from 'react';
import type { Metadata } from 'next';
import HowItWorksClient from './HowItWorksClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return {
    title: 'How It Works | Agnipengal – Selling Guide for Women Entrepreneurs',
    description:
      'Learn how to sell on Agnipengal in 5 simple steps. From registration and setting up your digital storefront to listing products and scaling your business across India.',
    keywords: [
      'how to sell on Agnipengal',
      'women entrepreneur guide India',
      'selling handmade products online',
      'Agnipengal vendor guide',
      'launch digital storefront India',
    ],
    openGraph: {
      title: 'How It Works | Agnipengal',
      description: 'Your step-by-step guide to starting and growing your business on Agnipengal.',
      url: `${siteUrl}/partnership/how-it-works`,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@agnipengal',
      title: 'How It Works | Agnipengal',
      description: 'The complete guide to selling on Agnipengal.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/partnership/how-it-works`,
    },
  };
}

export default async function HowItWorksPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return (
    <>
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
                name: 'Partnership',
                item: `${siteUrl}/partnership`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'How It Works',
                item: `${siteUrl}/partnership/how-it-works`,
              },
            ],
          }),
        }}
      />
      <HowItWorksClient />
    </>
  );
}

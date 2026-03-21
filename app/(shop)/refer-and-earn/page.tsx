import React from 'react';
import type { Metadata } from 'next';
import ReferAndEarnClient from './ReferAndEarnClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return {
    title: 'Refer & Earn | Partner Rewards Program | Agnipengal',
    description:
      'Join the Agnipengal Partner Rewards Program. Refer other women entrepreneurs and earn free subscription days for your business. Grow together, earn together.',
    keywords: [
      'refer and earn Agnipengal',
      'women entrepreneur rewards India',
      'Agnipengal partner program',
      'business referral rewards',
      'grow women-owned business India',
    ],
    openGraph: {
      title: 'Refer & Earn | Agnipengal Partner Rewards',
      description: 'Invite businesses to join Agnipengal and earn free subscription extensions.',
      url: `${siteUrl}/refer-and-earn`,
      images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Refer & Earn | Agnipengal',
      description: 'Grow your network and earn rewards on Agnipengal.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/refer-and-earn`,
    },
  };
}

export default async function ReferAndEarnPage() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com').replace(/\/$/, '');

  return (
    <div className='min-h-screen bg-gray-50 font-sans pb-20'>
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
                name: 'Refer and Earn',
                item: `${siteUrl}/refer-and-earn`,
              },
            ],
          }),
        }}
      />

      <ReferAndEarnClient />
    </div>
  );
}

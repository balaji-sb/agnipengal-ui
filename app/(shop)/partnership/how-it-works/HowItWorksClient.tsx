'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  UserPlus,
  Store,
  Package,
  ShoppingBag,
  BadgeIndianRupee,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  BarChart3,
  Shield,
  Clock,
  Headphones,
} from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Register & Choose a Plan',
    description:
      'Sign up as a vendor partner in minutes. Choose our 1 Month Free plan to get started instantly, or pick a premium subscription for advanced growth tools.',
    color: 'orange',
    detail: [
      'Fill in your basic details and store name',
      'Select a subscription plan (Free or Premium)',
      'No setup fee, zero hidden charges',
    ],
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
  },
  {
    number: '02',
    icon: Store,
    title: 'Set Up Your Storefront',
    description:
      'Your own branded storefront — complete with a unique URL, logo, banner, and bio. Customise it to tell your brand story to thousands of buyers.',
    color: 'rose',
    detail: [
      'Dedicated URL: yourstore.agnipengal.com',
      'Upload logo, banner, and store description',
      'Categorise your products your way',
    ],
    image:
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=800',
  },
  {
    number: '03',
    icon: Package,
    title: 'List Your Products',
    description:
      'Add unlimited products with photos, descriptions, pricing, and inventory. Our intuitive dashboard makes listing as simple as posting on social media.',
    color: 'amber',
    detail: [
      'Bulk upload or add one by one',
      'Set variants, stock levels & pricing',
      'Products go live instantly after approval',
    ],
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
  },
  {
    number: '04',
    icon: ShoppingBag,
    title: 'Customers Discover & Order',
    description:
      "Your products appear across Agnipengal's marketplace, category pages, and search results \u2014 reaching buyers actively looking for handmade and artisan products.",
    color: 'violet',
    detail: [
      'Featured on category and deal pages',
      'Searchable nationwide on Agnipengal',
      'Customers pay securely via Razorpay',
    ],
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
  },
  {
    number: '05',
    icon: BadgeIndianRupee,
    title: 'Ship, Earn & Grow',
    description:
      'Receive orders, pack them, and ship directly to customers. Earnings are tracked in your dashboard and settled to your bank on a regular cycle.',
    color: 'green',
    detail: [
      'Manage orders from vendor dashboard',
      'Earnings visible in real-time',
      'Regular bank settlements',
    ],
    image:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
  },
];

const colorMap: Record<string, Record<string, string>> = {
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'bg-orange-100 text-orange-600',
    number: 'text-orange-500',
    badge: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
    line: 'border-orange-200',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'bg-rose-100 text-rose-600',
    number: 'text-rose-500',
    badge: 'bg-rose-100 text-rose-700',
    dot: 'bg-rose-500',
    line: 'border-rose-200',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'bg-amber-100 text-amber-600',
    number: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
    line: 'border-amber-200',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    icon: 'bg-violet-100 text-violet-600',
    number: 'text-violet-500',
    badge: 'bg-violet-100 text-violet-700',
    dot: 'bg-violet-500',
    line: 'border-violet-200',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    number: 'text-green-500',
    badge: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
    line: 'border-green-200',
  },
};

const faqs = [
  {
    q: 'How much does it cost to become a vendor?',
    a: 'We offer a "1 Month Free" plan that costs ₹0 for your first month, perfect for new sellers. You can also upgrade to a Premium plan at any time for additional featured placement and priority support. There are zero setup fees.',
  },
  {
    q: 'Do I need a GST number to sell on Agnipengal?',
    a: 'Not necessarily for getting started. However, for higher-volume selling and to comply with Indian tax laws, a GST registration is recommended. Our team can guide you through this as you grow.',
  },
  {
    q: 'How do customers pay, and when do I get my money?',
    a: 'Customers pay securely via Razorpay (UPI, cards, net-banking). Your earnings are tracked in the vendor dashboard and settled to your registered bank account on a regular cycle.',
  },
  {
    q: 'Can I sell handmade as well as resold products?',
    a: 'Agnipengal is built for women entrepreneurs — including artisans, home-based sellers, and small-business owners. You can list handmade, self-manufactured, or curated resold products.',
  },
  {
    q: 'How do orders and shipping work?',
    a: 'When a customer places an order, you receive a notification in your vendor dashboard. You pack the order and ship it using any courier of your choice. You update the tracking number in the dashboard so the customer can track delivery.',
  },
  {
    q: 'Is there any support if I get stuck?',
    a: 'Yes! Our vendor support team is available via the in-app support ticket system. Premium plan subscribers get priority response times, but help is available for all plans including the Free tier.',
  },
  {
    q: 'Can I upgrade or downgrade my plan later?',
    a: 'Absolutely. You can start with our 1 Month Free plan and upgrade to a Premium plan at any time through your vendor dashboard. If you upgrade, the new features will be unlocked instantly.',
  },
];

const perks = [
  {
    icon: HeartHandshake,
    title: 'Community of Women Entrepreneurs',
    desc: 'Network, learn, and grow alongside thousands of like-minded women sellers.',
  },
  {
    icon: BarChart3,
    title: 'Vendor Analytics Dashboard',
    desc: 'Track views, orders, revenue, and customer behaviour in one clean dashboard.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'All transactions processed securely via Razorpay — zero fraud risk on your end.',
  },
  {
    icon: Clock,
    title: 'Go Live in Under an Hour',
    desc: 'From signup to your first product listing in less than 60 minutes.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Vendor Support',
    desc: 'Real humans ready to help you via our support ticket system.',
  },
  {
    icon: Sparkles,
    title: 'Featured Placement Opportunities',
    desc: 'Top vendors get spotlighted on the homepage, deals, and category pages.',
  },
];

export default function HowItWorksClient() {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const step = steps[activeStep];
  const c = colorMap[step.color];

  return (
    <div className='bg-[#FAF9F6] min-h-screen font-sans'>
      {/* ── Hero ── */}
      <section className='relative overflow-hidden bg-white border-b border-gray-100'>
        <div
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className='container mx-auto px-6 py-24 text-center relative z-10 max-w-4xl'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-8'>
            <Sparkles className='w-3.5 h-3.5 text-orange-600' />
            <span className='text-xs font-semibold text-orange-700 uppercase tracking-wider'>
              For Women Entrepreneurs
            </span>
          </div>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight'>
            How Selling on{' '}
            <span className='text-orange-600 relative inline-block'>
              Agnipengal
              <svg
                className='absolute w-full h-2.5 -bottom-1 left-0 text-orange-200'
                viewBox='0 0 100 10'
                preserveAspectRatio='none'
              >
                <path
                  d='M0 5 Q 50 10 100 5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='8'
                  strokeLinecap='round'
                />
              </svg>
            </span>{' '}
            Works
          </h1>
          <p className='text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10'>
            From sign-up to your first sale — here&apos;s everything you need to know about
            launching your store and reaching thousands of buyers.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/partnership/register'>
              <button className='px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-all flex items-center gap-2'>
                Start Free Now <ArrowRight className='w-5 h-5' />
              </button>
            </Link>
            <Link href='/partnership'>
              <button className='px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-lg hover:border-gray-900 transition-all'>
                View Plans
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Interactive Steps ── */}
      <section className='py-24 px-6'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
              5 Steps to Your First Sale
            </h2>
            <p className='text-gray-500 text-lg max-w-xl mx-auto'>
              Click any step to explore the details.
            </p>
          </div>

          <div className='grid lg:grid-cols-12 gap-10 items-start'>
            {/* Step Selector */}
            <div className='lg:col-span-4 flex flex-col gap-3'>
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = idx === activeStep;
                const cm = colorMap[s.color];
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isActive
                        ? `${cm.bg} ${cm.border} shadow-sm`
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isActive ? cm.icon : 'bg-gray-100 text-gray-400'}`}
                    >
                      <Icon className='w-5 h-5' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${isActive ? cm.number : 'text-gray-400'}`}
                      >
                        Step {s.number}
                      </span>
                      <p
                        className={`text-sm font-semibold truncate ${isActive ? 'text-gray-900' : 'text-gray-600'}`}
                      >
                        {s.title}
                      </p>
                    </div>
                    {isActive && <div className={`w-2 h-2 rounded-full shrink-0 ${cm.dot}`} />}
                  </button>
                );
              })}
            </div>

            {/* Step Detail Card */}
            <div
              className={`lg:col-span-8 rounded-2xl border-2 ${c.border} ${c.bg} overflow-hidden shadow-lg`}
            >
              {/* Image */}
              <div className='relative h-64 overflow-hidden'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.title}
                  className='w-full h-full object-cover transition-all duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${c.badge}`}
                >
                  Step {step.number}
                </div>
                <div
                  className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center ${c.icon}`}
                >
                  {React.createElement(step.icon, { className: 'w-6 h-6' })}
                </div>
              </div>

              {/* Content */}
              <div className='p-8'>
                <h3 className='text-2xl font-bold text-gray-900 mb-3'>{step.title}</h3>
                <p className='text-gray-600 text-lg leading-relaxed mb-6'>{step.description}</p>
                <ul className='space-y-3'>
                  {step.detail.map((d, i) => (
                    <li key={i} className='flex items-start gap-3'>
                      <CheckCircle2
                        className={`w-5 h-5 mt-0.5 shrink-0 ${c.dot.replace('bg-', 'text-')}`}
                      />
                      <span className='text-gray-700 font-medium'>{d}</span>
                    </li>
                  ))}
                </ul>

                {/* Navigation */}
                <div className='flex items-center justify-between mt-8 pt-6 border-t border-black/10'>
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className='text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors'
                  >
                    ← Previous
                  </button>
                  <div className='flex gap-2'>
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === activeStep ? `w-6 ${c.dot}` : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                  {activeStep < steps.length - 1 ? (
                    <button
                      onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                      className='text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors'
                    >
                      Next →
                    </button>
                  ) : (
                    <Link href='/partnership/register'>
                      <button className='text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors flex items-center gap-1'>
                        Get Started <ArrowRight className='w-4 h-4' />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Agnipengal Perks ── */}
      <section className='py-24 px-6 bg-white border-y border-gray-100'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
              Everything You Need to Succeed
            </h2>
            <p className='text-gray-500 text-lg max-w-xl mx-auto'>
              Agnipengal gives you the tools, community, and platform to build a real business.
            </p>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className='group p-6 bg-[#FAF9F6] rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200'
                >
                  <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-5 group-hover:bg-orange-600 group-hover:text-white transition-all duration-200'>
                    <Icon className='w-6 h-6' />
                  </div>
                  <h3 className='text-base font-bold text-gray-900 mb-2'>{perk.title}</h3>
                  <p className='text-sm text-gray-500 leading-relaxed'>{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className='py-24 px-6'>
        <div className='container mx-auto max-w-4xl'>
          <div className='bg-gradient-to-br from-orange-600 to-rose-600 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden'>
            <div
              className='absolute inset-0 opacity-10'
              style={{
                backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className='relative z-10'>
              <div className='w-16 h-16 rounded-full overflow-hidden mx-auto mb-6 border-4 border-white/40'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='https://i.pravatar.cc/100?img=44'
                  alt='Vendor testimonial'
                  className='w-full h-full object-cover'
                />
              </div>
              <blockquote className='text-xl md:text-2xl font-medium leading-relaxed mb-6 max-w-2xl mx-auto'>
                &ldquo;Within 3 months of joining Agnipengal, I went from selling at local fairs to
                receiving orders from across India. The platform is simple, the support is
                real.&rdquo;
              </blockquote>
              <p className='font-bold text-orange-100'>Kavitha R.</p>
              <p className='text-orange-200 text-sm'>Aari Embroidery Artist, Coimbatore</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className='py-24 px-6 bg-white border-t border-gray-100'>
        <div className='container mx-auto max-w-3xl'>
          <div className='text-center mb-14'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
              Frequently Asked Questions
            </h2>
            <p className='text-gray-500 text-lg'>Still have questions? We&apos;re here to help.</p>
          </div>
          <div className='space-y-3'>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className='bg-[#FAF9F6] rounded-xl border border-gray-100 overflow-hidden'
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className='w-full flex items-center justify-between p-6 text-left gap-4'
                >
                  <span className='font-semibold text-gray-900'>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className='px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4'>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className='py-24 px-6 bg-gray-900'>
        <div className='container mx-auto max-w-3xl text-center'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 mb-8'>
            <u className='w-3.5 h-3.5 text-orange-400' />
            <span className='text-xs font-semibold text-orange-300 uppercase tracking-wider'>
              Ready to start?
            </span>
          </div>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
            Join Thousands of Women Selling on Agnipengal
          </h2>
          <p className='text-gray-400 text-lg mb-10 max-w-xl mx-auto'>
            Your store. Your prices. Your customers. Get started today by choosing a subscription
            plan.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/partnership/register'>
              <button className='px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-xl shadow-orange-900/30 transition-all flex items-center gap-2'>
                Create Your Store <ArrowRight className='w-5 h-5' />
              </button>
            </Link>
            <Link href='/partnership'>
              <button className='px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all'>
                Compare Plans
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

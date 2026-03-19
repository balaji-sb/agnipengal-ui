'use client';

import { useTransition, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { setLanguage } from '@/app/actions/language';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिंदी' },
];

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (nextLocale: string) => {
    setIsOpen(false);
    if (nextLocale === currentLocale) return;
    
    startTransition(() => {
      setLanguage(nextLocale).then(() => {
        router.refresh();
      });
    });
  };

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className='p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all relative group focus:outline-none'
        aria-label='Change language'
      >
        <Globe className='h-5 w-5 group-hover:scale-110 transition-transform' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-36 rounded-2xl shadow-xl border border-gray-100 bg-white ring-1 ring-black ring-opacity-5 z-50 py-2 overflow-hidden transform origin-top-right transition-all'>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`block w-full text-left px-5 py-2.5 text-sm font-medium transition-colors ${
                currentLocale === lang.code
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-500'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

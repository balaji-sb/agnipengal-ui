import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="flex flex-col items-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Successful!</h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
          Thank you for your purchase. Your order has been placed successfully and will be shipped soon.
        </p>
        <Link 
            href="/"
            className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition shadow-lg"
        >
            Continue Shopping
        </Link>
      </div>
    </div>
  );
}

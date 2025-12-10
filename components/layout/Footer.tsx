export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
            Mahi's Vriksham Boutique
          </h3>
          <p className="text-gray-400 text-sm">
            Your one-stop shop for Aari raw materials, sewing kits, and decoration items. Premium quality for your creativity.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-gray-200">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-pink-400 transition">Running Material</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Sewing Kits</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Decorations</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">New Arrivals</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-gray-200">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-pink-400 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-gray-200">Connect</h4>
          <div className="flex space-x-4 text-gray-400">
            {/* Social Icons Placeholders */}
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">IG</div>
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">FB</div>
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">YT</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Mahi's Vriksham Boutique. All rights reserved.
      </div>
    </footer>
  );
}

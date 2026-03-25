'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Clock, Mail, ChevronRight } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.05, 1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20"
              >
                <Hammer className="w-12 h-12 text-white" />
              </motion.div>
              
              {/* Pulsing Ring */}
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-purple-500 rounded-2xl"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Under <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Maintenance</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed max-w-lg mx-auto">
            We're currently fine-tuning our experience to serve you better. 
            We'll be back online shortly with some exciting updates.
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <Clock className="w-6 h-6 text-purple-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-1">Estimated Time</h3>
              <p className="text-gray-500 text-sm">Usually within 2-4 hours</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <Mail className="w-6 h-6 text-blue-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-1">Stay Updated</h3>
              <p className="text-gray-500 text-sm">Follow us for latest news</p>
            </div>
          </div>

          {/* Subscription / Back Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2 group"
              onClick={() => window.location.reload()}
            >
              Check Again
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="mailto:support@agnipengal.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact Support
            </a>
          </div>
        </motion.div>

        {/* Floating Particles/Shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <footer className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/20 text-sm tracking-widest uppercase">
          © {new Date().getFullYear()} Agni Pengal. Premium Excellence.
        </p>
      </footer>
    </div>
  );
}

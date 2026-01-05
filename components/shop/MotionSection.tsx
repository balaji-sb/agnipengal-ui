'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function MotionSection({ children, className = '', delay = 0 }: MotionSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

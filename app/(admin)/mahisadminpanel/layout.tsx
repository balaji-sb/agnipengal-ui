'use client';

import React from 'react';
import AuthContext from '@/lib/context/SessionContext';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContext>
      {children}
    </AuthContext>
  );
}

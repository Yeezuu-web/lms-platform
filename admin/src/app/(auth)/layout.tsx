import NoRequireAuth from '@/providers/auth-page';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <NoRequireAuth>{children}</NoRequireAuth>;
}

// import './globals.css'
'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ReactNode, useEffect, useState } from 'react';
import { RootState } from '@/redux/store';

const authRoutes = ['/login', '/register', '/activate-account'];

export default function NoRequireAuth({ children }: { children: ReactNode }) {
  const [isUser, setIsUser] = useState({});
  const { user } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    if (user && authRoutes.includes(pathname)) push('/dashboard');

    if (user) setIsUser(user);
  }, [user, pathname, push]);

  return <>{children}</>;
}

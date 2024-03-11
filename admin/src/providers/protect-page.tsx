// import './globals.css'
'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ReactNode, useEffect, useState } from 'react';
import { RootState } from '@/redux/store';
import Loader from '@/components/loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [isUser, setIsUser] = useState({});
  const { user } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const { push } = useRouter();
  const { isLoading } = useLoadUserQuery({});

  useEffect(() => {
    if (!user && pathname.startsWith('/dashboard')) push('/login');

    if (user) setIsUser(user);
  }, [user, pathname, push]);

  if (!user?.email) return <Loader />;

  return <>{isLoading ? <Loader /> : <>{children}</>}</>;
}

'use client';

import Loader from '@/components/loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { RootState } from '@/redux/store';
import { IUser } from '@/servers/user-actions';
import { redirect, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const exceptionalRoutes = ['/auth/login', '/auth/register', '/activat-account'];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<IUser | null>();

  const { user } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  let isGoingExceptionalRoutes = exceptionalRoutes.includes(pathname);

  useEffect(() => {
    if (!user && isGoingExceptionalRoutes) {
      redirect('/auth/login');
    } else {
      setCurrentUser(user);
    }
  }, [user, isGoingExceptionalRoutes]);

  return <>{children}</>;
}
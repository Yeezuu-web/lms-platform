'use client';

import Loader from '@/components/loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';

export function Custom() {
  const { isLoading } = useLoadUserQuery({});

  return <>{isLoading ? <Loader /> : <></>}</>;
}

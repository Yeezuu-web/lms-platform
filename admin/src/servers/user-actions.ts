'use server';

import { NextRequest } from 'next/server';

export type IUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  courses: [];
};

export const getAuth = async (req: NextRequest) => {
  const result = await fetch('http://localhost:8000/api/v1/me', {
    method: req.method,
    headers: req.headers,
    credentials: 'include',
  });

  const data = await result.json();
  return data.user;
};

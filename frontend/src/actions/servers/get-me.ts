'use server';

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function getMe(accessToken: RequestCookie) {
  const response = await fetch('http://localhost:8000/api/v1/me', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  });

  const data = await response.json();

  return data;
}

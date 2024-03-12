import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function getAccessTokenFromRefreshToken(
  refresh_token: RequestCookie
) {
  const response = await fetch('http://localhost:8000/api/v1/refresh-token', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refresh_token.value}`,
    },
  });

  const data = await response.json();

  return data;
}

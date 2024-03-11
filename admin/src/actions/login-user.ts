'use server';

export const login = async (
  credentials: Record<string, string> | undefined
) => {
  const res = await fetch('http://localhost:8000/api/v1/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include' as const,
  });

  const result = await res.json();

  return result;
};

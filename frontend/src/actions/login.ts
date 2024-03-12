import { z } from 'zod';
import { LoginSchema } from '@/schemas/login';

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid credentails!' };
  }

  const response = await fetch('http://localhost:8000/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedFields.data),
    credentials: 'include' as const,
  });

  const data = await response.json();

  if (!response.ok && data.status === 'error')
    return { error: data.message || 'Something went wrong.' };

  if (data.user) return { success: 'Login successful.' };
}

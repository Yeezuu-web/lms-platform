'use server';

export type IUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  courses: [];
};

interface IResponseType {
  success: boolean;
  user: IUser;
  accessToken: string;
}

export const loginUser = async (credentails: {
  email: string;
  password: string;
}): Promise<IResponseType> => {
  const response = await fetch('http://localhost:8000/api/v1/login', {
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
    credentials: 'include',
    body: JSON.stringify(credentails),
  });

  if (!response.ok) {
    const errorMessage = `Failed to login: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return await response.json();
};

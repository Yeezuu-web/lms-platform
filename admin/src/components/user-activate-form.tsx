'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActivationMutation } from '@/redux/features/auth/authApi';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserActivateForm({ className, ...props }: UserAuthFormProps) {
  const [inValidError, setInValidError] = React.useState<boolean>(false);
  const [activation, { isLoading, data, isSuccess, error }] =
    useActivationMutation();
  const { token } = useSelector((state: any) => state.atuh) || { token: '' };

  const [otp, setOTP] = React.useState<string[]>(['', '', '', '']);
  const inputRefs = React.useRef<HTMLInputElement[]>(Array(4).fill(null));

  const handleInputChange = (index: number, value: string) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredOTP = otp.join('');

    if (enteredOTP.length === 4) {
      await activation({ token, enteredOTP });
    } else {
      setInValidError(true);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || 'Account created successfully!');
      redirect('/auth/login');
    } else if (error) {
      setInValidError(true);
      if ('data' in error) {
        toast.error(`
          ${(error as any).data?.message} ${
          (error as any).data?.ttl
            ? 'wait ' + (error as any).data?.ttl + 's'
            : ''
        }
        `);
      } else {
        console.log(error);
      }
    }
  }, [isSuccess, error, data]);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="w-full flex flex-col items-center gap-4">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <div className="w-full flex items-center justify-center space-x-6">
            {otp.map((value, index) => (
              <Input
                maxLength={1}
                key={index}
                ref={(el) =>
                  (inputRefs.current[index] = el as HTMLInputElement)
                }
                type="number"
                className={cn(
                  'w-12 h-12 text-muted-foreground rounded-lg font-semibold focus:outline-none text-center',
                  inValidError ? 'shake border-red-500' : ''
                )}
                placeholder=""
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value.replace(/\D/, '');
                  if (newValue.length > 1) return;
                  handleInputChange(index, e.target.value);
                }}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <Button disabled={isLoading} className="mt-4">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  );
}

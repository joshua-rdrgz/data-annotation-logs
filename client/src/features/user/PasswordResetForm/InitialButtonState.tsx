import React from 'react';
import { useSendPasswordResetOtp } from '@/features/user/useSendPasswordResetOtp';
import { Button } from '@/ui/button';

export const InitialButtonState: React.FC = () => {
  const { mutate: sendPasswordResetOtp, isPending } = useSendPasswordResetOtp();

  return (
    <Button
      onClick={() => sendPasswordResetOtp()}
      disabled={isPending}
      className='w-full text-center'
    >
      {isPending ? 'Sending OTP...' : 'Change My Password'}
    </Button>
  );
};

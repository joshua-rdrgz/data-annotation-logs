import { PasswordResetTestIds } from '@/features/user/testIds';
import { useSendPasswordResetOtp } from '@/features/user/useSendPasswordResetOtp';
import { Button } from '@/ui/button';
import React from 'react';

export const InitialButtonState: React.FC = () => {
  const { mutate: sendPasswordResetOtp, isPending } = useSendPasswordResetOtp();

  return (
    <Button
      onClick={() => sendPasswordResetOtp()}
      disabled={isPending}
      data-testid={PasswordResetTestIds.InitiateButton}
      className='w-full text-center'
    >
      {isPending ? 'Sending OTP...' : 'Change My Password'}
    </Button>
  );
};

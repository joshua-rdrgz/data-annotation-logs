import { PasswordResetTestIds } from '@/features/user/testIds';
import { Button } from '@/ui/button';
import { WarningBox } from '@/ui/WarningBox';
import React from 'react';

interface CooldownStateProps {
  cooldownMinsRemaining: number;
}

export const CooldownState: React.FC<CooldownStateProps> = ({
  cooldownMinsRemaining,
}) => (
  <>
    <WarningBox data-testid={PasswordResetTestIds.CooldownWarning}>
      Password reset is locked right now. Please wait {cooldownMinsRemaining}{' '}
      minutes before trying again.
    </WarningBox>
    <Button
      disabled
      className='w-full text-center'
      data-testid={PasswordResetTestIds.InitiateButton}
    >
      Change My Password
    </Button>
  </>
);

import { PasswordResetTestIds } from '@/features/user/testIds';
import { Button } from '@/ui/button';
import { WarningBox } from '@/ui/WarningBox';
import { minutesToReadableString } from '@/utils/minutesToReadableString';
import React from 'react';

interface CompleteCooldownStateProps {
  cooldownMinsRemaining: number;
}

export const CompleteCooldownState: React.FC<CompleteCooldownStateProps> = ({
  cooldownMinsRemaining,
}) => (
  <>
    <WarningBox data-testid={PasswordResetTestIds.CooldownWarning}>
      You've recently changed your password. Please wait{' '}
      {minutesToReadableString(cooldownMinsRemaining)} to change your password
      again.
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

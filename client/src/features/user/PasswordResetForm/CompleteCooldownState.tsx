import React from 'react';
import { Button } from '@/ui/button';
import { WarningBox } from '@/ui/WarningBox';
import { minutesToReadableString } from '@/utils/minutesToReadableString';

interface CompleteCooldownStateProps {
  cooldownMinsRemaining: number;
}

export const CompleteCooldownState: React.FC<CompleteCooldownStateProps> = ({
  cooldownMinsRemaining,
}) => (
  <>
    <WarningBox>
      You've recently changed your password. Please wait{' '}
      {minutesToReadableString(cooldownMinsRemaining)} to change your password
      again.
    </WarningBox>
    <Button disabled className='w-full text-center'>
      Change My Password
    </Button>
  </>
);

import React from 'react';
import { Button } from '@/ui/button';
import { WarningBox } from '@/ui/WarningBox';

interface CooldownStateProps {
  cooldownMinsRemaining: number;
}

export const CooldownState: React.FC<CooldownStateProps> = ({
  cooldownMinsRemaining,
}) => (
  <>
    <WarningBox>
      Password reset is locked right now. Please wait {cooldownMinsRemaining}{' '}
      minutes before trying again.
    </WarningBox>
    <Button disabled className='w-full text-center'>
      Change My Password
    </Button>
  </>
);

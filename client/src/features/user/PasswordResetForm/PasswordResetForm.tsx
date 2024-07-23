import React from 'react';
import { useUser } from '@/features/user/useUser';
import { UserSettingsFormWrapper } from '../UserSettingsFormWrapper';
import { InitialButtonState } from './InitialButtonState';
import { OtpVerificationState } from './OtpVerificationState';
import { PasswordChangeState } from './PasswordChangeState';
import { CooldownState } from './CooldownState';
import { PasswordResetStatus } from '@/api/user/types';

export const PasswordResetForm: React.FC = () => {
  const { data: user } = useUser();

  return (
    <UserSettingsFormWrapper heading='Change Password'>
      {(() => {
        switch (user?.passwordResetStatus) {
          case PasswordResetStatus.INACTIVE:
            return <InitialButtonState />;
          case PasswordResetStatus.OTP_SENT:
            return <OtpVerificationState />;
          case PasswordResetStatus.OTP_VERIFIED:
            return <PasswordChangeState />;
          case PasswordResetStatus.OTP_ON_COOLDOWN:
            return (
              <CooldownState
                cooldownMinsRemaining={user.cooldownMinsRemaining || 0}
              />
            );
          default:
            return null;
        }
      })()}
    </UserSettingsFormWrapper>
  );
};

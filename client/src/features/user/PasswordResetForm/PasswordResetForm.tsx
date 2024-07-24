import { PasswordResetStatus } from '@/api/user/types';
import { useUser } from '@/features/user/useUser';
import React from 'react';
import { UserSettingsFormWrapper } from '../UserSettingsFormWrapper';
import { CompleteCooldownState } from './CompleteCooldownState';
import { CooldownState } from './CooldownState';
import { InitialButtonState } from './InitialButtonState';
import { OtpVerificationState } from './OtpVerificationState';
import { PasswordChangeState } from './PasswordChangeState';

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
          case PasswordResetStatus.OTP_TIMEOUT_COOLDOWN:
            return (
              <CooldownState
                cooldownMinsRemaining={user.cooldownMinsRemaining || 0}
              />
            );
          case PasswordResetStatus.OTP_COMPLETE_COOLDOWN:
            return (
              <CompleteCooldownState
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

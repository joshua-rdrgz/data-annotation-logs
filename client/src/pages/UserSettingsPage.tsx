import { BaseUserSettingsForm } from '@/features/user/BaseUserSettingsForm';
import { PasswordResetForm } from '@/features/user/PasswordResetForm';
import { UserEmailSettingsForm } from '@/features/user/UserEmailSettingsForm';

export const UserSettingsPage = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-24'>
      <BaseUserSettingsForm />
      <UserEmailSettingsForm />
      <PasswordResetForm />
    </div>
  );
};

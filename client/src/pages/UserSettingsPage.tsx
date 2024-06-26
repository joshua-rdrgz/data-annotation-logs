import { BaseUserSettingsForm } from '@/features/user/BaseUserSettingsForm';
import { UserEmailSettingsForm } from '@/features/user/UserEmailSettingsForm';

export const UserSettingsPage = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-24'>
      <BaseUserSettingsForm />
      <UserEmailSettingsForm />
    </div>
  );
};

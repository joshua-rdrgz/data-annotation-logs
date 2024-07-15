import { ComponentLoader } from '@/ui/ComponentLoader';
import { useUser } from './useUser';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import * as F from '@/ui/form';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSettingsFormWrapper } from './UserSettingsFormWrapper';
import { useSendEmailResetToken } from './useSendEmailResetToken';
import { CancelEmailReset } from './CancelEmailReset';
import { useCallback } from 'react';
import { UserEmailSettingsFormTestIds } from './testIds';

const userEmailSettingsSchema = z.object({
  email: z.string().email('Invalid email address.'),
});

type UserEmailSettingsSchema = z.infer<typeof userEmailSettingsSchema>;

export const UserEmailSettingsForm = () => {
  const { data: user, isPending: isUserPending } = useUser();
  const { mutate: sendEmailResetToken, isPending: isEmailResetPending } =
    useSendEmailResetToken();

  const formMethods = useForm<UserEmailSettingsSchema>({
    resolver: zodResolver(userEmailSettingsSchema),
    defaultValues: {
      email: user?.pendingEmailChange ? user.pendingEmail : user?.email || '',
    },
    mode: 'onChange',
  });

  const isFormUnchanged =
    formMethods.watch('email') ===
    (user?.pendingEmailChange ? user.pendingEmail : user?.email);

  const onSubmit = (values: UserEmailSettingsSchema) => {
    sendEmailResetToken(values);
  };

  const handleCancelSuccess = useCallback(() => {
    if (user?.email) {
      formMethods.setValue('email', user.email);
    }
  }, [user?.email, formMethods]);

  if (isUserPending) {
    return <ComponentLoader />;
  }

  return (
    <UserSettingsFormWrapper heading='Change Email'>
      <CancelEmailReset onCancelSuccess={handleCancelSuccess} />
      <F.Root
        formMethods={formMethods}
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <F.Field
          name='email'
          control={formMethods.control}
          render={({ field }) => (
            <F.Item>
              <div className='flex justify-between items-center gap-2.5 flex-wrap'>
                <F.Label>Email</F.Label>
                <F.Message />
              </div>
              <F.Control>
                <Input
                  {...field}
                  disabled={user?.pendingEmailChange}
                  data-testid={UserEmailSettingsFormTestIds.EmailInput}
                />
              </F.Control>
            </F.Item>
          )}
        />
        <Button
          type='submit'
          className='w-full text-center'
          disabled={
            !formMethods.formState.isValid ||
            isFormUnchanged ||
            user?.pendingEmailChange ||
            isEmailResetPending
          }
          data-testid={UserEmailSettingsFormTestIds.UpdateEmailButton}
        >
          {isEmailResetPending ? 'Updating email...' : 'Update Email'}
        </Button>
      </F.Root>
    </UserSettingsFormWrapper>
  );
};

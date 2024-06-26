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

const userEmailSettingsSchema = z.object({
  email: z.string().email('Invalid email address.'),
});

type UserEmailSettingsSchema = z.infer<typeof userEmailSettingsSchema>;

export const UserEmailSettingsForm = () => {
  const { data: user, isPending: isUserPending } = useUser();

  const { mutate: sendEmailResetToken } = useSendEmailResetToken();

  const formMethods = useForm<UserEmailSettingsSchema>({
    resolver: zodResolver(userEmailSettingsSchema),
    defaultValues: {
      email: user?.email || '',
    },
    mode: 'onChange',
  });

  const isFormUnchanged = formMethods.watch('email') === user?.email;

  const onSubmit = (values: UserEmailSettingsSchema) => {
    sendEmailResetToken(values);
  };

  if (isUserPending) {
    return <ComponentLoader />;
  }

  return (
    <UserSettingsFormWrapper heading='Change Email'>
      {user?.pendingEmailChange && (
        <div className='mb-4 p-2 bg-yellow-100 text-yellow-800 rounded'>
          Please verify the new email address{' '}
          {user.pendingEmail && (
            <>
              (<strong>{user.pendingEmail}</strong>)
            </>
          )}{' '}
          before attempting another change.
        </div>
      )}
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
                <Input {...field} disabled={user?.pendingEmailChange} />
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
            user?.pendingEmailChange
          }
        >
          Update Email
        </Button>
      </F.Root>
    </UserSettingsFormWrapper>
  );
};

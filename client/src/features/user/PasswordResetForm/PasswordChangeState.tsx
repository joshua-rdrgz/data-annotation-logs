import { PasswordResetTestIds } from '@/features/user/testIds';
import { useChangePassword } from '@/features/user/useChangePassword';
import { Button } from '@/ui/button';
import * as F from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ChangePasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const PasswordChangeState: React.FC = () => {
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    changePassword({ newPassword: values.newPassword });
  };

  return (
    <F.Root formMethods={form} onSubmit={form.handleSubmit(onSubmit)}>
      <F.Field
        control={form.control}
        name='newPassword'
        render={({ field }) => (
          <F.Item>
            <div className='flex justify-between items-center gap-2.5 flex-wrap'>
              <F.Label>New Password</F.Label>
              <F.Message />
            </div>
            <F.Control>
              <Input
                type='password'
                {...field}
                data-testid={PasswordResetTestIds.NewPasswordInput}
              />
            </F.Control>
          </F.Item>
        )}
      />
      <F.Field
        control={form.control}
        name='confirmPassword'
        render={({ field }) => (
          <F.Item>
            <div className='flex justify-between items-center gap-2.5 flex-wrap'>
              <F.Label>Confirm Password</F.Label>
              <F.Message />
            </div>
            <F.Control>
              <Input
                type='password'
                {...field}
                data-testid={PasswordResetTestIds.ConfirmPasswordInput}
              />
            </F.Control>
          </F.Item>
        )}
      />
      <Button
        type='submit'
        disabled={isPending || !form.formState.isValid}
        className='w-full text-center'
        data-testid={PasswordResetTestIds.ChangePasswordButton}
      >
        {isPending ? 'Changing Password...' : 'Change Password'}
      </Button>
    </F.Root>
  );
};

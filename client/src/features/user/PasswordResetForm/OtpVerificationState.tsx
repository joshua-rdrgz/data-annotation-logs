import { PasswordResetTestIds } from '@/features/user/testIds';
import { useVerifyPasswordResetOtp } from '@/features/user/useVerifyPasswordResetOtp';
import { Button } from '@/ui/button';
import * as F from '@/ui/form';
import * as OTP from '@/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PasswordResetOtpSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

export const OtpVerificationState: React.FC = () => {
  const form = useForm<z.infer<typeof PasswordResetOtpSchema>>({
    resolver: zodResolver(PasswordResetOtpSchema),
    defaultValues: { otp: '' },
    mode: 'onChange',
  });

  const { mutate: verifyPasswordResetOtp, isPending } =
    useVerifyPasswordResetOtp();

  const onSubmit = (values: z.infer<typeof PasswordResetOtpSchema>) => {
    verifyPasswordResetOtp(values);
  };

  const otpInputSatisfied = form.watch('otp').length !== 6;

  return (
    <F.Root
      formMethods={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-5'
    >
      <F.Field
        control={form.control}
        name='otp'
        render={({ field }) => (
          <F.Item>
            <div className='flex justify-between items-center gap-2.5 flex-wrap'>
              <F.Label>Enter OTP sent to your email</F.Label>
              <F.Message />
            </div>
            <F.Control>
              <OTP.Root
                value={field.value}
                onChange={field.onChange}
                maxLength={6}
                data-testid={PasswordResetTestIds.OtpInput}
              >
                <OTP.Group className='gap-2'>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <React.Fragment key={index}>
                      <OTP.Slot
                        index={index}
                        className='w-10 h-10 border rounded'
                      />
                      {index !== 5 && <OTP.Separator />}
                    </React.Fragment>
                  ))}
                </OTP.Group>
              </OTP.Root>
            </F.Control>
          </F.Item>
        )}
      />
      <Button
        type='submit'
        disabled={otpInputSatisfied || isPending}
        className='w-full text-center'
        data-testid={PasswordResetTestIds.OtpVerifyButton}
      >
        {isPending ? 'Verifying OTP...' : 'Verify OTP'}
      </Button>
    </F.Root>
  );
};

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as C from '@/ui/card';
import * as F from '@/ui/form';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { useResendVerification } from '@/features/auth/hooks/useResendVerification';

const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;

const ResendVerificationPage = () => {
  const methods = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const { mutate: resendVerification, isPending } = useResendVerification();

  const onSubmit = (data: ResendVerificationFormData) => {
    resendVerification(data.email);
  };

  return (
    <div className='flex h-screen justify-center items-center'>
      <C.Root className='max-w-[400px] w-full'>
        <C.Header>
          <C.Title>Resend Verification Email</C.Title>
          <C.Description>
            Enter your email address to receive a new verification email.
          </C.Description>
        </C.Header>
        <C.Content>
          <F.Root
            id='resend-verification-form'
            formMethods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <F.Field
              control={methods.control}
              name='email'
              render={({ field }) => (
                <F.Item>
                  <div className='flex justify-between items-center flex-wrap'>
                    <F.Label>Email Address</F.Label>
                    <F.Message />
                  </div>
                  <F.Control>
                    <Input
                      type='email'
                      placeholder='example@example.com'
                      {...field}
                    />
                  </F.Control>
                </F.Item>
              )}
            />
          </F.Root>
        </C.Content>
        <C.Footer>
          <Button
            type='submit'
            form='resend-verification-form'
            disabled={isPending || !methods.formState.isValid}
            wrapperClassName='w-full'
            className='w-full'
          >
            {isPending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </C.Footer>
      </C.Root>
    </div>
  );
};

export { ResendVerificationPage };

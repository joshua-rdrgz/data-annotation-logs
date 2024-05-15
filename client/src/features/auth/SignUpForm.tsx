import { useSignUp } from '@/features/auth/hooks/useSignUp';
import { Button } from '@/ui/button';
import * as C from '@/ui/card';
import * as F from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const FIELDS = [
  {
    name: 'firstName' as const,
    label: 'First Name',
    type: 'text',
    placeholder: 'John',
  },
  {
    name: 'lastName' as const,
    label: 'Last Name',
    type: 'text',
    placeholder: 'Doe',
  },
  {
    name: 'email' as const,
    label: 'Email',
    type: 'email',
    placeholder: 'johndoe@example.com',
  },
  {
    name: 'password' as const,
    label: 'Password',
    type: 'password',
    placeholder: '********',
  },
];

export const SignUpForm = () => {
  const { mutate: signUp, isPending: isSigningUp } = useSignUp();

  const formMethods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: SignUpFormData) => {
    signUp(data);
  };

  return (
    <C.Root className='max-w-[400px] w-full'>
      <C.Header>
        <C.Title>Sign Up</C.Title>
        <C.Description>Create your account</C.Description>
      </C.Header>
      <C.Content>
        <F.Root
          id='sign-up-form'
          formMethods={formMethods}
          onSubmit={formMethods.handleSubmit(onSubmit)}
        >
          {FIELDS.map((formField) => (
            <F.Field
              key={formField.name}
              name={formField.name}
              control={formMethods.control}
              render={({ field }) => (
                <F.Item>
                  <div className='flex justify-between items-center flex-wrap'>
                    <F.Label>{formField.label}</F.Label>
                    <F.Message />
                  </div>
                  <F.Control>
                    <Input
                      type={formField.type}
                      placeholder={formField.placeholder}
                      disabled={isSigningUp}
                      {...field}
                    />
                  </F.Control>
                </F.Item>
              )}
            />
          ))}
        </F.Root>
      </C.Content>
      <C.Footer>
        <Button
          type='submit'
          form='sign-up-form'
          className='w-full'
          wrapperClassName='w-full'
          disabled={isSigningUp || !formMethods.formState.isValid}
        >
          {isSigningUp ? 'Signing up....' : 'Sign Up'}
        </Button>
      </C.Footer>
    </C.Root>
  );
};

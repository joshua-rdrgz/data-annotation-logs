import { useLogin } from '@/features/auth/hooks/useLogin';
import { Button } from '@/ui/button';
import * as C from '@/ui/card';
import * as F from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const FIELDS = [
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

export const LoginForm = () => {
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const formMethods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <C.Root className='max-w-[400px] w-full'>
      <C.Header>
        <C.Title>Log In</C.Title>
        <C.Description>Welcome back!</C.Description>
      </C.Header>
      <C.Content>
        <F.Root
          id='login-form'
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
                      disabled={isLoggingIn}
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
          form='login-form'
          className='w-full'
          wrapperClassName='w-full'
          disabled={isLoggingIn || !formMethods.formState.isValid}
        >
          {isLoggingIn ? 'Logging in....' : 'Log In'}
        </Button>
      </C.Footer>
    </C.Root>
  );
};

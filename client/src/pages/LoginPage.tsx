import { LoginForm } from '@/features/auth/LoginForm';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center gap-2'>
      <LoginForm />
      <p className='text-muted-foreground mt-2 text-center text-sm'>
        Don't have an account?{' '}
        <Link
          to='/signup'
          className='text-blue-500 underline hover:text-blue-700'
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
};

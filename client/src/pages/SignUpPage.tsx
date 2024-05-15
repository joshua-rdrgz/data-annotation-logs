import { SignUpForm } from '@/features/auth/SignUpForm';
import { Link } from 'react-router-dom';

export const SignUpPage = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center gap-2'>
      <SignUpForm />
      <p className='text-muted-foreground mt-2 text-center text-sm'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='text-blue-500 underline hover:text-blue-700'
        >
          Log in here
        </Link>
      </p>
    </div>
  );
};

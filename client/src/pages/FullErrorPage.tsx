import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '@/ui/button';

export const FullErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  return (
    <section className='flex flex-col gap-5 justify-center items-center h-screen'>
      <h1 className='text-5xl font-bold'>Uh oh, something went wrong! 😢</h1>
      <div className='text-2xl'>{error.message}</div>
      <Button onClick={() => navigate(-1)}>Go back</Button>
    </section>
  );
};

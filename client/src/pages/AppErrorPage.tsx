import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '../ui/button';

export const AppErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  return (
    <section className='flex flex-col gap-5 justify-center items-center h-[80vh]'>
      <h1 className='text-4xl font-bold'>Uh oh, something went wrong! 😢</h1>
      <div className='text-xl'>{error.message}</div>
      <Button onClick={() => navigate(-1)}>Go back</Button>
    </section>
  );
};

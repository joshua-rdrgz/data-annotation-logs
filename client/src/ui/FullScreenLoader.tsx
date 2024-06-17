import { PacmanLoader } from 'react-spinners';

export const FullScreenLoader = () => {
  return (
    <div className='min-h-screen min-w-full flex justify-center items-center'>
      <PacmanLoader size={50} />
    </div>
  );
};

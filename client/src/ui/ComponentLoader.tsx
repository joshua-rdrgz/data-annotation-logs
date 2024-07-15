import { PacmanLoader } from 'react-spinners';

export const ComponentLoader = () => {
  return (
    <div className='flex justify-center items-center p-32'>
      <PacmanLoader size={35} />
    </div>
  );
};

import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/features/user/useUser';
import { ClientRoutes } from '@/config/router';
import { FullScreenLoader } from '@/ui/FullScreenLoader';

export const PrivateRoute = () => {
  const { data: user, isPending: isUserPending } = useUser();

  if (isUserPending) {
    return <FullScreenLoader />;
  }

  return user ? <Outlet /> : <Navigate to={ClientRoutes.LOGIN} />;
};

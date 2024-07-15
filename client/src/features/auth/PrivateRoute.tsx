import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/features/user/useUser';
import { ClientRoutes } from '@/config/router';
import { FullScreenLoader } from '@/ui/FullScreenLoader';

export const PrivateRoute = () => {
  const {
    data: user,
    isPending: isUserPending,
    isError: isErrorGettingUser,
    error: userError,
  } = useUser();

  if (isUserPending) {
    return <FullScreenLoader />;
  }

  if (isErrorGettingUser) {
    if (userError.status && userError.status >= 500)
      throw new Error(userError.response?.data.message);
  }

  return user ? <Outlet /> : <Navigate to={ClientRoutes.LOGIN} />;
};

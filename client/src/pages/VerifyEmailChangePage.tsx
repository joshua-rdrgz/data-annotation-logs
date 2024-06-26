import { useVerifyNewEmail } from '@/features/user/useVerifyNewEmail';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ClientRoutes } from '@/config/router';
import { FullScreenLoader } from '@/ui/FullScreenLoader';

export const VerifyEmailChangePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    mutate: verifyEmailChange,
    isPending,
    isError,
    error,
  } = useVerifyNewEmail();
  const { mutate: logoutUser } = useLogout();

  // Prevents Development Environment from making duplicate requests
  const [hasRan, setHasRan] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      throw new Error('Missing information.');
    }

    if (!hasRan) {
      setHasRan(true);
    }

    if (hasRan) {
      verifyEmailChange(
        { token, userId },
        {
          onSuccess: () => {
            logoutUser(
              { showSuccessToast: false },
              {
                onSuccess: () => {
                  navigate(ClientRoutes.LOGIN);
                },
              },
            );
          },
        },
      );
    }
  }, [searchParams, verifyEmailChange, logoutUser, navigate, hasRan]);

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (isError) {
    throw new Error(error.response?.data.message);
  }

  return null;
};

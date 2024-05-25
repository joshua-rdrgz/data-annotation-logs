import { useVerifyUser } from '@/features/auth/hooks/useVerifyUser';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const { mutate: verifyUser } = useVerifyUser();
  const [hasRan, setHasRan] = useState(false);

  useEffect(() => {
    if (!token || !userId) {
      toast.error('Invalid verification link.');
      navigate('/resend-verification', { replace: true });
      return;
    }

    if (!hasRan) {
      setHasRan(true);
    }

    if (hasRan) {
      verifyUser(
        { token, userId },
        {
          onSuccess: () => {
            toast.success('Account verified successfully.');
            navigate('/login', { replace: true });
          },
          onError: () => {
            toast.error('Failed to verify account.');
            navigate('/resend-verification', { replace: true });
          },
        }
      );
    }
  }, [verifyUser, token, userId, navigate, hasRan]);

  return null;
};

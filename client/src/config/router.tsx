import { LoginPage } from '@/pages/LoginPage';
import { ResendVerificationPage } from '@/pages/ResendVerificationPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { SignUpSuccessPage } from '@/pages/SignUpSuccessPage';
import { VerifyPage } from '@/pages/VerifyPage';
import { RouteObject, redirect } from 'react-router-dom';

export const routerConfig: RouteObject[] = [
  {
    index: true,
    loader: () => redirect('/login'),
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/signup-success',
    element: <SignUpSuccessPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <div>dashboard, you made it!</div>,
  },
  {
    path: '/verify',
    element: <VerifyPage />,
  },
  {
    path: '/resend-verification',
    element: <ResendVerificationPage />,
  },
];

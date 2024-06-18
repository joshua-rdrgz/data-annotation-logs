import { PrivateRoute } from '@/features/auth/PrivateRoute';
import { DashboardLayout } from '@/features/dashboard/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { ResendVerificationPage } from '@/pages/ResendVerificationPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { SignUpSuccessPage } from '@/pages/SignUpSuccessPage';
import { VerifyPage } from '@/pages/VerifyPage';
import { RouteObject, redirect } from 'react-router-dom';

export enum ClientRoutes {
  SIGNUP = '/signup',
  LOGIN = '/login',
  SIGNUP_SUCCESS = '/signup-success',
  VERIFY = '/verify',
  RESEND_VERIFICATION = '/resend-verification',
  DASHBOARD = '/app/dashboard',
  CURRENT_SESSION = '/app/current-session',
  MY_SESSIONS = '/app/my-sessions',
}

export const routerConfig: RouteObject[] = [
  {
    index: true,
    loader: () => redirect('/login'),
  },
  {
    path: ClientRoutes.SIGNUP,
    element: <SignUpPage />,
  },
  {
    path: ClientRoutes.SIGNUP_SUCCESS,
    element: <SignUpSuccessPage />,
  },
  {
    path: ClientRoutes.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ClientRoutes.VERIFY,
    element: <VerifyPage />,
  },
  {
    path: ClientRoutes.RESEND_VERIFICATION,
    element: <ResendVerificationPage />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/app',
        element: <DashboardLayout />,
        children: [
          {
            path: 'dashboard',
            element: <div>dashboard, you made it!</div>,
          },
          {
            path: 'current-session',
            element: <div>Current Session Page</div>,
          },
          {
            path: 'my-sessions',
            element: <div>My Sessions Page</div>,
          },
        ],
      },
    ],
  },
];

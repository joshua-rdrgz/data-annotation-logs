import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
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
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <div>dashboard, you made it!</div>,
  },
];

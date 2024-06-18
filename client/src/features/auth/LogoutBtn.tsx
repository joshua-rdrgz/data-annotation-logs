import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button } from '@/ui/button';
import { LogOut } from 'lucide-react';

export const LogoutBtn = () => {
  const { mutate: logout } = useLogout();

  return (
    <Button variant='outline' size='icon' onClick={() => logout()}>
      <LogOut className='h-[1.2rem] w-[1.2rem]' />
    </Button>
  );
};

import { queryClient } from '@/config/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/config/theme-provider';

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-center' reverseOrder={false} />
      <ThemeProvider>{children}</ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

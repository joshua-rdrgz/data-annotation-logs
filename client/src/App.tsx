import { Providers } from '@/config/Providers';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routerConfig } from '@/config/router';

const router = createBrowserRouter(routerConfig);

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;

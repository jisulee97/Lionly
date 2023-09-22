import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider, ChannelProvider, ContentProvider } from './contexts';
import router from './routes.jsx';
import { Suspense } from 'react';
import Spinner from './components/Spinner';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ChannelProvider>
              <ContentProvider>
                <AnimatePresence>
                  <div className="App">
                    <Suspense
                      fallback={
                        <>
                          <Spinner size={300} />
                          <p
                            role="status"
                            className="text-center text-lionly-lg text-lionly-red"
                          >
                            페이지를 불러오는 중입니다.
                          </p>
                        </>
                      }
                    >
                      <RouterProvider router={router} />
                    </Suspense>
                  </div>
                </AnimatePresence>
              </ContentProvider>
            </ChannelProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
      <Toaster />
    </>
  );
}

export default App;

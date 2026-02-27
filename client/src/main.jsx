import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../src/Store.js';
import DataLoading from './components/DataLoading/DataLoading.jsx';
import { AuthProvider } from './Context/AuthProvider.jsx';
import { HeaderFooterProvider } from './Context/HeaderFooter.jsx';
import './index.css';
const App = lazy(() => import('./App.jsx'));
createRoot(document.getElementById('root')).render(
  <HeaderFooterProvider>
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className='h-screen w-screen flex justify-center items-center'>
                <DataLoading />
              </div>
            }
          >
            <App />
          </Suspense>
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  </HeaderFooterProvider>
);

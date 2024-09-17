import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { theme } from './Theme';
import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { store ,persistor} from "./store";
import AppContextProvider from './context.js';
import { PersistGate } from 'redux-persist/integration/react';
import { initializeAuth } from '../src/features/users/users.js';


store.dispatch(initializeAuth());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </ThemeProvider>
    </Provider>
  </React.StrictMode>
);


reportWebVitals();

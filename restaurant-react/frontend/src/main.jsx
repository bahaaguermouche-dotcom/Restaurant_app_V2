import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';

import ErrorBoundary from './components/ErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ErrorBoundary>
                <NotificationProvider>
                    <AuthProvider>
                        <SocketProvider>
                            <App />
                        </SocketProvider>
                    </AuthProvider>
                </NotificationProvider>
            </ErrorBoundary>
        </BrowserRouter>
    </React.StrictMode>
);

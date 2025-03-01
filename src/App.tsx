import React, {StrictMode} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router';

import {Toaster} from 'sonner'

import {AuthProvider} from './context/AuthContext';
import {BreadcrumbProvider} from './context/BreadcrumbsContext';
import {IndexPage} from './pages/IndexPage';
import {LoginPage} from './pages/LoginPage';

import './App.scss';


function App() {
    return (
        <StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <BreadcrumbProvider>
                        <Toaster/>
                        <Routes>
                            <Route path='/login' element={<LoginPage/>}/>
                            <Route path='/*' element={<IndexPage/>}/>
                        </Routes>
                    </BreadcrumbProvider>
                </AuthProvider>
            </BrowserRouter>
        </StrictMode>
    );
}

export default App;

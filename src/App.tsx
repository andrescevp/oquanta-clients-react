import React, { StrictMode } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import { AuthProviderWithRouter } from './context/AuthContext';
import { BreadcrumbProvider } from './context/BreadcrumbsContext';
import { LocationProvider } from './context/LocationContext';
import { PermissionProvider } from './context/PermissionContext';
import { SidebarProvider } from './context/SidebarContext'; // Añadir esta importación
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import OrganizationsPage from './pages/admin/OrganizationsPage';
import UsersPage from './pages/admin/UsersPage';
import OrganizationPage from './pages/client/OrganizationPage';
import { LoginPage } from './pages/LoginPage';

import './App.scss';

const App = () => {
  return (
    <StrictMode>
      <Router>
        <AuthProviderWithRouter>
          <PermissionProvider>
            <SidebarProvider> {/* Añadir el SidebarProvider aquí */}
              <BreadcrumbProvider>
                <LocationProvider>
                  <Toaster />
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Rutas Admin */}
                    <Route
                      path="/admin"
                      element={
                        <AdminLayout />
                      }
                    >
                      <Route index element={<Navigate to="/admin/dashboard" />} />
                      <Route path="users" element={<UsersPage />} />
                      <Route path="organizations" element={<OrganizationsPage />} />
                      {/* Más rutas admin */}
                    </Route>

                    {/* Rutas Client */}
                    <Route
                      path="/client"
                      element={
                        <ClientLayout />
                      }
                    >
                      <Route index element={<Navigate to="/client/dashboard" />} />
                      <Route path="organization" element={<OrganizationPage />} />
                      {/* Más rutas client */}
                    </Route>

                    <Route path="/" element={<Navigate to="/client" />} />
                  </Routes>
                </LocationProvider>
              </BreadcrumbProvider>
            </SidebarProvider>
          </PermissionProvider>
        </AuthProviderWithRouter>
      </Router>
    </StrictMode>
  );
};

export default App;

import React, { StrictMode } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { Toaster } from 'sonner';

import { AuthProviderWithRouter } from './context/AuthContext';
import { BreadcrumbProvider } from './context/BreadcrumbsContext';
import { LocationProvider } from './context/LocationContext';
import { PermissionProvider } from './context/PermissionContext';
import { SidebarProvider } from './context/SidebarContext';
import { UserMenuProvider } from './context/UserMenuContext'; // Añadir esta importación
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import OrganizationPlacesPage from './pages/admin/OrganizationPlacesPage';
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
            <SidebarProvider>
              <UserMenuProvider> {/* Añadir el UserMenuProvider aquí */}
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
                        <Route path="local-business" element={<OrganizationPlacesPage />} />
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
              </UserMenuProvider>
            </SidebarProvider>
          </PermissionProvider>
        </AuthProviderWithRouter>
      </Router>
    </StrictMode>
  );
};

export default App;

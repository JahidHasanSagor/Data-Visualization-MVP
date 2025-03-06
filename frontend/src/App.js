import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ApiProvider } from './contexts/ApiContext';
import { UIProvider } from './contexts/UIContext';
import ToastContainer from './components/ui/ToastContainer';
import Skeleton from './components/ui/Skeleton';

// Lazy load components
const LandingPage = lazy(() => import('./components/landing/LandingPage'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const FileUpload = lazy(() => import('./components/dashboard/FileUpload'));
const Profile = lazy(() => import('./components/dashboard/Profile'));
const Settings = lazy(() => import('./components/dashboard/Settings'));
const SavedDashboards = lazy(() => import('./components/SavedDashboards'));
const Analysis = lazy(() => import('./components/Analysis'));
const Analytics = lazy(() => import('./components/Analytics'));
const IntegrationDashboard = lazy(() => import('./components/integration/IntegrationDashboard'));
const IntegratedDashboard = lazy(() => import('./components/dashboard/IntegratedDashboard'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8">
      <Skeleton type="title" className="mb-4" />
      <Skeleton count={3} className="mb-2" />
      <Skeleton type="button" className="mt-4" />
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  if (!currentUser) {
    // Store the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Public Route component - redirects to dashboard if user is logged in
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // If user is logged in, redirect to dashboard or the page they were trying to access
  if (currentUser) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <ApiProvider>
            <ToastContainer />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                
                {/* Protected routes */}
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <FileUpload />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/integrated-dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <IntegratedDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/integration-dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <IntegrationDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/saved-dashboards" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SavedDashboards />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/analysis" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Analysis />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Analytics />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/integrations" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <IntegrationDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ApiProvider>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
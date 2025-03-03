import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import FileUpload from "./components/dashboard/FileUpload";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/dashboard/Profile';
import Settings from './components/dashboard/Settings';
import SavedDashboards from './components/SavedDashboards';
import Analysis from './components/Analysis';
import LandingPage from './components/landing/LandingPage';

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
const PublicRoute = ({ children, redirectToDashboard = true }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  if (currentUser && redirectToDashboard) {
    // Get the stored location or default to dashboard
    const to = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={to} />;
  }
  
  return children;
};

function App() {
  const [uploadedData, setUploadedData] = useState(null);

  const DashboardWithLayout = ({ children }) => (
    <DashboardLayout>
      <Dashboard uploadedData={uploadedData} />
      {children}
    </DashboardLayout>
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/upload" element={
            <ProtectedRoute>
              <DashboardLayout>
                <FileUpload setUploadedData={setUploadedData} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard uploadedData={uploadedData} />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/preset-widget" element={
            <ProtectedRoute>
              <DashboardWithLayout>
                {/* Add Preset Widget specific content here */}
              </DashboardWithLayout>
            </ProtectedRoute>
          } />
          <Route path="/custom-widget" element={
            <ProtectedRoute>
              <DashboardWithLayout>
                {/* Add Custom Widget specific content here */}
              </DashboardWithLayout>
            </ProtectedRoute>
          } />
          <Route path="/static-widget" element={
            <ProtectedRoute>
              <DashboardWithLayout>
                {/* Add Static Widget specific content here */}
              </DashboardWithLayout>
            </ProtectedRoute>
          } />
          <Route path="/widget-bundle" element={
            <ProtectedRoute>
              <DashboardWithLayout>
                {/* Add Widget Bundle specific content here */}
              </DashboardWithLayout>
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
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CreateBug from './components/CreateBug';
import BugDetails from './components/BugDetails';
import AllBugs from './pages/AllBugs';
import MyBugs from './pages/MyBugs';
import AssignedBugs from './pages/AssignedBugs';
import UnassignedBugs from './pages/UnassignedBugs';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const DeveloperRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'Developer') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AllBugs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bugs"
          element={
            <ProtectedRoute>
              <MyBugs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assigned-bugs"
          element={
            <DeveloperRoute>
              <AssignedBugs />
            </DeveloperRoute>
          }
        />
        <Route
          path="/unassigned-bugs"
          element={
            <DeveloperRoute>
              <UnassignedBugs />
            </DeveloperRoute>
          }
        />
        <Route
          path="/create-bug"
          element={
            <ProtectedRoute>
              <CreateBug />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bugs/:id"
          element={
            <ProtectedRoute>
              <BugDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;

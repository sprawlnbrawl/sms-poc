import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Layout
import MainLayout from "../components/layout/MainLayout";

// Pages
const LoginPage = React.lazy(() => import("../pages/auth/LoginPage"));
const ExplorePage = React.lazy(() => import("../pages/explore/ExplorePage"));
const Schoolcrud = React.lazy(() => import("../pages/school/Schoolcrud"));
const AttendenceRecording = React.lazy(() => import("../pages/teacher/Attendancerecording"));

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/explore" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Navigate to="/explore" replace />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExplorePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExplorePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Schoolcrud />
              </MainLayout>
            </ProtectedRoute>
          }
        />
<Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AttendenceRecording />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;

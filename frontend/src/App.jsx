import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { isLoggedIn, getRole } from './utils/auth';
import './App.css';

function App() {
  const isAuthenticated = isLoggedIn();
  const userRole = getRole();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer/*"
          element={
            <ProtectedRoute allowedRoles={['TRAINER']}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default route redirecting to login or appropriate dashboard */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              userRole === 'ADMIN' ? (
                <Navigate to="/admin" replace />
              ) : userRole === 'TRAINER' ? (
                <Navigate to="/trainer" replace />
              ) : (
                <Navigate to="/client" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

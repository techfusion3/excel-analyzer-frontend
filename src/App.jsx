import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnalyticsHub from './pages/AnalyticsHub';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import Upload from './pages/Upload';
import DataAnalysis from './pages/DataAnalysis';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes without navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes with navbar */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics-hub" element={<AnalyticsHub />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/analysis" element={<DataAnalysis />} />
            <Route path="/analysis/:fileId" element={<DataAnalysis />} />
            <Route path="/reports" element={<Navigate to="/analytics-hub" replace />} />
            <Route path="/insights" element={<Navigate to="/analytics-hub" replace />} />
            <Route path="/activity" element={<Navigate to="/analytics-hub" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

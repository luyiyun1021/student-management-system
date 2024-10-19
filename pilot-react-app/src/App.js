import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataOverview from './components/DataOverview';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import ImportExport from './components/ImportExport';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { Navbar } from './components/Navbar'; // 导入导航栏

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth'));

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {/* 将 isAuthenticated 传递给 Navbar */}
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><DataOverview /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
          <Route path="/students/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
          <Route path="/import-export" element={<ProtectedRoute><ImportExport /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

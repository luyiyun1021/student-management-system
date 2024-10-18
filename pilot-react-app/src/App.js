import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataOverview from './components/DataOverview';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import ImportExport from './components/ImportExport';
import { Navbar } from './components/Navbar'; // 导入Navbar组件

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar /> {/* 使用新的 Navbar */}
        <Routes>
          <Route path="/" element={<DataOverview />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/import-export" element={<ImportExport />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

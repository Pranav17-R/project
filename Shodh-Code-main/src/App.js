import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import AddProblem from './pages/AddProblem';
import Progress from './pages/Progress';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="app-content">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/add-problem" element={<AddProblem />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App; 
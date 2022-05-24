import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Register from './components/user/RegistrationPage';
import Login from './components/user/LoginPage';
import TaskBoard from './components/task/TaskBoard'

export default function App() {
  return (
    <div className="app">
    <Router>
      <div>
        {/* <Header /> */}
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route exact path='/' element={<Login />} />
          <Route path='/board' element={<TaskBoard />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

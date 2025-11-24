import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddSubscription from './pages/AddSubscription';
import MyCards from './pages/MyCards';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  // 시작하자마자 로컬 스토리지 확인해서 로그인 상태 설정
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_id'));

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setIsLoggedIn(!!userId);
  }, []);

  // [NEW] 로그아웃 함수
  const handleLogout = () => {
    // 1. 브라우저 저장소 비우기
    localStorage.removeItem('user_id');
    localStorage.removeItem('nickname');
    
    // 2. 상태 변경 (화면이 로그인 페이지로 바뀜)
    setIsLoggedIn(false);
    
    alert("로그아웃 되었습니다 👋");
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          // [핵심] Dashboard에 로그아웃 함수(onLogout)를 전달해줍니다!
          element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={<Login setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/signup" 
          element={<Signup />} 
        />
        <Route 
          path="/add" 
          element={isLoggedIn ? <AddSubscription /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/my-cards" 
          element={isLoggedIn ? <MyCards /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
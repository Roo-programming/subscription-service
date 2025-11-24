import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      
      if (res.data.result === 'success') {
        const user = res.data.user;
        alert(`${user.nickname}님 환영합니다!`);
        
        // 유저 정보 저장
        localStorage.setItem('user_id', user.user_id);
        localStorage.setItem('nickname', user.nickname);
        
        setIsLoggedIn(true);
        navigate('/'); 
      }
    } catch (error) {
      alert("로그인 실패! 아이디/비번을 확인하세요.");
    }
  };

  return (
    <div className="app-container" style={{textAlign: 'center', paddingTop: '100px'}}>
      <h2>구독 관리 서비스 🔐</h2>
      <p>로그인을 해주세요</p>
      
      <form onSubmit={handleLogin} className="form-container" style={{maxWidth: '300px', margin: '0 auto'}}>
        <input 
          type="email" 
          placeholder="이메일 (minsu@test.com)" 
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="비밀번호 (1234)" 
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="primary-btn">로그인</button>
        <div style={{marginTop: '20px', fontSize: '14px'}}>
            계정이 없으신가요? <br/>
            <span 
                onClick={() => navigate('/signup')} 
                style={{color: '#667eea', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline'}}
            >
                회원가입 하러가기
            </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', formData);
      alert("회원가입 성공! 로그인해주세요.");
      navigate('/login'); // 로그인 화면으로 이동
    } catch (error) {
      // 서버에서 보낸 에러 메시지 표시
      const msg = error.response?.data?.message || "회원가입 실패";
      alert(msg);
    }
  };

  return (
    <div className="app-container" style={{textAlign: 'center', paddingTop: '50px'}}>
      <h2>회원가입 📝</h2>
      <p>나만의 구독 리스트를 만들어보세요</p>
      
      <form onSubmit={handleSignup} className="form-container" style={{maxWidth: '300px', margin: '0 auto'}}>
        <label style={{textAlign:'left'}}>이메일</label>
        <input 
          type="email" name="email"
          placeholder="example@mail.com" 
          className="input-field"
          onChange={handleChange} required
        />

        <label style={{textAlign:'left'}}>비밀번호</label>
        <input 
          type="password" name="password"
          placeholder="비밀번호" 
          className="input-field"
          onChange={handleChange} required
        />

        <label style={{textAlign:'left'}}>닉네임</label>
        <input 
          type="text" name="nickname"
          placeholder="사용할 별명" 
          className="input-field"
          onChange={handleChange} required
        />

        <button type="submit" className="primary-btn">가입하기</button>
        <button type="button" className="back-btn" onClick={() => navigate('/login')}>취소</button>
      </form>
    </div>
  );
}

export default Signup;
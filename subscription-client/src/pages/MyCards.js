import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function MyCards() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');
  
  const [cards, setCards] = useState([]);
  const [newCardName, setNewCardName] = useState('');

  // 내 카드 목록 불러오기
  const fetchCards = async () => {
    try {
      const res = await api.get('/payment-methods', { params: { user_id: userId } });
      setCards(res.data);
    } catch (err) {
      console.error("카드 목록 로딩 실패", err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // 카드 추가하기
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCardName.trim()) return;

    try {
      await api.post('/payment-methods', {
        user_id: userId,
        method_name: newCardName
      });
      setNewCardName(''); // 입력창 비우기
      fetchCards(); // 목록 새로고침
      alert("카드가 추가되었습니다!");
    } catch (err) {
      alert("추가 실패");
    }
  };

  // 카드 삭제하기
  const handleDelete = async (id) => {
    if (window.confirm("이 결제 수단을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/payment-methods/${id}`);
        fetchCards();
      } catch (err) {
        // 백엔드에서 400 에러(사용 중인 카드)를 보내면 여기서 잡힘
        alert(err.response?.data?.message || "삭제 실패");
      }
    }
  };

  return (
    <div className="app-container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-btn">← 뒤로</button>
        <h2>💳 결제 수단 관리</h2>
      </header>

      {/* 카드 추가 폼 */}
      <form onSubmit={handleAdd} className="form-container" style={{marginBottom: '20px'}}>
        <label>새 결제 수단 이름</label>
        <div style={{display: 'flex', gap: '10px'}}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="예: 내 카카오카드"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
              required
            />
            <button type="submit" className="primary-btn" style={{marginTop:0, width:'100px'}}>추가</button>
        </div>
      </form>

      {/* 카드 목록 */}
      <div className="card-container">
        <h3>등록된 결제 수단 ({cards.length})</h3>
        {cards.map((card) => (
          <div key={card.method_id} className="sub-card">
            <div style={{display:'flex', alignItems:'center'}}>
                <span style={{fontSize:'24px', marginRight:'10px'}}>💳</span>
                <span style={{fontWeight:'bold', color:'#333'}}>{card.method_name}</span>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(card.method_id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCards;
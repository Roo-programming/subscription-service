import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

// [수정] App.js에서 보낸 onLogout 함수를 받습니다.
function Dashboard({ onLogout }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const userId = localStorage.getItem('user_id');
  const nickname = localStorage.getItem('nickname'); 

  const fetchSubscriptions = async () => {
    if (!userId) return;
    try {
      const response = await api.get('/subscriptions', {
        params: { user_id: userId }
      });
      setSubscriptions(response.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await api.delete(`/subscriptions/${id}`);
        fetchSubscriptions();
      } catch (error) {
        alert("삭제 실패");
      }
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const totalCost = subscriptions.reduce((acc, sub) => acc + sub.real_price, 0);

  return (
    <div className="app-container">
      {/* [NEW] 상단 헤더 영역 (로그아웃 버튼 추가) */}
      <div style={{display: 'flex', justifyContent: 'flex-end', padding: '10px 0'}}>
        <button onClick={onLogout} className="logout-btn">
          로그아웃 🚪
        </button>
      </div>

      <header className="dashboard-header">
        <h1>{nickname}님의 구독 리스트</h1>
        <div className="total-cost-card">
          <span>이번 달 총 지출</span>
          <strong className="cost-highlight">{totalCost.toLocaleString()}원</strong>
        </div>
      </header>

      <main className="subscription-list">
        <div className="list-header">
          <h2>구독 목록 ({subscriptions.length})</h2>
          
          <div style={{display: 'flex', gap: '10px'}}>
              <Link to="/my-cards" className="add-link-btn" style={{backgroundColor: '#6c757d'}}>
                💳 카드 관리
              </Link>
              <Link to="/add" className="add-link-btn">
                + 구독 추가
              </Link>
          </div>
        </div>

        <div className="card-container">
          {subscriptions.map((sub) => (
            <div key={sub.subscription_id} className="sub-card">
              <div className="sub-icon">
                {sub.logo_url ? (
                  <img src={sub.logo_url} alt={sub.service_name} className="service-logo-img" />
                ) : (
                  <span>{sub.service_name.charAt(0)}</span>
                )}
              </div>
              
              <div className="sub-info">
                <h3>{sub.service_name}</h3>
                <span className="sub-plan">{sub.plan_name}</span>
                <p className="sub-method">💳 {sub.method_name}</p>
                {sub.memo && <p style={{fontSize: '12px', color: '#888'}}>📝 {sub.memo}</p>}
              </div>

              <div className="sub-billing">
                <span className="billing-date">매월 {sub.billing_day}일</span>
                <strong className="sub-price">{sub.real_price.toLocaleString()}원</strong>
              </div>
              
              <button className="delete-btn" onClick={() => handleDelete(sub.subscription_id)}>🗑️</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
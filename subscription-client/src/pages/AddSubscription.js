import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AddSubscription() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');
  
  const [options, setOptions] = useState({ services: [], plans: [], methods: [] });
  const [formData, setFormData] = useState({
    service_id: '', plan_id: '', method_id: '', billing_day: '', real_price: '', memo: ''
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/options', { params: { user_id: userId } });
        setOptions(res.data);
      } catch (err) { console.error("옵션 로딩 실패", err); }
    };
    fetchOptions();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subscriptions', { ...formData, user_id: userId });
      alert("등록되었습니다!");
      navigate('/');
    } catch (error) {
      alert("등록 실패");
    }
  };

  const filteredPlans = options.plans.filter(
    plan => plan.service_id === parseInt(formData.service_id)
  );

  return (
    <div className="app-container">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-btn">← 뒤로</button>
        <h2>새 구독 추가</h2>
      </header>

      <form className="form-container" onSubmit={handleSubmit}>
        <label>서비스 선택</label>
        <select name="service_id" className="input-field" onChange={handleChange} required>
          <option value="">서비스를 선택하세요</option>
          {options.services.map(s => (
            <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
          ))}
        </select>

        <label>요금제 선택</label>
        <select name="plan_id" className="input-field" onChange={handleChange} required>
          <option value="">요금제를 선택하세요</option>
          {filteredPlans.map(p => (
            <option key={p.plan_id} value={p.plan_id}>{p.plan_name} ({p.base_price}원)</option>
          ))}
        </select>

        <label>결제 수단</label>
        <select name="method_id" className="input-field" onChange={handleChange} required>
          <option value="">카드를 선택하세요</option>
          {options.methods.map(m => (
            <option key={m.method_id} value={m.method_id}>{m.method_name}</option>
          ))}
        </select>

        <div className="row-group">
          <div>
            <label>매월 결제일</label>
            <input type="number" name="billing_day" className="input-field" placeholder="예: 25" min="1" max="31" onChange={handleChange} required />
          </div>
          <div>
            <label>실제 납부액</label>
            <input type="number" name="real_price" className="input-field" placeholder="예: 17000" onChange={handleChange} required />
          </div>
        </div>

        <label>메모 (선택)</label>
        <input type="text" name="memo" className="input-field" placeholder="예: 가족 공유" onChange={handleChange} />

        <button type="submit" className="primary-btn">저장하기</button>
      </form>
    </div>
  );
}

export default AddSubscription;
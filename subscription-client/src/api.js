import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Flask 서버 주소 예정
});

export default api;
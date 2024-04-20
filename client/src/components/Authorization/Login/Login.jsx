import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, setAuthToken } from '../../../services/api';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('login/', {
        email,
        password,
      });

      const accessToken = response.data.access;
      setAuthToken(accessToken);

      localStorage.setItem('accessToken', accessToken);

      // Redirect to /chat page using window.location.replace
      window.location.replace('/');

      console.log('Login successful. Access token:', accessToken);
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <div className="container">
      <div className="card login-form">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Электронная почта</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label htmlFor="password">Пароль</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Войти</button>
          <p className="register-link">
            Нет аккаунта? <Link to="/registration">Зарегистрируйтесь здесь</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

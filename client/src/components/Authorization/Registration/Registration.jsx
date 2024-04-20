import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import './Registration.css'; 

export default function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [keywords, setKeywords] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setRegistrationError("Пароли не совпадают!");
      return;
    }

    try {
      const response = await api.post('register/', {
        username,
        email,
        password,
        first_name: firstName,
        surname,
        keywords,
      });

      console.log('Регистрация успешно завершена:', response.data);
      // Redirect to login page on success
      window.location.replace('/login');
    } catch (error) {
      console.error('Ошибка регистрации:', error.response.data);
      setRegistrationError('Ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
      // Handle error response, display error message to user, etc.
    }
  };

  return (
    <div className="container">
      <div className="card registration-form">
        <h2>Тіркелу</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div>
              <label htmlFor="firstName">Атыныз</label>
              <input 
                type="text" 
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label htmlFor="surname">Тегініз</label>
              <input 
                type="text" 
                id="surname" 
                value={surname} 
                onChange={(e) => setSurname(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="input-row">
            <div>
              <label htmlFor="username">Пайдаланушы атыныз</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label htmlFor="email">Электрондық пошта</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="input-row">
            <div>
              <label htmlFor="password">Құпия сөз</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Құпия сөзді растаңыз</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          <div className="input-full-row">
            <label htmlFor="keywords">Сіздің тілектеріңізді сипаттайтын кілт сөздер</label>
            <input 
              type="text" 
              id="keywords" 
              value={keywords} 
              onChange={(e) => setKeywords(e.target.value)} 
              placeholder='Кілт сөздерді үтір арқылы енгізіңіз'
            />
          </div>
          {registrationError && <p className="error-message">{registrationError}</p>}
          <button type="submit">Тіркелу</button>
          <p className="login-link">
          Тіркелдіңіз бе? <Link to="/login">Кіру</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

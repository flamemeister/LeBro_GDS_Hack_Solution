import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { api, setAuthToken, baseURL } from '../../services/api';
import './Chat.css';
import { ButtonList } from '../UI';
import Map from '../Map/Map';
import { user_ava, bot_ava } from '../../assets/icons';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const boxRef = useRef(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          window.location.replace('/login');
          return;
        }

        setAuthToken(token);

        const response = await api.get('/get_user_info/');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('chatMessages');
          window.location.replace('/login');
        }
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    setMessages(storedMessages);

    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [userData]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    const newMessage = { text: message, sender: 'user' };
    const updatedMessagesWithBot = [...messages, newMessage];
    setMessages(updatedMessagesWithBot);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessagesWithBot));

    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token not found');
      }

      setAuthToken(token);

      const response = await axios.post(
        `${baseURL}best_attraction_answer/`,
        { question: message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botResponse = response.data.answer;
      const updatedMessagesWithBotResponse = [
        ...updatedMessagesWithBot,
        { text: botResponse, sender: 'bot' },
      ];

      setMessages(updatedMessagesWithBotResponse);
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessagesWithBotResponse));
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessage('');
    setIsLoading(false);

    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  };

  const handleFindAttractions = async () => {
    const newMessage = {
      text: 'Тиісті көрікті жерлерді табыңыз',
      sender: 'user',
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token not found');
      }

      setAuthToken(token);

      const response = await axios.get(`${baseURL}best_attractions_rating/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const attractions = response.data.filter(
        (attraction) => attraction.similarity_score > 0
      );

      const botResponse = 'Керемет! Мен сіздің қалауыңыз бойынша орындардың тізімін жасай алдым';
      const updatedMessagesWithBotResponse = [
        ...updatedMessages,
        { text: botResponse, sender: 'bot' },
      ];

      setMessages(updatedMessagesWithBotResponse);

      if (attractions.length === 0) {
        const noResultsMessage = {
          text: 'Кешіріңіз! Мен сізге дұрыс орынды таба алмадым',
          sender: 'bot',
        };
        const updatedMessagesWithNoResults = [...updatedMessagesWithBotResponse, noResultsMessage];
        setMessages(updatedMessagesWithNoResults);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessagesWithNoResults));
      } else {
        const botMessages = attractions.map(
          (attraction, index) =>
            `${index + 1}. ${attraction.attraction_name}`
        );

        const updatedMessagesWithBotMessages = [
          ...updatedMessagesWithBotResponse,
          ...botMessages.map((text) => ({ text, sender: 'bot' })),
        ];

        setMessages(updatedMessagesWithBotMessages);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessagesWithBotMessages));
      }
    } catch (error) {
      console.error('Error finding attractions:', error);
    }

    setIsLoading(false);

    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  };

  const handleActionButtonClick = () => {
    handleFindAttractions();
  };

  const handleGoToMapButtonClick = async () => {
    setIsMapModalOpen((prevState) => !prevState);

    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  };

  return (
    <>
      <div className="chat">
        <div className="wrapper">
          <div className="title">Citypass Astana Чат-боты</div>
          <div className="box" ref={boxRef}>
            <div className="item">
              <div className="icon">
                <img
                  src={bot_ava}
                  alt={'Bot Icon'}
                  className="user-icon"
                />
              </div>
              <div className="msg">
                <p>Сәлем {userData?.first_name} {userData?.surname}! Мен сіздің барлық сұрақтарыңызға мүмкіндігінше жауап беруге дайынмын</p>
              </div>
            </div>
            <br clear="both" />
            {messages.map((msg, index) => (
              <div key={index}>
                <div className={`item ${msg.sender === 'user' ? 'right' : ''}`}>
                  <div className="icon">
                    <img
                      src={msg.sender === 'user' ? user_ava[userData?.profile_image] : bot_ava}
                      alt={msg.sender === 'user' ? 'User Icon' : 'Bot Icon'}
                      className="user-icon"
                    />
                  </div>
                  <div className="msg">
                    <p>{msg.text}</p>
                  </div>
                </div>
                <br clear="both" />
              </div>
            ))}
            {isLoading && (
              <div className="item">
                <div className="icon">
                  <img
                    src={bot_ava}
                    alt={'Bot Icon'}
                    className="user-icon"
                  />
                </div>
                <div className="msg">
                  <p>Маған бір секунд беріңіз. Мен еске түсіруге тырысамын</p>
                </div>
              </div>
            )}
          </div>

          <div className="typing-area">
            <div className="input-field">
              <input
                type="text"
                placeholder="Сұрағыңызды теріңіз"
                value={message}
                onChange={handleMessageChange}
                required
              />
              <button onClick={handleSendMessage} className="send-btn">Жіберу</button>
            </div>
            <ButtonList onFindAttractionsClick={handleActionButtonClick} onGoToMapClick={handleGoToMapButtonClick} isOpen={isMapModalOpen} />
          </div>
        </div>
      </div>
      {isMapModalOpen && <Map />}
    </>
  );
};

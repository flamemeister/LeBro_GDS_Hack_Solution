import React from "react";
import { Routes, Route } from 'react-router-dom';

import "./assets/global.css";

import { Login, Registration, Chat, Map } from "./components";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/map" element={<Map />} />
    </Routes>
  );
}
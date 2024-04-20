import React from "react";
import { Routes, Route } from 'react-router-dom';

import "./assets/global.css";

import { Login, Registration, Chat } from "./components";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/" element={<Chat />} />
    </Routes>
  );
}
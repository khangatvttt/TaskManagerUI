import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './LoginPage';
import TodoList from './TodoList';
import CustomReporting from './CustomReporting';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<TodoList />} />
        <Route path="aaa" element={<CustomReporting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

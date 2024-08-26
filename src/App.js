import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './LoginPage';
import TodoList from './TodoList';
import DetailTask from './DetailTask';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<TodoList />} />
        <Route path="user/:userId/task/:taskId" element={<DetailTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './LoginPage';
import TodoList from './TodoList';
import DetailTask from './DetailTask';
import CreateTask from './CreateTask';
import EditTask from './EditTask'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<TodoList />} />
        <Route path="user/:userId/task/:taskId" element={<DetailTask />} />
        <Route path="createTask" element={<CreateTask />} />
        <Route path="user/:userId/task/:taskId/edit" element={<EditTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

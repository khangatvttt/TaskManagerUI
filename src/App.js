import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './LoginPage';
import TodoList from './TodoList';
import DetailTask from './DetailTask';
import CreateTask from './CreateTask';
import EditTask from './EditTask'
import ProfilePage from './ProfilePage';
import SignUp from './SignUp';
import Test from './test';
import VerifyEmail from './verifyEmail';
import EditProfile from './EditProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<TodoList />} />
        <Route path="user/:userId/task/:taskId" element={<DetailTask />} />
        <Route path="createTask" element={<CreateTask />} />
        <Route path="user/:userId/task/:taskId/edit" element={<EditTask />} />
        <Route path="user/:userId/profile" element={<ProfilePage />} />
        <Route path="user/:userId/editprofile" element={<EditProfile />} />
        <Route path="register" element={<SignUp />} />
        <Route path="verify" element={<VerifyEmail />} />
        <Route path="test" element={<Test />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

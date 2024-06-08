// src/App.tsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="App">
      {isLogin ? (
        <LoginForm switchToRegister={switchToRegister} />
      ) : (
        <RegisterForm switchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography } from "@material-tailwind/react";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 模拟登录逻辑
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('auth', true); // 模拟将用户状态存储在 localStorage 中
      setIsAuthenticated(true);
      navigate('/'); // 跳转到数据总览页面
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 p-6">
        <Typography variant="h4" className="text-center mb-4">登录</Typography>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Input
              label="用户名"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          {error && (
            <Typography
              color="red"
              className="text-center mt-2 mb-4"
              style={{ position: 'relative' }}
            >
              {error}
            </Typography>
          )}
          <Button type="submit" color="blue" className="w-full">登录</Button>
        </form>
        <Typography className="text-center mt-4">
          没有账号？ <a href="/register" className="text-blue-500">注册</a>
        </Typography>
      </Card>
    </div>
  );
};

export default Login;

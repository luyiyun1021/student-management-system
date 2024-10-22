import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { loginUser } from "../services/api";


const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 发送登录请求到后端
      const response = await loginUser(username, password);
      const data = await response.json();
      
      if (response.ok) {
        // 在本地存储登录信息
        localStorage.setItem('username', username);
        localStorage.setItem('auth', 'true');
        setIsAuthenticated(true);
        navigate('/'); // 跳转到数据总览页面
      } else {
        setError(data.detail || '用户名或密码错误');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
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
            <Typography color="red" className="text-center mt-2 mb-4">
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

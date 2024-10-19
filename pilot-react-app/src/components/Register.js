import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography } from "@material-tailwind/react";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // 模拟注册逻辑
    if (password !== confirmPassword) {
      setError('密码和确认密码不一致');
    } else {
      // 模拟注册成功逻辑
      // localStorage.setItem('auth', true);
      navigate('/login'); // 跳转到数据总览页面
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 p-6">
        <Typography variant="h4" className="text-center mb-4">注册</Typography>
        <form onSubmit={handleRegister}>
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
          <div className="mb-4">
            <Input
              label="确认密码"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          <Button type="submit" color="blue" className="w-full">注册</Button>
        </form>
        <Typography className="text-center mt-4">
          已有账号？ <a href="/login" className="text-blue-500">登录</a>
        </Typography>
      </Card>
    </div>
  );
};

export default Register;

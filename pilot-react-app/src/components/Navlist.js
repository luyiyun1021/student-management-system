import React from "react";
import { Typography } from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";

function NavList() {
  const navigate = useNavigate(); // 用于导航

  const handleLogout = () => {
    localStorage.removeItem('auth'); // 清除用户登录状态
    navigate('/login'); // 跳转到登录页面
  };

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-medium">
        <NavLink to="/" className="flex items-center hover:text-blue-500 transition-colors">
          数据总览
        </NavLink>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-medium">
        <NavLink to="/students" className="flex items-center hover:text-blue-500 transition-colors">
          学员资料库
        </NavLink>
      </Typography>
      <Typography as="li" variant="small" color="blue-gray" className="p-1 font-medium">
        <NavLink to="/import-export" className="flex items-center hover:text-blue-500 transition-colors">
          数据管理
        </NavLink>
      </Typography>
      
    </ul>
  );
}

export default NavList;

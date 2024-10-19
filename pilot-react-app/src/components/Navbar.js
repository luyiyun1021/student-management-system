import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavList from "./Navlist"; // 引入 NavList
import { useNavigate } from "react-router-dom";

export function Navbar({ isAuthenticated, setIsAuthenticated }) { // 接收 isAuthenticated 和 setIsAuthenticated 作为 prop
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth'); // 清除用户登录状态
    setIsAuthenticated(false); // 更新 isAuthenticated 为 false
    navigate('/login'); // 重定向到登录页面
  };

  const handleWindowResize = () => window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <MTNavbar className="mx-auto max-w-full px-6 py-3">
      <div className="flex items-center justify-between text-blue-gray-900 w-full">
        <div className="flex items-center">
          {/* 更大更粗的航校学生系统 */}
          <Typography
            as="a"
            href="/"
            variant="h4" // 使用 h4 来增加字体大小
            className="mr-10 font-bold cursor-pointer py-1.5" // 调整右边间距和字体加粗
          >
            航校学生系统
          </Typography>
          {/* 在这里展示 NavList */}
          <div className="hidden lg:block ml-10"> {/* 增加 NavList 左边距 */}
            <NavList />
          </div>
        </div>

        {/* 条件性显示登出按钮 */}
        {isAuthenticated && (
          <div className="flex items-center">
            {/* 大屏幕下显示登出按钮 */}
            <div className="hidden lg:block">
              <button
                onClick={handleLogout}
                className="ml-6 text-blue-500 hover:text-blue-700"
              >
                登出
              </button>
            </div>

            {/* 小屏幕下的折叠菜单 */}
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <XMarkIcon className="h-6 w-6" strokeWidth={2} />
              ) : (
                <Bars3Icon className="h-6 w-6" strokeWidth={2} />
              )}
            </IconButton>
          </div>
        )}
      </div>

      {/* 折叠菜单，小屏幕下的 NavList 和登出按钮 */}
      <Collapse open={openNav}>
        <NavList />
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-blue-500 hover:text-blue-700 mt-4"
          >
            登出
          </button>
        )}
      </Collapse>
    </MTNavbar>
  );
}

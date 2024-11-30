import { faker } from '@faker-js/faker';
import axios from 'axios';

// 登录请求
export const loginUser = async (username, password) => {
  return await fetch('/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
};

// 注册请求
export const registerUser = async (username, password) => {
  return await fetch('/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
};

// 模拟从API获取数据
export const fetchOverviewData = async () => {
  try {
    const response = await fetch('/data-overview/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json(); // 返回 JSON 数据
    } else {
      throw new Error('获取数据失败');
    }
  } catch (error) {
    console.error('获取数据时发生错误:', error);
    return null; // 如果有错误，返回 null
  }
};

export const fetchStudents = async () => {
  try {
    const username = localStorage.getItem('username'); // 从localStorage中获取username

    const response = await axios.get('/students/', {
      params: { username }, // 通过 params 来发送查询参数
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 判断请求是否成功，状态码 200-299 为成功
    if (response.status >= 200 && response.status < 300) {
      return response.data; // 返回 JSON 数据
    } else {
      throw new Error('获取学生数据失败');
    }
  } catch (error) {
    console.error('获取学生数据时发生错误:', error);
    return [];
  }
};

  
// 从后端获取特定学生的详细数据
export const fetchStudentDetail = async (name) => {
  try {
    const username = localStorage.getItem('username'); // 从localStorage中获取username

    const response = await axios.get(`/students/${name}/`, {
      params: { username }, // 通过 params 发送查询参数
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 判断请求是否成功，状态码 200-299 为成功
    if (response.status >= 200 && response.status < 300) {
      return response.data; // 返回 JSON 数据
    } else {
      throw new Error(`获取学生 ${name} 的详细数据失败`);
    }
  } catch (error) {
    if (error.response) {
      // 后端返回了响应但状态码非2xx
      console.error(`后端错误: ${error.response.data.detail}`);
      throw new Error(error.response.data.detail || '获取学生详细信息时发生未知错误');
    } else {
      // 网络错误或其他问题
      console.error('网络错误或未知错误:', error.message);
      throw new Error('无法连接到服务器，请检查网络连接或稍后重试');
    }
  }
};



export const uploadFile = async (file) => {
  const formData = new FormData();
  const username = localStorage.getItem('username'); // 从localStorage中获取username
  formData.append('username', username);
  formData.append('file', file);

  try {
    const response = await axios.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('网络错误');
  }
};

export const downloadFiles = async () => {
  const username = localStorage.getItem('username'); // 从localStorage中获取username

  try {
    const response = await axios.get('/download/', {
      params: { username },
      responseType: 'blob', // 接收二进制数据
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('网络错误');
  }
};

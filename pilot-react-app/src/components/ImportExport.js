import React, { useState } from 'react';
import { Card, CardBody, Button, Typography, Progress } from "@material-tailwind/react";

const ImportExport = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // 上传进度状态
  const [isUploading, setIsUploading] = useState(false); // 是否在上传中
  const fileInputRef = React.createRef(); // 引用隐藏的 file input

  // 模拟文件上传进度
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false); // 上传完成
          return 100;
        }
        return prevProgress + 5; // 模拟每次增加5%
      });
    }, 100); // 每100毫秒更新一次进度
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    simulateUpload(); // 开始模拟上传文件
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click(); // 触发隐藏的 input 点击事件
  };

  const handleFileDownload = () => {
    // 模拟文件导出
    const data = '这是一些导出的数据...';
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exported_data.txt';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card>
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="text-center mb-6 font-bold">
            导入导出功能
          </Typography>

          {/* 左右布局：上传和导出 */}
          <div className="flex flex-col md:flex-row justify-center items-start space-y-6 md:space-y-0 md:space-x-6">

            {/* 文件上传部分 (左侧) */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <Typography variant="h6" className="mb-4">
                上传数据
              </Typography>

              {/* 隐藏文件上传按钮 */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {/* 自定义的上传按钮 */}
              <Button color="blue" onClick={triggerFileUpload} className="mb-4 w-48" disabled={isUploading}>
                {isUploading ? '正在上传...' : '选择文件'}
              </Button>

              {/* 上传进度条 */}
              {isUploading && (
                <div className="w-full mb-4">
                  <Progress value={uploadProgress} color="blue" />
                  <Typography className="text-center mt-2">{uploadProgress}%</Typography>
                </div>
              )}

              {/* 上传完成后显示已选择文件 */}
              {file && !isUploading && (
                <Typography variant="small" className="mt-2 text-gray-600">
                  已上传文件：<span className="font-bold">{file.name}</span>
                </Typography>
              )}
            </div>

            {/* 文件导出部分 (右侧) */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <Typography variant="h6" className="mb-4">
                导出数据
              </Typography>

              <Button color="blue" onClick={handleFileDownload} className="w-48">
                导出数据
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ImportExport;

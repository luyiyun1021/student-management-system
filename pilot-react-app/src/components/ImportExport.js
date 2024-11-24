import React, { useState } from 'react';
import { Card, CardBody, Button, Typography, Progress } from "@material-tailwind/react";
import { uploadFile, downloadFiles } from '../services/api';

const ImportExport = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const fileInputRef = React.createRef();

  const isValidFileName = (fileName) => {
    const regex = /^[\u4e00-\u9fa5]+_(男|女)\.zip$/;
    return regex.test(fileName);
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!isValidFileName(selectedFile.name)) {
        setUploadError('文件名格式不正确，必须为“名字_性别.zip”');
        setFile(null);
        return;
      }
      
      setUploadError('');
      setFile(selectedFile);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const response = await uploadFile(selectedFile);

        if (response.message) {
          setIsUploading(false);
          setUploadProgress(100);
        }
      } catch (error) {
        setIsUploading(false);
        setUploadError(error.detail || '上传失败，请稍后再试');
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileDownload = async () => {
    setDownloadError('');
    try {
      const blob = await downloadFiles();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${localStorage.getItem('username')}_files.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setDownloadError(error.detail || '下载失败，请稍后再试');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card>
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="text-center mb-6 font-bold">
            导入导出功能
          </Typography>

          <div className="flex flex-col md:flex-row justify-center items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* 文件上传部分 */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <Typography variant="h6" className="mb-4">
                上传数据
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <Button color="blue" onClick={triggerFileUpload} className="mb-4 w-48" disabled={isUploading}>
                {isUploading ? '正在上传...' : '选择文件'}
              </Button>

              {uploadError && (
                <Typography color="red" className="text-center mt-2 mb-4">
                  {uploadError}
                </Typography>
              )}

              {isUploading && (
                <div className="w-full mb-4">
                  <Progress value={uploadProgress} color="blue" />
                  <Typography className="text-center mt-2">{uploadProgress}%</Typography>
                </div>
              )}

              {file && !isUploading && (
                <Typography variant="small" className="mt-2 text-gray-600">
                  已上传文件：<span className="font-bold">{file.name}</span>
                </Typography>
              )}
            </div>

            {/* 文件导出部分 */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <Typography variant="h6" className="mb-4">
                导出数据
              </Typography>
              <Button color="blue" onClick={handleFileDownload} className="w-48">
                导出数据
              </Button>
              {downloadError && (
                <Typography color="red" className="text-center mt-2">
                  {downloadError}
                </Typography>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ImportExport;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentDetail } from "../services/api";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const StudentDetail = () => {
  const { name } = useParams();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const loadStudentDetail = async () => {
      const data = await fetchStudentDetail(name);
      setStudentData(data);
    };
    loadStudentDetail();
  }, [name]);

  if (!studentData) {
    return <p className="text-center">加载中...</p>;
  }

  const InfoCard = ({ label, value, unit, customBgColor }) => (
    <div
      className={`flex flex-col items-start p-4 rounded-lg shadow-lg mb-4 ${
        customBgColor || "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
      }`}
    >
      <Typography variant="h6" className="font-semibold">
        {label}
      </Typography>
      <Typography variant="h4" className="font-bold">
        {value} {unit}
      </Typography>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-8 text-center">
            {studentData.name} 的详细数据
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <InfoCard label="姓名" value={studentData.name} />
            <InfoCard label="性别" value={studentData.gender} />
            <InfoCard label="综合得分" value={studentData.score} />
            <InfoCard
              label="是否合格"
              value={studentData.isQualified ? "合格" : "不合格"}
              customBgColor={studentData.isQualified ? "" : "bg-red-600 text-white"}
            />
            <InfoCard label="SDNN (R-R 间隔标准差)" value={studentData.SDNN.toFixed(2)} unit="ms" />
            <InfoCard label="RMSSD (相邻 R-R 间隔差值均方根)" value={studentData.RMSSD.toFixed(2)} unit="ms" />
            <InfoCard label="pNN50 (R-R 间隔大于 50ms 的百分比)" value={`${studentData.pNN50.toFixed(2)}%`} />
            <InfoCard label="平均 QT 间期 (Mean QT Interval)" value={studentData.QTm.toFixed(2)} unit="s" />
            <InfoCard label="校正 QT 值 (QTc)" value={studentData.QTc.toFixed(2)} unit="s" />
            <InfoCard label="脉搏波传播速度 (Mean PWV)" value={studentData.PWVm.toFixed(2)} unit="m/s" />
            <InfoCard label="动脉硬化指数 (ASI)" value={studentData.ASI ? studentData.ASI.toFixed(2) : "未计算"} />
          </div>

          {/* 图片展示 */}
          <div className="my-8">
            <Typography variant="h4" color="blue-gray" className="mb-6 text-center font-bold">
              皮电信号图
            </Typography>
            <img
              src={`data:image/png;base64,${studentData.EDAPic}`}
              alt="皮电信号分析"
              className="rounded-lg shadow-md mx-auto"
            />
          </div>

          <div className="my-12"> {/* 增加图之间的间距 */}
            <Typography variant="h4" color="blue-gray" className="mb-6 text-center font-bold">
              心率信号图
            </Typography>
            <img
              src={`data:image/png;base64,${studentData.ECGPic}`}
              alt="心率信号分析"
              className="rounded-lg shadow-md mx-auto"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentDetail;

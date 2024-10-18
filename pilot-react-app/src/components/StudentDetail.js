import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import { fetchStudentDetail } from "../services/api";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {
  HeartIcon,
  UserIcon,
  SignalIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"; // 图标导入

const StudentDetail = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const loadStudentDetail = async () => {
      const data = await fetchStudentDetail(id);
      setStudentData(data);
    };
    loadStudentDetail();
  }, [id]);

  if (!studentData) {
    return <p className="text-center">加载中...</p>;
  }

  // Fancy卡片组件，用于显示基本信息
  const InfoCard = ({ icon, label, value, unit }) => (
    <div className="flex items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow-lg mb-4">
      <div className="p-3 bg-white rounded-full text-blue-600 mr-4">
        {icon}
      </div>
      <div>
        <Typography variant="h6" className="font-semibold">
          {label}
        </Typography>
        <Typography variant="h4" className="font-bold">
          {value} {unit}
        </Typography>
      </div>
    </div>
  );

  // 心率图表配置
  const getHeartRateOption = () => ({
    title: { text: "心率变化" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: Array.from({ length: 60 }, (_, i) => i + 1) },
    yAxis: { type: "value" },
    series: [{ name: "心率", type: "line", data: studentData.history.heartRate }]
  });

  // 皮电图表配置
  const getSkinConductanceOption = () => ({
    title: { text: "皮电变化" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: Array.from({ length: 60 }, (_, i) => i + 1) },
    yAxis: { type: "value" },
    series: [{ name: "皮电", type: "line", data: studentData.history.skinConductance }]
  });

  // 脑电图表配置
  const getBrainWaveOption = () => ({
    title: { text: "脑电变化" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: Array.from({ length: 60 }, (_, i) => i + 1) },
    yAxis: { type: "value" },
    series: [{ name: "脑电", type: "line", data: studentData.history.brainWave }]
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-8 text-center">
            {studentData.name} 的详细数据
          </Typography>

          {/* Fancy 基础数据展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <InfoCard
              icon={<UserIcon className="h-8 w-8" />}
              label="年龄"
              value={studentData.age}
            />
            <InfoCard
              icon={<HeartIcon className="h-8 w-8" />}
              label="平均心率"
              value={studentData.averageHeartRate}
              unit="bpm"
            />
            <InfoCard
              icon={<SignalIcon className="h-8 w-8" />}
              label="平均皮电"
              value={studentData.averageSkinConductance}
            />
            <InfoCard
              icon={<ChartBarIcon className="h-8 w-8" />}
              label="平均脑电"
              value={studentData.averageBrainWave}
            />
          </div>

          {/* 图表展示 */}
          <div className="my-4">
            <ReactECharts option={getHeartRateOption()} />
          </div>
          <div className="my-4">
            <ReactECharts option={getSkinConductanceOption()} />
          </div>
          <div className="my-4">
            <ReactECharts option={getBrainWaveOption()} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentDetail;

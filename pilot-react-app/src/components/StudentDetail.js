import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import { fetchStudentDetail } from "../services/api";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { HeartIcon, UserIcon, SignalIcon, ChartBarIcon, FireIcon } from "@heroicons/react/24/outline";

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

  const InfoCard = ({ icon, label, value, unit, customBgColor }) => (
    <div
      className={`flex items-center ${customBgColor || 'bg-gradient-to-r from-blue-400 to-blue-600'} 
      text-white p-4 rounded-lg shadow-lg mb-4`}
    >
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
  

  const getChartOption = (title, data) => ({
    title: { 
      text: title, 
      left: "center", 
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4a90e2'
      }
    },
    tooltip: { 
      trigger: "axis", 
      backgroundColor: 'rgba(50, 50, 50, 0.8)',
      borderColor: '#4a90e2',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff'
      }
    },
    xAxis: { 
      type: "category", 
      data: Array.from({ length: data.length }, (_, i) => i + 1),
      axisLine: {
        lineStyle: {
          color: '#4a90e2'
        }
      }
    },
    yAxis: {
      type: "value",
      min: Math.min(...data) - 2,
      max: Math.max(...data) + 2,
      axisLine: {
        lineStyle: {
          color: '#4a90e2'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      }
    },
    series: [
      {
        name: title,
        type: "line",
        data: data,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#4a90e2'  // 设置为纯色
        },
        itemStyle: {
          color: '#4a90e2', // 数据点颜色
          borderColor: '#4a90e2',
          borderWidth: 2,
        },
        symbol: "circle",
        symbolSize: 8,
        areaStyle: {
          color: 'rgba(74, 144, 226, 0.1)' // 微弱填充
        },
        animationDuration: 2000,
        animationEasing: 'elasticOut'
      },
    ],
  });
  

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-8 text-center">
            {studentData.name} 的详细数据
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <InfoCard
              icon={<UserIcon className="h-8 w-8" />}
              label="性别"
              value={studentData.gender}
            />
            <InfoCard
              icon={<SignalIcon className="h-8 w-8" />}
              label="平均皮电"
              value={studentData.averageSkinConductance}
            />
            <InfoCard
              icon={<SignalIcon className="h-8 w-8" />}
              label="皮电波动"
              value={studentData.skinConductanceFluctuation}
            />
            <InfoCard
              icon={<SignalIcon className="h-8 w-8" />}
              label="平均肌肉电"
              value={studentData.averageMuscleActivity}
            />
            <InfoCard
              icon={<SignalIcon className="h-8 w-8" />}
              label="肌肉电波动"
              value={studentData.muscleActivityFluctuation}
            />
            <InfoCard
              icon={<FireIcon className="h-8 w-8" />}
              label="平均体温"
              value={studentData.averageTemperature}
              unit="°C"
            />
            <InfoCard
              icon={<FireIcon className="h-8 w-8" />}
              label="体温波动"
              value={studentData.temperatureFluctuation}
            />
            <InfoCard
              icon={<HeartIcon className="h-8 w-8" />}
              label="平均心率"
              value={studentData.averageHeartRate}
              unit="bpm"
            />
            <InfoCard
              icon={<HeartIcon className="h-8 w-8" />}
              label="心率波动"
              value={studentData.heartRateFluctuation}
            />
            <InfoCard
              icon={<ChartBarIcon className="h-8 w-8" />}
              label="综合得分"
              value={studentData.score}
            />
            <InfoCard
              icon={<ChartBarIcon className="h-8 w-8" />}
              label="是否合格"
              value={studentData.isQualified ? "合格" : "不合格"}
              customBgColor={studentData.isQualified ? '' : 'bg-red-600'}
            />
          </div>

          <div className="my-4">
            <ReactECharts option={getChartOption("皮电历史记录", studentData.history.skinConductance)} />
          </div>
          <div className="my-4">
            <ReactECharts option={getChartOption("肌肉电历史记录", studentData.history.muscleActivity)} />
          </div>
          <div className="my-4">
            <ReactECharts option={getChartOption("心率历史记录", studentData.history.heartRate)} />
          </div>
          <div className="my-4">
            <ReactECharts option={getChartOption("体温历史记录", studentData.history.temperature)} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentDetail;

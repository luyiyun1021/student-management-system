import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { fetchOverviewData } from "../services/api"; // 从 api.js 获取 mock 数据

const DataOverview = () => {
  const [chartData, setChartData] = useState(null); // 初始状态为 null

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchOverviewData();
      setChartData(data); // 成功获取数据后更新状态
    };
    loadData();
  }, []);

  // Fancy 折线图 - 心率趋势
  const getLineChartOption = () => ({
    title: { text: "心率趋势", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: chartData ? chartData.dates : [] },
    yAxis: { type: "value" },
    series: [
      {
        name: "心率",
        type: "line",
        data: chartData ? chartData.heartRate : [],
        smooth: true, // 使线条平滑
        animationDuration: 2000, // 动画持续时间
        lineStyle: { color: "#5470C6", width: 4 }
      }
    ]
  });

  // 动态柱状图 - 步数统计
  const getBarChartOption = () => ({
    title: { text: "步数统计", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: chartData ? chartData.dates : [] },
    yAxis: { type: "value" },
    series: [
      {
        name: "步数",
        type: "bar",
        data: chartData ? chartData.stepCount : [],
        color: "#91CC75",
        animationDuration: 2000,
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0], // 圆角柱状图
        }
      }
    ]
  });

  // Fancy 饼图 - 卡路里消耗
  const getPieChartOption = () => ({
    title: { text: "卡路里消耗比例", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        name: "卡路里消耗",
        type: "pie",
        radius: "50%",
        data: chartData && chartData.calorieBurn && chartData.dates // 确保数据存在
          ? chartData.calorieBurn.map((value, index) => ({
              value,
              name: chartData.dates[index]
            }))
          : [], // 如果数据不存在，则返回空数组，防止 map 报错
        animationDuration: 1500,
        roseType: "radius", // 显示玫瑰图效果
        label: {
          show: true,
          formatter: "{b}: {c} ({d}%)", // 自定义标签显示
        }
      }
    ]
  });

  // 散点图 - 心率 vs 皮电
  const getScatterChartOption = () => ({
    title: { text: "心率 vs 皮电", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { name: "心率", type: "value" },
    yAxis: { name: "皮电", type: "value" },
    series: [
      {
        name: "数据",
        type: "scatter",
        data: chartData && chartData.heartRate && chartData.skinConductance // 确保数据存在
          ? chartData.heartRate.map((hr, index) => [hr, chartData.skinConductance[index]])
          : [],
        itemStyle: {
          color: "#EE6666",
        },
        symbolSize: function (data) {
          return Math.sqrt(data[0]) * 2; // 动态设置散点大小
        },
        animationDuration: 2000
      }
    ]
  });

  // 雷达图 - 综合健康评分
  const getRadarChartOption = () => ({
    title: { text: "综合健康评分", left: "center" },
    tooltip: {},
    radar: {
      indicator: [
        { name: "心率", max: 100 },
        { name: "皮电", max: 10 },
        { name: "脑电", max: 150 },
        { name: "步数", max: 10000 },
        { name: "卡路里", max: 1000 },
        { name: "睡眠质量", max: 10 }
      ],
      shape: "circle" // 圆形雷达图
    },
    series: [
      {
        name: "健康评分",
        type: "radar",
        data: chartData && chartData.heartRate && chartData.skinConductance && chartData.brainWave // 确保数据存在
          ? [
              {
                value: [
                  chartData.heartRate[0],
                  chartData.skinConductance[0],
                  chartData.brainWave[0],
                  chartData.stepCount[0],
                  chartData.calorieBurn[0],
                  chartData.sleepQuality[0]
                ],
                name: "数据"
              }
            ]
          : [],
        areaStyle: { opacity: 0.1 }, // 添加透明背景
        lineStyle: { width: 2 },
        animationDuration: 2000
      }
    ]
  });

  // Fancy 热力图
  const getHeatmapOption = () => {
    const heatmapData =
      chartData && chartData.heartRate
        ? chartData.dates.map((date, index) => [index, 0, chartData.heartRate[index]])
        : [];

    return {
      title: { text: "心率热力图", left: "center" },
      tooltip: { position: "top" },
      grid: { height: "50%", top: "10%" },
      xAxis: { type: "category", data: chartData ? chartData.dates : [] },
      yAxis: { type: "category", data: ["心率"] },
      visualMap: {
        min: 60,
        max: 100,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "15%",
        inRange: {
          color: ["#50a3ba", "#eac736", "#d94e5d"]
        }
      },
      series: [
        {
          name: "心率",
          type: "heatmap",
          data: heatmapData,
          label: { show: true },
          emphasis: { itemStyle: { shadowBlur: 10 } },
          animationDuration: 2000
        }
      ]
    };
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
      <h1 className="text-2xl font-bold text-center col-span-full mb-4">学员数据总览</h1>

      {chartData ? (
        <>
          <ReactECharts option={getLineChartOption()} />
          <ReactECharts option={getBarChartOption()} />
          <ReactECharts option={getPieChartOption()} />
          <ReactECharts option={getScatterChartOption()} />
          <ReactECharts option={getRadarChartOption()} />
          <ReactECharts option={getHeatmapOption()} />
        </>
      ) : (
        <p className="text-center col-span-full">加载中...</p>
      )}
    </div>
  );
};

export default DataOverview;

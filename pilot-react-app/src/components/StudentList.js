import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents } from "../services/api";
import {
  Card,
  CardBody,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [sortDimension, setSortDimension] = useState("name"); // 默认按综合评分排序
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStudents();
      setStudents(data.sort((a, b) => b.score - a.score)); // 初始按综合评分排序
    };
    loadData();
  }, []);

  const handleSort = (dimension) => {
    const sortedStudents = [...students].sort((a, b) => {
      if (dimension === "name") {
        return a[dimension].localeCompare(b[dimension], "zh"); // 按拼音排序
      }
      return b[dimension] - a[dimension]; // 数字排序
    });
    setSortDimension(dimension);
    setStudents(sortedStudents);
  };

  const handleStudentClick = (name) => {
    const encodedName = encodeURIComponent(name);
    navigate(`/students/${encodedName}`);
  };

  const renderStudentTable = () => {
    return students.map((student, index) => (
      <tr
        key={student.id}
        className="cursor-pointer hover:bg-gray-100" // 添加悬停效果
        onClick={() => handleStudentClick(student.name)}
      >
        <td className="p-3 text-center">{index + 1}</td>
        <td className="p-3 text-center">{student.name}</td>
        {/* <td className="p-3 text-center">{student.averageSkinConductance}</td>
        <td className="p-3 text-center">{student.skinConductanceFluctuation}</td>
        <td className="p-3 text-center">{student.averageMuscleActivity}</td>
        <td className="p-3 text-center">{student.muscleActivityFluctuation}</td>
        <td className="p-3 text-center">{student.averageTemperature}</td>
        <td className="p-3 text-center">{student.temperatureFluctuation}</td>
        <td className="p-3 text-center">{student.score}</td>
        <td className={`p-3 text-center ${!student.isQualified ? "text-red-500" : ""}`}>
          {!student.isQualified ? "不合格" : "合格"}
        </td> */}
      </tr>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className="shadow-md">
        <CardBody className="flex flex-col items-center">
          <Typography variant="h4" color="blue-gray" className="mb-4 text-center">
            学员资料库
          </Typography>

          <div className="flex justify-end items-center mb-6 w-full">
            <div className="w-60">
              <Select
                label="选择排序维度"
                value={sortDimension}
                onChange={(e) => handleSort(e)}
                className="w-full"
              >
                <Option value="name">姓名</Option>
                {/* <Option value="score">综合评分</Option>
                <Option value="averageSkinConductance">平均皮电</Option>
                <Option value="skinConductanceFluctuation">皮电波动值</Option>
                <Option value="averageMuscleActivity">平均肌肉电</Option>
                <Option value="muscleActivityFluctuation">肌肉电波动值</Option>
                <Option value="averageTemperature">平均体温</Option>
                <Option value="temperatureFluctuation">体温波动值</Option> */}
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border-b border-gray-200">序号</th>
                  <th className="p-3 border-b border-gray-200">姓名</th>
                  {/* <th className="p-3 text-center">平均皮电</th>
                  <th className="p-3 text-center">皮电波动</th>
                  <th className="p-3 text-center">平均肌电</th>
                  <th className="p-3 text-center">肌电波动</th>
                  <th className="p-3 text-center">平均体温</th>
                  <th className="p-3 text-center">体温波动</th>
                  <th className="p-3 text-center">综合评分</th>
                  <th className="p-3 text-center">状态</th> */}
                </tr>
              </thead>
              <tbody>{renderStudentTable()}</tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentList;

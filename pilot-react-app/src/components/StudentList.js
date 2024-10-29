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
  const [sortDimension, setSortDimension] = useState("score"); // 默认按综合评分排序
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

  const handleStudentClick = (id) => {
    navigate(`/students/${id}`);
  };

  const renderStudentTable = () => {
    return students.map((student, index) => (
      <tr
        key={student.id}
        className={student.isQualified ? "" : "bg-red-50"}
        onClick={() => handleStudentClick(student.id)}
      >
        <td className="p-3 text-center cursor-pointer">{index + 1}</td>
        <td className="p-3 text-left cursor-pointer">{student.name}</td>
        <td className="p-3 text-center">{student.averageSkinConductance}</td>
        <td className="p-3 text-center">{student.skinConductanceFluctuation}</td>
        <td className="p-3 text-center">{student.averageMuscleActivity}</td>
        <td className="p-3 text-center">{student.muscleActivityFluctuation}</td>
        <td className="p-3 text-center">{student.averageTemperature}</td>
        <td className="p-3 text-center">{student.temperatureFluctuation}</td>
        <td className="p-3 text-center">{student.score}</td>
        <td className={`p-3 text-center ${!student.isQualified ? "text-red-500" : ""}`}>
          {!student.isQualified ? "不合格" : "合格"}
        </td>
      </tr>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-4 text-center">
            学员资料库
          </Typography>

          <div className="flex justify-end items-center mb-6">
            <div className="w-60">
              <Select
                label="选择排序维度"
                value={sortDimension}
                onChange={(e) => handleSort(e)} // 保证设置排序维度
                className="w-full"
              >
                <Option value="name">姓名</Option>
                <Option value="score">综合评分</Option>
                <Option value="averageSkinConductance">平均皮电</Option>
                <Option value="skinConductanceFluctuation">皮电波动值</Option>
                <Option value="averageMuscleActivity">平均肌肉电</Option>
                <Option value="muscleActivityFluctuation">肌肉电波动值</Option>
                <Option value="averageTemperature">平均体温</Option>
                <Option value="temperatureFluctuation">体温波动值</Option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-center">序号</th>
                  <th className="p-3 text-left">姓名</th>
                  <th className="p-3 text-center">平均皮电</th>
                  <th className="p-3 text-center">皮电波动</th>
                  <th className="p-3 text-center">平均肌电</th>
                  <th className="p-3 text-center">肌电波动</th>
                  <th className="p-3 text-center">平均体温</th>
                  <th className="p-3 text-center">体温波动</th>
                  <th className="p-3 text-center">综合评分</th>
                  <th className="p-3 text-center">状态</th>
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

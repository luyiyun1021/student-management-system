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
  const [sortDimension, setSortDimension] = useState("score");
  const navigate = useNavigate(); // 用于跳转页面

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStudents();
      setStudents(data);
    };
    loadData();
  }, []);

  const handleSort = (dimension) => {
    const sortedStudents = [...students].sort((a, b) => b[dimension] - a[dimension]);
    setSortDimension(dimension);
    setStudents(sortedStudents);
  };

  const handleStudentClick = (id) => {
    navigate(`/students/${id}`); // 跳转到学生的详细页面
  };

  const renderStudentTable = () => {
    return students.map((student, index) => (
      <tr key={student.id} className={student.isQualified ? "" : "bg-red-50"} onClick={() => handleStudentClick(student.id)}>
        <td className="p-3 text-center cursor-pointer">{index + 1}</td>
        <td className="p-3 text-left cursor-pointer">{student.name}</td>
        <td className="p-3 text-center">{student.averageHeartRate}</td>
        <td className="p-3 text-center">{student.averageSkinConductance}</td>
        <td className="p-3 text-center">{student.averageBrainWave}</td>
        <td className="p-3 text-center">{student.stepCount}</td>
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
                onChange={(e) => handleSort(e)}
                className="w-full"
              >
                <Option value="score">综合评分</Option>
                <Option value="heartRate">心率</Option>
                <Option value="skinConductance">皮电</Option>
                <Option value="brainWave">脑电</Option>
                <Option value="stepCount">步数</Option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-center">序号</th>
                  <th className="p-3 text-left">姓名</th>
                  <th className="p-3 text-center">心率</th>
                  <th className="p-3 text-center">皮电</th>
                  <th className="p-3 text-center">脑电</th>
                  <th className="p-3 text-center">步数</th>
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

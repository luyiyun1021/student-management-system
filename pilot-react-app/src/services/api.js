import { faker } from '@faker-js/faker';

// 模拟从API获取数据
export const fetchOverviewData = async () => {
    return {
        dates: ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05"],
        heartRate: [72, 75, 78, 76, 80],
        skinConductance: [4, 5, 6, 4, 7],
        brainWave: [100, 110, 120, 130, 115],
        stepCount: [3000, 5000, 7000, 8000, 6000],
        calorieBurn: [200, 300, 400, 350, 500],
        sleepQuality: [7, 6.5, 8, 7.5, 6]
    };
};

export const fetchStudents = async () => {
    const students = Array.from({ length: 20 }, (_, id) => ({
      id: id + 1,
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 25 }),
      heartRate: faker.number.int({ min: 60, max: 100 }),
      skinConductance: faker.number.int({ min: 1, max: 10 }),
      brainWave: faker.number.int({ min: 50, max: 150 }),
      stepCount: faker.number.int({ min: 3000, max: 12000 }),
      score: faker.number.int({ min: 50, max: 100 }), // 综合评分
      isQualified: faker.number.int({ min: 0, max: 1 }) === 1, // 随机设置是否合格
    }));
  
    return students;
  };
  
  // 模拟生成特定学生的详细数据
  export const fetchStudentDetail = async (id) => {
    const data = {
      id,
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 25 }),
      averageHeartRate: faker.number.int({ min: 60, max: 100 }),
      averageSkinConductance: faker.number.int({ min: 1, max: 10 }),
      averageBrainWave: faker.number.int({ min: 50, max: 150 }),
      history: {
        heartRate: Array.from({ length: 60 }, () => faker.number.int({ min: 60, max: 100 })),
        skinConductance: Array.from({ length: 60 }, () => faker.number.int({ min: 1, max: 10 })),
        brainWave: Array.from({ length: 60 }, () => faker.number.int({ min: 50, max: 150 })),
      },
    };
    
    return data;
  };

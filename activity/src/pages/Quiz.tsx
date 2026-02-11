import React from 'react';
import { NavBar, Card, Button, ProgressBar, Space } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const Quiz: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50">
      <NavBar onBack={() => navigate(-1)}>答题闯关</NavBar>
      <div className="p-4">
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>闯关进度</span>
                <span>3/10</span>
            </div>
            <ProgressBar percent={30} className="h-3 rounded-full" />
        </div>

        <Card className="shadow-lg">
            <h2 className="text-xl font-bold mb-8 leading-relaxed">Q3: React 的核心设计理念是什么？</h2>

            <Space direction="vertical" block style={{ '--gap': '16px' } as React.CSSProperties}>
                <Button block size="large" className="text-left justify-start px-6 rounded-xl border-gray-200 hover:border-green-500 transition-colors">A. 双向数据绑定</Button>
                <Button block size="large" className="text-left justify-start px-6 rounded-xl border-green-500 bg-green-50 text-green-700 font-bold" color="primary" fill="outline">B. 单向数据流</Button>
                <Button block size="large" className="text-left justify-start px-6 rounded-xl border-gray-200 hover:border-green-500 transition-colors">C. 依赖注入</Button>
                <Button block size="large" className="text-left justify-start px-6 rounded-xl border-gray-200 hover:border-green-500 transition-colors">D. 面向对象编程</Button>
            </Space>
        </Card>

        <div className="mt-8 text-center text-gray-500 font-medium">
            🔥 连对 3 题，积分翻倍！
        </div>
      </div>
    </div>
  );
};

export default Quiz;

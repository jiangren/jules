import React from 'react';
import { NavBar, Card, Button, Skeleton, Space } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const LuckyWheel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50">
      <NavBar onBack={() => navigate(-1)}>幸运大转盘</NavBar>
      <div className="p-4">
        <Card title="活动玩法">
          <p className="text-gray-600">点击“开始抽奖”按钮，转盘转动，最终指针指向的奖品即为中奖礼品。</p>
        </Card>

        <div className="mt-8 flex flex-col items-center justify-center">
            {/* Wheel Placeholder */}
            <div className="w-64 h-64 rounded-full border-8 border-orange-400 bg-orange-100 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-orange-800 font-bold text-lg">转盘区域</span>
                </div>
                {/* Visual Segments */}
                <div className="absolute w-full h-0.5 bg-orange-300 transform rotate-0"></div>
                <div className="absolute w-full h-0.5 bg-orange-300 transform rotate-45"></div>
                <div className="absolute w-full h-0.5 bg-orange-300 transform rotate-90"></div>
                <div className="absolute w-full h-0.5 bg-orange-300 transform rotate-135"></div>
            </div>

            <Button color="primary" size="large" className="mt-8 px-12 rounded-full font-bold text-lg">
                开始抽奖
            </Button>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-bold mb-2 px-2">中奖名单</h3>
            <Card>
                <Space direction="vertical" block>
                    <div className="flex justify-between items-center">
                        <Skeleton.Title className="w-1/3" />
                        <Skeleton.Title className="w-1/4" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton.Title className="w-1/3" />
                        <Skeleton.Title className="w-1/4" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton.Title className="w-1/3" />
                        <Skeleton.Title className="w-1/4" />
                    </div>
                </Space>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default LuckyWheel;

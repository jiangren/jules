import React from 'react';
import { NavBar, Card, Grid, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const BlindBox: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50">
      <NavBar onBack={() => navigate(-1)}>盲盒抽奖</NavBar>
      <div className="p-4">
        <Card title="选择你的幸运盲盒">
          <p className="text-gray-600 mb-4 text-center">每个盒子都藏着惊喜，快来开启吧！</p>
          <Grid columns={2} gap={16}>
            {[1, 2, 3, 4, 5, 6].map((box) => (
                <div key={box} className="aspect-square bg-gradient-to-br from-purple-200 to-purple-400 rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-xl active:scale-95 transition-all relative">
                    <span className="text-5xl drop-shadow-sm">🎁</span>
                    <span className="mt-2 text-white font-bold text-lg drop-shadow-md">No. {box}</span>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                </div>
            ))}
          </Grid>

          <Button color="primary" size="large" className="w-full mt-8 rounded-full font-bold shadow-lg">
            一键全开 (消耗 500 积分)
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default BlindBox;

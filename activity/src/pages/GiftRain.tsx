import React from 'react';
import { NavBar, Button, Card } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const GiftRain: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-500 overflow-hidden relative flex flex-col">
      <NavBar onBack={() => navigate(-1)} style={{ '--background': 'transparent', color: 'white' } as React.CSSProperties}>红包雨</NavBar>

      {/* Background Elements */}
      <div className="absolute top-20 left-10 text-white text-6xl opacity-50 select-none animate-bounce">🧧</div>
      <div className="absolute top-40 right-20 text-white text-5xl opacity-50 select-none animate-pulse">💰</div>
      <div className="absolute top-60 left-1/2 text-white text-4xl opacity-50 select-none animate-ping">🎁</div>

      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <h1 className="text-white text-4xl font-bold mb-4 drop-shadow-md">倒计时 10s</h1>
        <p className="text-white text-lg mb-8 opacity-90">疯狂点击屏幕掉落的红包！</p>

        <Button color="warning" size="large" className="rounded-full px-12 text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform">
            开始抢红包
        </Button>
      </div>

      <div className="w-full p-4 bg-white rounded-t-2xl z-20">
        <Card>
            <div className="flex justify-between font-bold text-lg">
                <span>当前得分:</span>
                <span className="text-red-500">0</span>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default GiftRain;

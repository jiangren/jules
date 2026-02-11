import React from 'react';
import { NavBar, Card } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const Shake: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavBar onBack={() => navigate(-1)} style={{ '--background': 'transparent', color: 'white' } as React.CSSProperties}>摇一摇</NavBar>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-9xl mb-8 animate-[wiggle_1s_ease-in-out_infinite] origin-bottom">
            📱
        </div>
        <h1 className="text-3xl font-bold mb-4 tracking-widest">摇一摇</h1>
        <p className="text-gray-400 text-lg">摇动手机，赢取大奖</p>
      </div>

      <div className="w-full px-4 pb-12">
        <Card className="bg-gray-800 border-none text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🕒</span> 历史记录
            </h3>
            <div className="space-y-3">
                <div className="flex justify-between text-gray-400 text-sm border-b border-gray-700 pb-2">
                    <span>10:23</span>
                    <span>未中奖，继续加油</span>
                </div>
                <div className="flex justify-between text-yellow-400 text-sm border-b border-gray-700 pb-2 font-bold">
                    <span>10:20</span>
                    <span>获得 1 元红包 🧧</span>
                </div>
            </div>
        </Card>
      </div>

      <style>{`
        @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default Shake;

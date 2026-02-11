import React from 'react';
import { NavBar, Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const Merge: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      <NavBar onBack={() => navigate(-1)}>合成大西瓜</NavBar>

      <div className="p-4 flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-orange-600">分数: 1024</h2>
            <Button size="mini" color="danger" fill="outline">重置游戏</Button>
        </div>

        <div className="w-full aspect-[3/4] bg-orange-100 rounded-xl border-4 border-orange-300 relative overflow-hidden shadow-inner flex-1 mb-4">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-orange-200 font-bold text-4xl opacity-50">Game Area</span>
            </div>
            {/* Simulated fruits */}
            <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold shadow-md animate-bounce delay-100">🍇</div>
            <div className="absolute bottom-4 left-20 w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow-md animate-bounce delay-200">🍎</div>
            <div className="absolute bottom-24 left-10 w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow-md animate-bounce">🍊</div>
            <div className="absolute top-10 left-1/2 w-10 h-10 rounded-full bg-red-400 flex items-center justify-center text-white font-bold -ml-5 shadow-lg border-2 border-white">🍒</div>
        </div>

        <div className="text-center text-gray-500 text-sm font-medium">
            点击屏幕投放水果，相同水果碰撞合成更高级水果
        </div>
      </div>
    </div>
  );
};

export default Merge;

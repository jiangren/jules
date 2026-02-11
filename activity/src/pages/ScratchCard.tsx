import React from 'react';
import { NavBar, Card, Skeleton } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const ScratchCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar onBack={() => navigate(-1)}>天天刮刮乐</NavBar>
      <div className="p-4">
        <Card title="玩法说明">
          <p className="text-gray-600">在刮奖区滑动手指，刮开涂层即可查看是否中奖。</p>
        </Card>

        <div className="mt-8 flex justify-center">
            <div className="relative w-72 h-40 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-yellow-100 text-yellow-600 font-bold text-2xl z-0">
                    恭喜中奖！
                </div>
                <div className="absolute inset-0 bg-gray-400 flex items-center justify-center text-white text-xl font-bold opacity-90 z-10 cursor-pointer hover:opacity-0 transition-opacity duration-1000">
                    刮奖区 (长按刮开)
                </div>
            </div>
        </div>

        <div className="mt-8">
            <h3 className="text-lg font-bold mb-2 px-2">我的奖品</h3>
            <Card>
                 <div className="flex justify-between items-center mb-2">
                    <Skeleton.Title className="w-1/3" />
                    <Skeleton.Title className="w-1/4" />
                </div>
                <Skeleton.Paragraph lineCount={2} animated />
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ScratchCard;

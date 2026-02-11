import React, { useState } from 'react';
import { NavBar, Grid, Button, Modal, Toast, Card as AntCard, Badge } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { GiftOutline } from 'antd-mobile-icons';

const CARDS = [
  { id: 1, name: '敬业福', probability: 0.1, color: '#f5222d' }, // Red
  { id: 2, name: '爱国福', probability: 0.2, color: '#fa8c16' }, // Orange
  { id: 3, name: '富强福', probability: 0.2, color: '#fadb14' }, // Yellow
  { id: 4, name: '和谐福', probability: 0.2, color: '#52c41a' }, // Green
  { id: 5, name: '友善福', probability: 0.3, color: '#1890ff' }, // Blue
];

const CardCollection: React.FC = () => {
  const navigate = useNavigate();
  // Initial state simulation: User has some cards already
  const [collected, setCollected] = useState<Record<number, number>>({
    1: 0, 2: 1, 3: 0, 4: 2, 5: 0
  });
  const [drawCount, setDrawCount] = useState(3);

  const drawCard = () => {
    if (drawCount <= 0) {
      Toast.show('抽卡次数不足，请完成任务获取！');
      return;
    }

    setDrawCount(c => c - 1);

    // Weighted random selection
    const rand = Math.random();
    let cumulative = 0;
    let selected = CARDS[CARDS.length - 1];

    for (const card of CARDS) {
        cumulative += card.probability;
        if (rand < cumulative) {
            selected = card;
            break;
        }
    }

    // Animation simulation
    Toast.show({
        icon: 'loading',
        content: '翻牌中...',
        duration: 800,
        afterClose: () => {
            setCollected(prev => ({ ...prev, [selected.id]: (prev[selected.id] || 0) + 1 }));
            Modal.alert({
                header: <div className="text-4xl animate-bounce">🎉</div>,
                title: '恭喜获得',
                content: (
                    <div className="text-center">
                        <div className="text-2xl font-bold mb-4" style={{ color: selected.color }}>{selected.name}</div>
                        <div className="w-32 h-40 mx-auto rounded-xl shadow-xl flex items-center justify-center text-white text-5xl font-bold border-4 border-white transform hover:rotate-3 transition-transform" style={{ backgroundColor: selected.color }}>
                            福
                        </div>
                    </div>
                ),
                confirmText: '开心收下',
            });
        }
    });
  };

  const synthesize = () => {
    const hasAll = CARDS.every(c => (collected[c.id] || 0) > 0);
    if (!hasAll) return;

    Modal.confirm({
        title: '集齐五福',
        content: '消耗一套五福合成大奖，确定合成吗？',
        confirmText: '确定合成',
        cancelText: '我再想想',
        onConfirm: () => {
            setCollected(prev => {
                const next = { ...prev };
                CARDS.forEach(c => next[c.id]--);
                return next;
            });
            Modal.alert({
                header: <GiftOutline fontSize={64} color='#faad14' />,
                title: '合成成功！',
                content: (
                    <div className="text-center">
                        <p className="text-gray-500 mb-2">恭喜获得现金红包</p>
                        <div className="text-4xl font-bold text-red-600 mb-2">66.66 元</div>
                        <p className="text-xs text-gray-400">已存入您的余额</p>
                    </div>
                ),
                confirmText: '立即提现',
                onConfirm: () => { Toast.show({ icon: 'success', content: '提现申请已提交' }) }
            });
        }
    });
  };

  const addDrawCount = () => {
      setDrawCount(c => c + 1);
      Toast.show({ icon: 'success', content: '获得 1 次抽卡机会' });
  };

  const canSynthesize = CARDS.every(c => (collected[c.id] || 0) > 0);

  return (
    <div className="min-h-screen bg-red-700 pb-10 flex flex-col items-center">
      <NavBar onBack={() => navigate(-1)} style={{ '--background': 'transparent', color: 'white' } as React.CSSProperties}>集五福</NavBar>

      <div className="w-full max-w-md p-4 flex-1 overflow-y-auto">
        {/* Header */}
        <div className="text-center text-white mb-8 mt-4">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-md tracking-wider">集五福 分亿元</h1>
            <p className="opacity-90 bg-black/20 inline-block px-4 py-1 rounded-full text-sm backdrop-blur-sm">
                当前剩余次数: <span className="font-bold text-yellow-300 text-lg ml-1">{drawCount}</span>
            </p>
        </div>

        {/* Card Grid */}
        <Grid columns={3} gap={12} className="mb-8 px-2">
            {CARDS.map(card => {
                const count = collected[card.id] || 0;
                const isOwned = count > 0;
                return (
                    <div key={card.id} className={`relative aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center shadow-md transition-all duration-300 ${isOwned ? 'bg-white border-yellow-400 transform scale-100' : 'bg-gray-200 border-gray-300 opacity-60 scale-95 grayscale'}`}>
                        {isOwned && <Badge content={count} className="absolute -top-2 -right-2 border border-white" />}
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-sm" style={{ backgroundColor: isOwned ? card.color : '#999' }}>
                            福
                        </div>
                        <span className={`font-bold text-sm ${isOwned ? 'text-gray-800' : 'text-gray-500'}`}>{card.name}</span>
                    </div>
                );
            })}
             {/* Synthesize Button Slot */}
             <div className="aspect-[3/4] flex items-center justify-center">
                <Button
                    color="primary"
                    disabled={!canSynthesize}
                    onClick={synthesize}
                    className={`w-full h-full rounded-xl font-bold text-lg flex flex-col items-center justify-center gap-2 whitespace-normal leading-tight shadow-lg transition-all ${canSynthesize ? 'animate-pulse bg-gradient-to-br from-yellow-300 to-orange-500 border-none text-red-700 scale-105 shadow-yellow-500/50' : 'bg-white/10 border-white/20 text-white/50'}`}
                >
                    <GiftOutline fontSize={32} />
                    {canSynthesize ? '点击合成' : '集齐合成'}
                </Button>
             </div>
        </Grid>

        {/* Action Button */}
        <div className="flex justify-center mb-8 relative z-10">
            <Button
                block
                size="large"
                shape="rounded"
                onClick={drawCard}
                className="w-56 h-16 text-2xl font-bold shadow-2xl bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 border-none text-red-900 active:scale-95 transition-transform hover:shadow-yellow-500/50"
            >
                立即抽卡
            </Button>
        </div>

        {/* Tasks */}
        <AntCard className="bg-white/95 backdrop-blur shadow-xl rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-red-800 text-lg">
                <GiftOutline />
                任务列表
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-red-50 last:border-none">
                    <div>
                        <div className="font-bold text-gray-800">每日签到</div>
                        <div className="text-xs text-gray-500">获得 1 次抽卡机会</div>
                    </div>
                    <Button size="mini" color="danger" fill="outline" shape="rounded" onClick={addDrawCount}>去完成</Button>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-red-50 last:border-none">
                    <div>
                        <div className="font-bold text-gray-800">分享给好友</div>
                        <div className="text-xs text-gray-500">获得 1 次抽卡机会</div>
                    </div>
                    <Button size="mini" color="danger" fill="outline" shape="rounded" onClick={addDrawCount}>去完成</Button>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-red-50 last:border-none">
                    <div>
                        <div className="font-bold text-gray-800">浏览活动主页</div>
                        <div className="text-xs text-gray-500">获得 1 次抽卡机会</div>
                    </div>
                    <Button size="mini" color="danger" fill="outline" shape="rounded" onClick={addDrawCount}>去完成</Button>
                </div>
            </div>
        </AntCard>
      </div>
    </div>
  );
};

export default CardCollection;

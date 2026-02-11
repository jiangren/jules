import React, { useState } from 'react';
import { NavBar, ProgressBar, Button, Avatar, List, Toast, Modal, Popup } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { UserOutline, LinkOutline, FireFill } from 'antd-mobile-icons';

// Mock Data
const PRODUCT = {
  name: 'iPhone 15 Pro Max 256GB',
  image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
  originalPrice: 9999,
  minPrice: 0,
};

const Bargain: React.FC = () => {
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState(PRODUCT.originalPrice);
  const [records, setRecords] = useState<{ name: string; amount: number; time: string }[]>([]);
  const [hasSelfBargained, setHasSelfBargained] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Progress calculation
  const totalCut = PRODUCT.originalPrice - currentPrice;
  const percent = Math.min(100, (totalCut / (PRODUCT.originalPrice - PRODUCT.minPrice)) * 100);

  const handleSelfBargain = () => {
    // Simulate API call delay
    Toast.show({
        icon: 'loading',
        content: '正在砍价...',
        duration: 500,
        afterClose: () => {
            const amount = Math.floor(Math.random() * 50) + 10; // Random cut 10-60
            setCurrentPrice(p => Math.max(0, p - amount));
            setRecords(prev => [{ name: '我', amount, time: '刚刚' }, ...prev]);
            setHasSelfBargained(true);

            Modal.alert({
                content: (
                <div className="text-center">
                    <div className="text-6xl mb-2">🔪</div>
                    <div className="text-2xl font-bold text-red-500 mb-2">成功砍掉 {amount} 元!</div>
                    <p className="text-gray-500">太棒了！快邀请好友帮你砍到0元吧！</p>
                </div>
                ),
                confirmText: '立即邀请',
                onConfirm: () => setShowShare(true),
            });
        }
    });
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const handleCopyLink = () => {
     Toast.show({
        icon: 'success',
        content: '链接已复制，快去发给好友吧！',
      });
      setShowShare(false);

      // Simulate a friend helping after 3 seconds
      setTimeout(() => {
          const friendName = `好友${Math.floor(Math.random() * 1000)}`;
          const amount = Math.floor(Math.random() * 20) + 5;

          Toast.show({
              content: (
                  <div className="flex items-center gap-2">
                      <FireFill color='#ff3141' />
                      <span>{friendName} 帮你砍了 {amount} 元！</span>
                  </div>
              ),
              position: 'top',
          });

          setCurrentPrice(p => Math.max(0, p - amount));
          setRecords(prev => [{ name: friendName, amount, time: '刚刚' }, ...prev]);

      }, 3000);
  };

  return (
    <div className="min-h-screen bg-red-600 pb-10 flex flex-col">
      <NavBar onBack={() => navigate(-1)} style={{ '--background': 'transparent', color: 'white' } as React.CSSProperties}>好友助力</NavBar>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Product Card */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
            <div className="flex gap-4">
                <img src={PRODUCT.image} alt={PRODUCT.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                <div className="flex-1 flex flex-col justify-between">
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{PRODUCT.name}</h3>
                    <div>
                        <div className="text-gray-400 text-xs line-through">原价 ¥{PRODUCT.originalPrice}</div>
                        <div className="text-red-600 font-bold text-xl flex items-baseline gap-1">
                            <span className="text-sm">现价 ¥</span>
                            {currentPrice}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>已砍 <span className="text-red-500 font-bold">{totalCut}</span> 元</span>
                    <span>还差 {currentPrice} 元</span>
                </div>
                <ProgressBar percent={percent} style={{ '--track-width': '12px', '--fill-color': '#FF3141', '--track-color': '#ffeeee' } as React.CSSProperties} />
            </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-8 px-2">
            {!hasSelfBargained ? (
                <Button block color="warning" size="large" shape="rounded" className="font-bold shadow-lg animate-pulse bg-gradient-to-r from-yellow-400 to-orange-500 border-none" onClick={handleSelfBargain}>
                    🔥 自砍一刀
                </Button>
            ) : (
                 <Button block color="danger" size="large" shape="rounded" className="font-bold shadow-lg bg-gradient-to-r from-red-500 to-pink-600 border-none" onClick={handleShare}>
                    👥 找人帮砍
                </Button>
            )}
        </div>

        {/* Bargain Records */}
        <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-center mb-4 gap-2">
                <div className="h-[1px] bg-red-200 w-12"></div>
                <h3 className="text-center font-bold text-red-800">砍价记录</h3>
                <div className="h-[1px] bg-red-200 w-12"></div>
            </div>

            {records.length === 0 ? (
                <div className="text-center text-gray-400 py-8 flex flex-col items-center">
                    <UserOutline fontSize={48} className="opacity-20 mb-2" />
                    <p>暂无记录，快去邀请好友吧</p>
                </div>
            ) : (
                <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
                    {records.map((record, index) => (
                        <List.Item
                            key={index}
                            prefix={<Avatar src="" style={{ '--size': '36px', '--border-radius': '50%' } as React.CSSProperties} fallback={<UserOutline />} />}
                            extra={<span className="text-red-500 font-bold flex items-center gap-1">🪓 {record.amount}</span>}
                        >
                            <div className="text-sm">
                                <div className="font-bold text-gray-800">{record.name}</div>
                                <div className="text-gray-400 text-xs">{record.time}</div>
                            </div>
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
      </div>

      {/* Share Popup */}
      <Popup
        visible={showShare}
        onMaskClick={() => setShowShare(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div className="p-6 text-center bg-gray-50">
            <div className="text-lg font-bold mb-6 text-gray-800">分享给好友，多砍一刀</div>
            <div className="flex justify-around mb-8">
                <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={handleCopyLink}>
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform">
                        <UserOutline fontSize={28} />
                    </div>
                    <span className="text-sm text-gray-600">微信好友</span>
                </div>
                <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={handleCopyLink}>
                     <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform">
                        <LinkOutline fontSize={28} />
                    </div>
                    <span className="text-sm text-gray-600">复制链接</span>
                </div>
            </div>
            <Button block color="default" size="large" shape="rounded" onClick={() => setShowShare(false)} className="bg-white border border-gray-200 text-gray-600">
                取消
            </Button>
        </div>
      </Popup>
    </div>
  );
};

export default Bargain;

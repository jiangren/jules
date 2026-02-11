import React from 'react';
import { List, NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import {
  GiftOutline,
  TeamOutline,
  ScanCodeOutline,
  SmileOutline,
  CalendarOutline,
  ShopbagOutline,
  FileOutline,
  StarOutline,
  PieOutline,
  AppstoreOutline
} from 'antd-mobile-icons';

const demos = [
  { path: '/bargain', title: '好友助力砍价', icon: <TeamOutline /> },
  { path: '/card-collection', title: '集卡大作战', icon: <AppstoreOutline /> },
  { path: '/lucky-wheel', title: '幸运大转盘', icon: <PieOutline /> },
  { path: '/scratch-card', title: '天天刮刮乐', icon: <ScanCodeOutline /> },
  { path: '/gift-rain', title: '红包雨', icon: <GiftOutline /> },
  { path: '/check-in', title: '每日签到', icon: <CalendarOutline /> },
  { path: '/blind-box', title: '盲盒抽奖', icon: <ShopbagOutline /> },
  { path: '/quiz', title: '答题闯关', icon: <FileOutline /> },
  { path: '/shake', title: '摇一摇', icon: <StarOutline /> },
  { path: '/merge', title: '合成大西瓜', icon: <SmileOutline /> },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar back={null}>活动 Demo 展示</NavBar>
      <List header='请选择一个活动进行体验'>
        {demos.map((demo) => (
          <List.Item
            key={demo.path}
            prefix={demo.icon}
            onClick={() => navigate(demo.path)}
            arrow
          >
            {demo.title}
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default Home;

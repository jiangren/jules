import React from 'react';
import { NavBar, Button, Card, Steps, Grid } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFill } from 'antd-mobile-icons';

const CheckIn: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50">
      <NavBar onBack={() => navigate(-1)}>每日签到</NavBar>

      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white mb-6 shadow-md">
            <h2 className="text-2xl font-bold mb-2">已连续签到 3 天</h2>
            <p className="opacity-90">再签到 4 天即可获得大奖！</p>
            <Button color="primary" className="mt-4 w-full font-bold bg-white text-blue-600 border-none shadow-sm active:scale-95 transition-transform">
                立即签到
            </Button>
        </div>

        <Card title="签到日历" className="mb-6">
            <Grid columns={7} gap={8}>
                {[...Array(7)].map((_, i) => (
                    <div key={i} className={`flex flex-col items-center p-2 rounded transition-colors ${i < 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                        <span className="text-xs mb-1 font-semibold">Day {i + 1}</span>
                        {i < 3 ? <CheckCircleFill fontSize={20} /> : <div className="w-5 h-5 rounded-full bg-gray-300"></div>}
                    </div>
                ))}
            </Grid>
        </Card>

        <div className="mt-2">
            <Card title="奖励进度">
                <Steps direction='vertical'>
                    <Steps.Step title='Day 1' description='获得 10 积分' status='finish' />
                    <Steps.Step title='Day 2' description='获得 20 积分' status='finish' />
                    <Steps.Step title='Day 3' description='获得 50 积分' status='finish' />
                    <Steps.Step title='Day 4' description='获得 100 积分' status='wait' />
                    <Steps.Step title='Day 7' description='获得 神秘礼包' status='wait' />
                </Steps>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;

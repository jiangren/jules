import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import DemoWrapper from './components/DemoWrapper';

import { ReanimatedHero, GsapHero } from './demos/Demo1_HeroEntrance';
import { ReanimatedPulse, GsapPulse } from './demos/Demo2_PulseHeartbeat';
import { ReanimatedMarquee, GsapMarquee } from './demos/Demo3_InfiniteMarquee';
import { ReanimatedFlip, GsapFlip } from './demos/Demo4_CardFlip';
import { ReanimatedFloat, GsapFloat } from './demos/Demo5_FloatingElements';
import { ReanimatedModal, GsapModal } from './demos/Demo6_PopupModal';
import { ReanimatedCounter, GsapCounter } from './demos/Demo7_CounterNumbers';
import { ReanimatedConfetti, GsapConfetti } from './demos/Demo8_SuccessConfetti';
import { ReanimatedSticky, GsapSticky } from './demos/Demo9_StickyHeader';
import { ReanimatedLike, GsapLike } from './demos/Demo10_LikeButton';
import { ReanimatedRollingCounter, GsapRollingCounter } from './demos/Demo11_RollingNumbers';

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Animation Demos</h1>
      <p>Select a demo from the sidebar to view Reanimated v3 and GSAP implementations.</p>
    </div>
  );
}

function App() {
  const demos = [
    {
      id: 1,
      title: 'Hero Entrance',
      desc: 'Staggered fade-in & slide-up for Title/Subtitle/Button.',
      reanimated: ReanimatedHero,
      gsap: GsapHero
    },
    {
      id: 2,
      title: 'Pulse/Heartbeat',
      desc: 'Attention-grabbing CTA button.',
      reanimated: ReanimatedPulse,
      gsap: GsapPulse
    },
    {
      id: 3,
      title: 'Infinite Marquee',
      desc: 'Continuous scrolling text/images (common in branding).',
      reanimated: ReanimatedMarquee,
      gsap: GsapMarquee
    },
    {
      id: 4,
      title: 'Card Flip',
      desc: 'Product details reveal.',
      reanimated: ReanimatedFlip,
      gsap: GsapFlip
    },
    {
      id: 5,
      title: 'Floating Elements',
      desc: 'Background decor (balloons/confetti) moving gently.',
      reanimated: ReanimatedFloat,
      gsap: GsapFloat
    },
    {
      id: 6,
      title: 'Pop-up/Modal',
      desc: 'Smooth scale-in and backdrop fade.',
      reanimated: ReanimatedModal,
      gsap: GsapModal
    },
    {
      id: 7,
      title: 'Counter/Numbers',
      desc: 'Animated number increment (e.g., "1,000,000 Users").',
      reanimated: ReanimatedCounter,
      gsap: GsapCounter
    },
    {
      id: 8,
      title: 'Success/Confetti',
      desc: 'Simple particle explosion effect.',
      reanimated: ReanimatedConfetti,
      gsap: GsapConfetti
    },
    {
      id: 9,
      title: 'Sticky/Hide Header',
      desc: 'React to scroll direction (simulate scroll view).',
      reanimated: ReanimatedSticky,
      gsap: GsapSticky
    },
    {
      id: 10,
      title: 'Like/Favorite',
      desc: 'Micro-interaction with scale bounce.',
      reanimated: ReanimatedLike,
      gsap: GsapLike
    },
    {
      id: 11,
      title: 'Rolling Numbers',
      desc: 'Vertical odometer-style digit rolling.',
      reanimated: ReanimatedRollingCounter,
      gsap: GsapRollingCounter
    },
  ];

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {demos.map((demo) => (
            <Route
              key={demo.id}
              path={`/demo/${demo.id}`}
              element={
                <DemoWrapper
                  title={`${demo.id}. ${demo.title}`}
                  description={demo.desc}
                  ReanimatedComponent={demo.reanimated}
                  GsapComponent={demo.gsap}
                />
              }
            />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

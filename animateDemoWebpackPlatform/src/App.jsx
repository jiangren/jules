import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import DemoWrapper from './components/DemoWrapper';

// Existing Demos
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
      <p>Select a demo from the sidebar to view Reanimated v3 and GSAP implementations side-by-side.</p>
    </div>
  );
}

// Basic Animations
import { ReanimatedFade, GsapFade, ReanimatedSlideX, GsapSlideX, ReanimatedSlideY, GsapSlideY, ReanimatedScale, GsapScale, ReanimatedRotate, GsapRotate } from './demos/basic/Demos11_15';
import { ReanimatedSkew, GsapSkew, ReanimatedColor, GsapColor, ReanimatedBorderRadius, GsapBorderRadius, ReanimatedSpring, GsapSpring, ReanimatedEasings, GsapEasings } from './demos/basic/Demos16_20';

// Complex Timelines
import { ReanimatedSplash, GsapSplash } from './demos/complex/Demo21_Splash';
import { ReanimatedCart, GsapCart } from './demos/complex/Demo22_Cart';
import { ReanimatedReward, GsapReward } from './demos/complex/Demo23_Reward';
import { ReanimatedSubmit, GsapSubmit } from './demos/complex/Demo24_FormSubmit';
import { ReanimatedToast, GsapToast } from './demos/complex/Demo25_Toast';

function App() {
  const categories = [
    {
      name: "Marketing Combinations",
      demos: [
        { id: 1, path: '/marketing-combinations/1', title: 'Hero Entrance', desc: 'Staggered fade-in & slide-up for Title/Subtitle/Button.', reanimated: ReanimatedHero, gsap: GsapHero },
        { id: 2, path: '/marketing-combinations/2', title: 'Pulse/Heartbeat', desc: 'Attention-grabbing CTA button.', reanimated: ReanimatedPulse, gsap: GsapPulse },
        { id: 3, path: '/marketing-combinations/3', title: 'Infinite Marquee', desc: 'Continuous scrolling text/images.', reanimated: ReanimatedMarquee, gsap: GsapMarquee },
        { id: 4, path: '/marketing-combinations/4', title: 'Card Flip', desc: 'Product details reveal.', reanimated: ReanimatedFlip, gsap: GsapFlip },
        { id: 5, path: '/marketing-combinations/5', title: 'Floating Elements', desc: 'Background decor moving gently.', reanimated: ReanimatedFloat, gsap: GsapFloat },
        { id: 6, path: '/marketing-combinations/6', title: 'Pop-up/Modal', desc: 'Smooth scale-in and backdrop fade.', reanimated: ReanimatedModal, gsap: GsapModal },
        { id: 7, path: '/marketing-combinations/7', title: 'Counter/Numbers', desc: 'Animated number increment.', reanimated: ReanimatedCounter, gsap: GsapCounter },
        { id: 8, path: '/marketing-combinations/8', title: 'Success/Confetti', desc: 'Simple particle explosion effect.', reanimated: ReanimatedConfetti, gsap: GsapConfetti },
        { id: 9, path: '/marketing-combinations/9', title: 'Sticky/Hide Header', desc: 'React to scroll direction.', reanimated: ReanimatedSticky, gsap: GsapSticky },
        { id: 10, path: '/marketing-combinations/10', title: 'Like/Favorite', desc: 'Micro-interaction with scale bounce.', reanimated: ReanimatedLike, gsap: GsapLike },
        { id: 11, path: '/marketing-combinations/11', title: 'Rolling Numbers', desc: 'Vertical odometer-style digit rolling.', reanimated: ReanimatedRollingCounter, gsap: GsapRollingCounter },
      ]
    },
    {
      name: "Basic Animations",
      demos: [
        { id: 12, path: '/basic-animations/12', title: 'Fade In/Out', desc: 'Opacity transition.', reanimated: ReanimatedFade, gsap: GsapFade },
        { id: 13, path: '/basic-animations/13', title: 'Slide X', desc: 'Horizontal translation.', reanimated: ReanimatedSlideX, gsap: GsapSlideX },
        { id: 14, path: '/basic-animations/14', title: 'Slide Y', desc: 'Vertical translation.', reanimated: ReanimatedSlideY, gsap: GsapSlideY },
        { id: 15, path: '/basic-animations/15', title: 'Scale', desc: 'Size transform.', reanimated: ReanimatedScale, gsap: GsapScale },
        { id: 16, path: '/basic-animations/16', title: 'Rotate', desc: 'Angular rotation.', reanimated: ReanimatedRotate, gsap: GsapRotate },
        { id: 17, path: '/basic-animations/17', title: 'Skew', desc: 'Shear distortion.', reanimated: ReanimatedSkew, gsap: GsapSkew },
        { id: 18, path: '/basic-animations/18', title: 'Color Transition', desc: 'Background color interpolation.', reanimated: ReanimatedColor, gsap: GsapColor },
        { id: 19, path: '/basic-animations/19', title: 'Border Radius', desc: 'Shape morphing.', reanimated: ReanimatedBorderRadius, gsap: GsapBorderRadius },
        { id: 20, path: '/basic-animations/20', title: 'Spring Physics', desc: 'Natural bouncy movement.', reanimated: ReanimatedSpring, gsap: GsapSpring },
        { id: 21, path: '/basic-animations/21', title: 'Easings', desc: 'Different timing functions.', reanimated: ReanimatedEasings, gsap: GsapEasings },
      ]
    },
    {
      name: "Timeline Sequences",
      demos: [
        { id: 22, path: '/timeline-sequences/22', title: 'Splash to Home', desc: 'Sequential app startup animation.', reanimated: ReanimatedSplash, gsap: GsapSplash },
        { id: 23, path: '/timeline-sequences/23', title: 'Add to Cart', desc: 'Complex shopping cart interaction.', reanimated: ReanimatedCart, gsap: GsapCart },
        { id: 24, path: '/timeline-sequences/24', title: 'Reward Unlock', desc: 'Loot box opening sequence.', reanimated: ReanimatedReward, gsap: GsapReward },
        { id: 25, path: '/timeline-sequences/25', title: 'Form Submit', desc: 'Button to loading to success morph.', reanimated: ReanimatedSubmit, gsap: GsapSubmit },
        { id: 26, path: '/timeline-sequences/26', title: 'Toast Notification', desc: 'Enter, countdown, exit sequence.', reanimated: ReanimatedToast, gsap: GsapToast },
      ]
    }
  ];

  const allDemos = categories.flatMap(c => c.demos);

  return (
    <BrowserRouter>
      <Layout categories={categories}>
        <Routes>
          <Route path="/" element={<Home />} />
          {allDemos.map((demo) => (
            <Route
              key={demo.id}
              path={demo.path}
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

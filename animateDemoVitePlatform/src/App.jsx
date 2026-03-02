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
        { id: 1, path: '/demo/1', title: 'Hero Entrance', desc: 'Staggered fade-in & slide-up for Title/Subtitle/Button.', reanimated: ReanimatedHero, gsap: GsapHero },
        { id: 2, path: '/demo/2', title: 'Pulse/Heartbeat', desc: 'Attention-grabbing CTA button.', reanimated: ReanimatedPulse, gsap: GsapPulse },
        { id: 3, path: '/demo/3', title: 'Infinite Marquee', desc: 'Continuous scrolling text/images.', reanimated: ReanimatedMarquee, gsap: GsapMarquee },
        { id: 4, path: '/demo/4', title: 'Card Flip', desc: 'Product details reveal.', reanimated: ReanimatedFlip, gsap: GsapFlip },
        { id: 5, path: '/demo/5', title: 'Floating Elements', desc: 'Background decor moving gently.', reanimated: ReanimatedFloat, gsap: GsapFloat },
        { id: 6, path: '/demo/6', title: 'Pop-up/Modal', desc: 'Smooth scale-in and backdrop fade.', reanimated: ReanimatedModal, gsap: GsapModal },
        { id: 7, path: '/demo/7', title: 'Counter/Numbers', desc: 'Animated number increment.', reanimated: ReanimatedCounter, gsap: GsapCounter },
        { id: 8, path: '/demo/8', title: 'Success/Confetti', desc: 'Simple particle explosion effect.', reanimated: ReanimatedConfetti, gsap: GsapConfetti },
        { id: 9, path: '/demo/9', title: 'Sticky/Hide Header', desc: 'React to scroll direction.', reanimated: ReanimatedSticky, gsap: GsapSticky },
        { id: 10, path: '/demo/10', title: 'Like/Favorite', desc: 'Micro-interaction with scale bounce.', reanimated: ReanimatedLike, gsap: GsapLike },
      ]
    },
    {
      name: "Basic Animations",
      demos: [
        { id: 11, path: '/demo/11', title: 'Fade In/Out', desc: 'Opacity transition.', reanimated: ReanimatedFade, gsap: GsapFade },
        { id: 12, path: '/demo/12', title: 'Slide X', desc: 'Horizontal translation.', reanimated: ReanimatedSlideX, gsap: GsapSlideX },
        { id: 13, path: '/demo/13', title: 'Slide Y', desc: 'Vertical translation.', reanimated: ReanimatedSlideY, gsap: GsapSlideY },
        { id: 14, path: '/demo/14', title: 'Scale', desc: 'Size transform.', reanimated: ReanimatedScale, gsap: GsapScale },
        { id: 15, path: '/demo/15', title: 'Rotate', desc: 'Angular rotation.', reanimated: ReanimatedRotate, gsap: GsapRotate },
        { id: 16, path: '/demo/16', title: 'Skew', desc: 'Shear distortion.', reanimated: ReanimatedSkew, gsap: GsapSkew },
        { id: 17, path: '/demo/17', title: 'Color Transition', desc: 'Background color interpolation.', reanimated: ReanimatedColor, gsap: GsapColor },
        { id: 18, path: '/demo/18', title: 'Border Radius', desc: 'Shape morphing.', reanimated: ReanimatedBorderRadius, gsap: GsapBorderRadius },
        { id: 19, path: '/demo/19', title: 'Spring Physics', desc: 'Natural bouncy movement.', reanimated: ReanimatedSpring, gsap: GsapSpring },
        { id: 20, path: '/demo/20', title: 'Easings', desc: 'Different timing functions.', reanimated: ReanimatedEasings, gsap: GsapEasings },
      ]
    },
    {
      name: "Timeline Sequences",
      demos: [
        { id: 21, path: '/demo/21', title: 'Splash to Home', desc: 'Sequential app startup animation.', reanimated: ReanimatedSplash, gsap: GsapSplash },
        { id: 22, path: '/demo/22', title: 'Add to Cart', desc: 'Complex shopping cart interaction.', reanimated: ReanimatedCart, gsap: GsapCart },
        { id: 23, path: '/demo/23', title: 'Reward Unlock', desc: 'Loot box opening sequence.', reanimated: ReanimatedReward, gsap: GsapReward },
        { id: 24, path: '/demo/24', title: 'Form Submit', desc: 'Button to loading to success morph.', reanimated: ReanimatedSubmit, gsap: GsapSubmit },
        { id: 25, path: '/demo/25', title: 'Toast Notification', desc: 'Enter, countdown, exit sequence.', reanimated: ReanimatedToast, gsap: GsapToast },
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

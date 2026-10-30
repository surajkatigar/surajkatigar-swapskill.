import React from 'react';
import { AnimatedTopDock } from '../shaders/animated-top-dock/AnimatedTopDock';
import '../shaders/threeui.css';

export function Scene() {
  return (
    <div className="shader-frame">
      <AnimatedTopDock
        variant="modern"
        proximity={122}
        spring={0.19}
        damping={0.70}
        widthGrowth={17}
        heightGrowth={16}
        drop={3.5}
      />
    </div>
  );
}

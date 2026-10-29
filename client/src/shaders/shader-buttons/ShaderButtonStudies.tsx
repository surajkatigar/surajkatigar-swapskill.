import React from 'react';
import type { NeuformIsolatedEffectProps } from '../neuform-isolated/NeuformIsolatedEffects';

export type ShaderButtonStudyVariant =
  | 'liquid-glass'
  | 'intelligence'
  | 'holo-foil'
  | 'particles'
  | 'voice-orb'
  | 'water'
  | 'dither-hold'
  | 'lava-lamp'
  | 'gold'
  | 'ink';

export function ShaderButtonStudy({
  variant,
  ...props
}: NeuformIsolatedEffectProps & { variant: ShaderButtonStudyVariant }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 24px',
        borderRadius: '9999px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff',
        fontFamily: 'inherit',
      }}
      {...props}
    >
      <span>{variant}</span>
    </div>
  );
}

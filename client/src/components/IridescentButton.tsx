import React, { Suspense } from 'react';
import { ShaderButtons } from '../shaders/shader-buttons/ShaderButtons';

interface IridescentButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  hue?: number;
  saturation?: number;
  brightness?: number;
}

export const IridescentButton: React.FC<IridescentButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  style,
  hue = 0,
  saturation = 1.0,
  brightness = 1.0,
}) => {
  const inner = (
    <div
      className={`iridescent-btn-wrap ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {/* Shader canvas layer — pointer-events:none so clicks pass through */}
      <Suspense fallback={null}>
        <ShaderButtons
          variant="iridescent-glass"
          mode="dark"
          hue={hue}
          saturation={saturation}
          brightness={brightness}
        />
      </Suspense>
      {/* Text overlay centred on top */}
      {children && (
        <span className="iridescent-btn-label">{children}</span>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="iridescent-btn-anchor">
        {inner}
      </a>
    );
  }

  return inner;
};

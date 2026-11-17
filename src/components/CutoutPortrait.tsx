import React, { useEffect, useState } from 'react';
import { applyBorderSeededCutout } from '../utils/portfolioLogic';

interface CutoutPortraitProps {
  src: string;
  alt: string;
  enableCutout?: boolean;
  className?: string;
}

export const CutoutPortrait: React.FC<CutoutPortraitProps> = ({
  src,
  alt,
  enableCutout = true,
  className = '',
}) => {
  const [processedDataUrl, setProcessedDataUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    if (!enableCutout) {
      setProcessedDataUrl(null);
      return;
    }

    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isCancelled) return;
      try {
        const canvas = document.createElement('canvas');
        const width = img.naturalWidth || 900;
        const height = img.naturalHeight || 1200;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        applyBorderSeededCutout(imageData.data, width, height, 28, 45);
        ctx.putImageData(imageData, 0, 0);

        const url = canvas.toDataURL('image/png');
        if (!isCancelled) {
          setProcessedDataUrl(url);
        }
      } catch {
        setProcessedDataUrl(null);
      }
    };

    img.onerror = () => {
      if (!isCancelled) {
        setImageError(true);
      }
    };

    img.src = src;

    return () => {
      isCancelled = true;
    };
  }, [src, enableCutout]);

  if (imageError) {
    return (
      <div
        className={`flex flex-col items-center justify-end bg-gradient-to-t from-[#0b0d10] via-[#141820]/80 to-transparent p-8 text-center ${className}`}
        data-testid="portrait-fallback"
      >
        <div className="h-64 w-64 rounded-full bg-[#5c85b8]/20 blur-3xl" />
        <p className="font-serif-display text-xl text-[#7aa2d4]">{alt}</p>
      </div>
    );
  }

  return (
    <div className={`relative select-none ${className}`} data-testid="ultron-cutout-container">
      {/* Subtle radial steel-blue atmospheric glow behind Ultron's head and shoulders */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[14%] left-1/2 -z-10 h-[390px] w-[420px] -translate-x-1/2 rounded-full opacity-55 blur-[95px]"
        style={{
          background: 'radial-gradient(circle, rgba(92, 133, 184, 0.42) 0%, rgba(33, 63, 102, 0.18) 55%, transparent 78%)',
        }}
      />

      <img
        src={enableCutout && processedDataUrl ? processedDataUrl : src}
        alt={alt}
        referrerPolicy="no-referrer"
        data-cutout-ready={processedDataUrl ? 'true' : 'false'}
        className="h-full w-full object-contain object-bottom drop-shadow-[0_18px_48px_rgba(0,0,0,0.85)] transition-opacity duration-300"
      />

      {/* Bottom gradient fade into #0b0d10 primary obsidian canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/80 to-transparent"
      />
    </div>
  );
};

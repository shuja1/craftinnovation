import { useState } from 'react';
import { Compass } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  eager?: boolean;
}

export function SafeImage({
  src,
  alt,
  title,
  className = '',
  eager = false,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-6 overflow-hidden ${className}`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center gap-2 max-w-xs">
          <Compass className="w-7 h-7 text-amber-500" aria-hidden="true" />
          <span className="text-sm font-medium text-slate-100">
            {title || 'Craft Innovation Contracting'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

import React from 'react';

interface Props {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  /** Optional: Hier kannst du Tailwinds object-position Klassen übergeben, z.B. "object-[center_60%]" */
  imagePositionClass?: string;
}

export default function HeroImage({ src, alt, title, subtitle, imagePositionClass = "object-center" }: Props) {
  return (
    <div className="relative w-full h-[260px] sm:h-[340px] md:h-[380px] lg:h-[460px] rounded-3xl overflow-hidden shadow-sm shrink-0">
      <img 
        src={src} 
        alt={alt} 
        className={`absolute inset-0 w-full h-full object-cover ${imagePositionClass}`}
      />
      {/* Weicher Gradient, damit der Text immer gut lesbar bleibt */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent flex flex-col justify-end p-6 sm:p-10 pb-16 sm:pb-24 md:pb-28">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-2 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="hidden sm:block text-white text-sm sm:text-base md:text-xl max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
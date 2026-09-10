export function StarryBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 28% 8%, rgba(251,191,36,0.9), transparent),
            radial-gradient(1.5px 1.5px at 45% 22%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 62% 12%, rgba(255,255,255,0.85), transparent),
            radial-gradient(1.5px 1.5px at 78% 28%, rgba(251,191,36,0.7), transparent),
            radial-gradient(1px 1px at 88% 10%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 18% 40%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1.5px 1.5px at 55% 5%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 70% 42%, rgba(255,255,255,0.45), transparent),
            linear-gradient(180deg, #0b1224 0%, #0f172a 55%, #0a1f14 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 opacity-40"
        style={{
          background: `
            linear-gradient(to top, rgba(15,23,42,0.95), transparent),
            radial-gradient(ellipse 40% 60% at 15% 100%, #14532d 0%, transparent 70%),
            radial-gradient(ellipse 35% 55% at 40% 100%, #166534 0%, transparent 70%),
            radial-gradient(ellipse 45% 65% at 70% 100%, #14532d 0%, transparent 70%),
            radial-gradient(ellipse 30% 50% at 90% 100%, #166534 0%, transparent 70%)
          `,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  isNode: boolean; // Some particles are larger "nodes"
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 80;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isNode = Math.random() > 0.85;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: isNode ? Math.random() * 3 + 1.5 : Math.random() * 1.5 + 0.5,
        alpha: isNode ? Math.random() * 0.4 + 0.2 : Math.random() * 0.2 + 0.05,
        color: isNode 
          ? (Math.random() > 0.5 ? '#3b82f6' : '#60a5fa') // Blue nodes
          : '#94a3b8', // Slate dust
        isNode,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Node Glow
        if (p.isNode) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Connections (Neural/Data Network feel)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect if one is a node or if they are very close
          const maxDist = (p.isNode || p2.isNode) ? 140 : 80;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Pulsing connection alpha
            const pulse = (Math.sin(Date.now() / 1500) + 1) / 2;
            const alphaFactor = (1 - dist / maxDist) * 0.1;
            
            ctx.strokeStyle = p.isNode ? '#3b82f6' : '#94a3b8';
            ctx.globalAlpha = alphaFactor * (p.isNode ? 1 : 0.5) * (0.8 + pulse * 0.2);
            ctx.lineWidth = p.isNode ? 0.8 : 0.4;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

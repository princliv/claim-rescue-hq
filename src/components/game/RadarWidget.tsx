import { motion } from 'framer-motion';

interface Props {
  size?: number;
}

export default function RadarWidget({ size = 120 }: Props) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Rings */}
      {[1, 0.66, 0.33].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-primary/10"
          style={{
            width: size * scale,
            height: size * scale,
            top: (size - size * scale) / 2,
            left: (size - size * scale) / 2,
          }}
        />
      ))}
      {/* Crosshair */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-primary/10" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-primary/10" />
      {/* Sweep */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full animate-radar"
        style={{ transformOrigin: '50% 50%' }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-px"
          style={{
            background: 'linear-gradient(90deg, hsl(163 100% 50% / 0.5), transparent)',
            transformOrigin: 'left center',
          }}
        />
      </motion.div>
      {/* Blips */}
      {[
        { x: 30, y: 25 },
        { x: 70, y: 60 },
        { x: 50, y: 80 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, delay: i * 1, repeat: Infinity }}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            boxShadow: '0 0 6px hsl(163 100% 50% / 0.6)',
          }}
        />
      ))}
    </div>
  );
}

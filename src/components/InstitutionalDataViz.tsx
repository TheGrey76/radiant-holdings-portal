import { motion } from 'framer-motion';

/**
 * Subtle animated data visualization background.
 * Used on institutional pages to convey AI/innovation without being overt.
 * Renders animated nodes and connecting lines resembling a neural network.
 */
const InstitutionalDataViz = ({ className = '' }: { className?: string }) => {
  const nodes = [
    { cx: 80, cy: 120, delay: 0 },
    { cx: 220, cy: 80, delay: 0.3 },
    { cx: 360, cy: 160, delay: 0.6 },
    { cx: 500, cy: 60, delay: 0.9 },
    { cx: 640, cy: 140, delay: 1.2 },
    { cx: 780, cy: 100, delay: 0.4 },
    { cx: 150, cy: 240, delay: 0.7 },
    { cx: 420, cy: 280, delay: 1.0 },
    { cx: 600, cy: 260, delay: 0.5 },
    { cx: 300, cy: 320, delay: 0.8 },
    { cx: 720, cy: 300, delay: 1.1 },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [0, 6], [6, 9], [2, 7], [7, 8], [8, 10],
    [1, 6], [3, 7], [5, 10], [9, 7],
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connecting lines */}
        {connections.map(([from, to], i) => (
          <motion.line
            key={`line-${i}`}
            x1={nodes[from].cx}
            y1={nodes[from].cy}
            x2={nodes[to].cx}
            y2={nodes[to].cy}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-white/[0.06]"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              delay: Math.min(nodes[from].delay, nodes[to].delay) + 0.5,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Data nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.cx}
            cy={node.cy}
            r="3"
            className="text-accent"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{
              duration: 1,
              delay: node.delay + 0.5,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Animated pulse on select nodes */}
        {[0, 2, 4, 7, 10].map((idx) => (
          <motion.circle
            key={`pulse-${idx}`}
            cx={nodes[idx].cx}
            cy={nodes[idx].cy}
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-accent"
            initial={{ opacity: 0, r: 3 }}
            animate={{
              opacity: [0, 0.4, 0],
              r: [3, 12, 20],
            }}
            transition={{
              duration: 3,
              delay: nodes[idx].delay + 2,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default InstitutionalDataViz;

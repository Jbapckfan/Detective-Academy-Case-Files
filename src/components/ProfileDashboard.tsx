import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface Props {
  onBack: () => void;
}

function ProfileDashboardComponent({ onBack }: Props) {
  const { profiles, user, companion } = useGameStore();

  const skills = useMemo(() => [
    { key: 'patterns', label: 'Pattern Recognition', color: '#ef4444' },
    { key: 'spatial', label: 'Spatial Reasoning', color: '#3b82f6' },
    { key: 'logic', label: 'Logic & Deduction', color: '#10b981' },
    { key: 'lateral', label: 'Lateral Thinking', color: '#f59e0b' },
    { key: 'sequencing', label: 'Sequential Planning', color: '#a855f7' }
  ] as const, []);

  const maxValue = useMemo(() => Math.max(...Object.values(profiles)), [profiles]);
  const avgValue = useMemo(() => Object.values(profiles).reduce((a, b) => a + b, 0) / 5, [profiles]);

  const polarToCartesian = useMemo(() => (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }, []);

  const createRadarPath = useMemo(() => {
    const center = 150;
    const maxRadius = 120;
    const angleStep = 360 / skills.length;

    const points = skills.map((skill, index) => {
      const value = profiles[skill.key];
      const radius = (value / 100) * maxRadius;
      const angle = angleStep * index;
      return polarToCartesian(center, center, radius, angle);
    });

    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  }, [skills, profiles, polarToCartesian]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-gray-700"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} />
          Back to Menu
        </motion.button>

        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {user?.username}'s Progress
            </h1>
            <p className="text-gray-600">
              Track your cognitive development across all puzzle types
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex justify-center items-center">
              <svg width="300" height="300" viewBox="0 0 300 300">
                {[20, 40, 60, 80, 100].map((level, i) => {
                  const radius = (level / 100) * 120;
                  const angleStep = 360 / skills.length;

                  const points = skills.map((_, index) => {
                    const angle = angleStep * index;
                    return polarToCartesian(150, 150, radius, angle);
                  });

                  return (
                    <polygon
                      key={i}
                      points={points.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  );
                })}

                {skills.map((skill, index) => {
                  const angle = (360 / skills.length) * index;
                  const point = polarToCartesian(150, 150, 120, angle);
                  const labelPoint = polarToCartesian(150, 150, 145, angle);

                  return (
                    <g key={skill.key}>
                      <line
                        x1="150"
                        y1="150"
                        x2={point.x}
                        y2={point.y}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-600"
                      >
                        {skill.label.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                <motion.path
                  d={createRadarPath}
                  fill="rgba(99, 102, 241, 0.3)"
                  stroke="#6366f1"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />

                {skills.map((skill, index) => {
                  const value = profiles[skill.key];
                  const radius = (value / 100) * 120;
                  const angle = (360 / skills.length) * index;
                  const point = polarToCartesian(150, 150, radius, angle);

                  return (
                    <motion.circle
                      key={skill.key}
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill={skill.color}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 1.5 }}
                    />
                  );
                })}
              </svg>
            </div>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.key}
                  className="space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{skill.label}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round(profiles[skill.key])}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: skill.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${profiles[skill.key]}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-indigo-600 font-semibold mb-1">Average Score</div>
              <div className="text-3xl font-bold text-indigo-900">
                {Math.round(avgValue)}
              </div>
              <div className="text-sm text-indigo-600 mt-1">Across all skills</div>
            </motion.div>

            <motion.div
              className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-green-600 font-semibold mb-1">Companion Level</div>
              <div className="text-3xl font-bold text-green-900">
                {companion?.level || 1}
              </div>
              <div className="text-sm text-green-600 mt-1">Keep playing to level up!</div>
            </motion.div>

            <motion.div
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <div className="text-purple-600 font-semibold mb-1">Top Skill</div>
              <div className="text-3xl font-bold text-purple-900">
                {skills.find(s => profiles[s.key] === maxValue)?.label.split(' ')[0] || 'Unknown'}
              </div>
              <div className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                <TrendingUp size={14} />
                Your strongest area
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="font-semibold text-blue-900 mb-2">How You're Doing</h3>
            <p className="text-sm text-blue-800">
              {avgValue >= 70
                ? "You're mastering these puzzles! Your cognitive skills are highly developed across all areas."
                : avgValue >= 50
                ? "Great progress! You're building strong cognitive skills. Keep challenging yourself!"
                : "You're just getting started! Every puzzle helps you improve. Keep going!"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export { ProfileDashboardComponent as ProfileDashboard };

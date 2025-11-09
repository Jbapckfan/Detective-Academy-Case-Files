import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, Clock, Target, Award, Zap, Calendar, Trophy, BarChart3 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { storage } from '../lib/supabase';
import type { Session, PuzzleAttempt } from '../types';

interface Props {
  onBack: () => void;
}

interface PersonalRecord {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  totalPuzzles: number;
  perfectSolves: number;
  averageScore: number;
  bestStreak: number;
  fastestSolve: number;
  totalPlayTime: number;
}

function ProfileDashboardComponent({ onBack }: Props) {
  const { profiles, user, companion } = useGameStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'records'>('overview');

  const skills = useMemo(() => [
    { key: 'patterns', label: 'Pattern Recognition', color: '#ef4444' },
    { key: 'spatial', label: 'Spatial Reasoning', color: '#3b82f6' },
    { key: 'logic', label: 'Logic & Deduction', color: '#10b981' },
    { key: 'lateral', label: 'Lateral Thinking', color: '#f59e0b' },
    { key: 'sequencing', label: 'Sequential Planning', color: '#a855f7' }
  ] as const, []);

  const maxValue = useMemo(() => Math.max(...Object.values(profiles)), [profiles]);
  const avgValue = useMemo(() => Object.values(profiles).reduce((a, b) => a + b, 0) / 5, [profiles]);

  // Load session data and calculate statistics
  const sessionStats = useMemo((): SessionStats => {
    const data = storage.getData();
    const sessions = data.sessions || [];
    const attempts = data.puzzleAttempts || [];

    const completedSessions = sessions.filter((s: Session) => s.completedAt).length;
    const totalPuzzles = attempts.filter((a: any) => a.solved).length;
    const perfectSolves = attempts.filter(
      (a: any) => a.solved && a.hints_used === 0 && a.attempts_used === 0
    ).length;

    const totalScore = attempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0);
    const averageScore = attempts.length > 0 ? totalScore / attempts.length : 0;

    // Calculate fastest solve time
    const solvedAttempts = attempts.filter((a: any) => a.solved && a.time_taken > 0);
    const fastestSolve = solvedAttempts.length > 0
      ? Math.min(...solvedAttempts.map((a: any) => a.time_taken))
      : 0;

    // Calculate total play time
    const totalPlayTime = sessions.reduce((sum: number, s: Session) => {
      if (s.completedAt) {
        const start = new Date(s.startedAt).getTime();
        const end = new Date(s.completedAt).getTime();
        return sum + (end - start);
      }
      return sum;
    }, 0);

    return {
      totalSessions: sessions.length,
      completedSessions,
      totalPuzzles,
      perfectSolves,
      averageScore: Math.round(averageScore),
      bestStreak: 0, // Can be calculated with date tracking
      fastestSolve,
      totalPlayTime
    };
  }, []);

  // Load recent sessions
  const recentSessions = useMemo(() => {
    const data = storage.getData();
    const sessions = data.sessions || [];
    return sessions
      .filter((s: Session) => s.completedAt)
      .sort((a: Session, b: Session) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
      )
      .slice(0, 10);
  }, []);

  // Calculate personal records
  const personalRecords = useMemo((): PersonalRecord[] => {
    const data = storage.getData();
    const attempts = data.puzzleAttempts || [];

    const solvedAttempts = attempts.filter((a: any) => a.solved);
    const perfectSolves = attempts.filter(
      (a: any) => a.solved && a.hints_used === 0 && a.attempts_used === 0
    );

    const highestScore = solvedAttempts.length > 0
      ? Math.max(...solvedAttempts.map((a: any) => a.score || 0))
      : 0;

    const fastestTime = solvedAttempts.length > 0
      ? Math.min(...solvedAttempts.map((a: any) => a.time_taken))
      : 0;

    const totalPlayTime = sessionStats.totalPlayTime;
    const hours = Math.floor(totalPlayTime / (1000 * 60 * 60));
    const minutes = Math.floor((totalPlayTime % (1000 * 60 * 60)) / (1000 * 60));

    return [
      {
        label: 'Highest Score',
        value: highestScore.toString(),
        icon: <Trophy className="w-5 h-5" />,
        color: 'from-amber-500 to-yellow-500'
      },
      {
        label: 'Perfect Solves',
        value: perfectSolves.length.toString(),
        icon: <Target className="w-5 h-5" />,
        color: 'from-purple-500 to-pink-500'
      },
      {
        label: 'Fastest Solve',
        value: fastestTime > 0 ? `${fastestTime}s` : 'N/A',
        icon: <Zap className="w-5 h-5" />,
        color: 'from-yellow-500 to-orange-500'
      },
      {
        label: 'Total Puzzles',
        value: sessionStats.totalPuzzles.toString(),
        icon: <Award className="w-5 h-5" />,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        label: 'Cases Solved',
        value: sessionStats.completedSessions.toString(),
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-green-500 to-emerald-500'
      },
      {
        label: 'Play Time',
        value: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
        icon: <Clock className="w-5 h-5" />,
        color: 'from-indigo-500 to-violet-500'
      }
    ];
  }, [sessionStats]);

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
      <div className="max-w-7xl mx-auto">
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
              Track your cognitive development and detective career
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'records'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Trophy size={18} />
                Records
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                activeTab === 'history'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                History
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >

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
            )}

            {activeTab === 'records' && (
              <motion.div
                key="records"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Records</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personalRecords.map((record, index) => (
                    <motion.div
                      key={record.label}
                      className={`p-6 bg-gradient-to-br ${record.color} rounded-2xl text-white shadow-lg`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {record.icon}
                        <h3 className="font-semibold text-sm opacity-90">{record.label}</h3>
                      </div>
                      <div className="text-4xl font-bold mb-1">{record.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Statistics Overview */}
                <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 size={24} />
                    Statistics Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {sessionStats.totalSessions > 0
                          ? Math.round((sessionStats.completedSessions / sessionStats.totalSessions) * 100)
                          : 0}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Perfect Rate</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {sessionStats.totalPuzzles > 0
                          ? Math.round((sessionStats.perfectSolves / sessionStats.totalPuzzles) * 100)
                          : 0}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Avg Score</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {sessionStats.averageScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {sessionStats.totalSessions}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Session History</h2>
                {recentSessions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No completed sessions yet. Start solving cases to see your history!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSessions.map((session: Session, index: number) => {
                      const startDate = new Date(session.startedAt);
                      const endDate = session.completedAt ? new Date(session.completedAt) : null;
                      const duration = endDate
                        ? Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60)
                        : 0;
                      const avgScore = session.attempts.length > 0
                        ? Math.round(session.totalScore / session.attempts.length)
                        : 0;

                      return (
                        <motion.div
                          key={session.id}
                          className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Case #{session.zoneId}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              <Trophy size={16} />
                              Completed
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-indigo-500" />
                              <div>
                                <div className="text-xs text-gray-500">Puzzles</div>
                                <div className="text-sm font-bold text-gray-900">
                                  {session.puzzlesCompleted}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-amber-500" />
                              <div>
                                <div className="text-xs text-gray-500">Avg Score</div>
                                <div className="text-sm font-bold text-gray-900">{avgScore}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <div>
                                <div className="text-xs text-gray-500">Duration</div>
                                <div className="text-sm font-bold text-gray-900">{duration}m</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-green-500" />
                              <div>
                                <div className="text-xs text-gray-500">Total Score</div>
                                <div className="text-sm font-bold text-gray-900">
                                  {session.totalScore}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export { ProfileDashboardComponent as ProfileDashboard };

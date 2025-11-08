import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ChevronRight, Fingerprint, Clock, FileText, LinkIcon, AlertCircle } from 'lucide-react';

// Investigation Types
type InvestigationType = 'fingerprint' | 'timeline' | 'document' | 'evidence-match';

interface Investigation {
  id: string;
  type: InvestigationType;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  storyContext: string;
  data: any;
  solution: any;
}

// Fingerprint pattern types
interface FingerprintCard {
  id: string;
  pattern: 'whorl' | 'loop' | 'arch';
  suspectName: string;
  details: string;
}

// Timeline event
interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  order: number; // correct position (0-indexed)
}

// Document analysis
interface DocumentQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface DocumentData {
  title: string;
  content: string;
  questions: DocumentQuestion[];
}

// Evidence matching
interface EvidenceItem {
  id: string;
  name: string;
  description: string;
}

interface EvidenceTarget {
  id: string;
  name: string;
  correctEvidenceIds: string[];
}

interface CrimeSceneProps {
  caseId: number;
  sceneDescription: string;
  investigations: Investigation[];
  onComplete: (completedInvestigations: string[]) => void;
  requiredInvestigations?: number;
}

export function CrimeScene({
  caseId,
  sceneDescription,
  investigations,
  onComplete,
  requiredInvestigations
}: CrimeSceneProps) {
  const [completedInvestigations, setCompletedInvestigations] = useState<Set<string>>(new Set());
  const [activeInvestigation, setActiveInvestigation] = useState<Investigation | null>(null);
  const [investigationState, setInvestigationState] = useState<any>(null);

  const minRequired = requiredInvestigations || Math.ceil(investigations.length * 0.7);
  const canContinue = completedInvestigations.size >= minRequired;

  const handleInvestigationComplete = (investigationId: string) => {
    setCompletedInvestigations(new Set([...completedInvestigations, investigationId]));
    setActiveInvestigation(null);
    setInvestigationState(null);
  };

  const getSceneBackground = (caseId: number): string => {
    const scenes: Record<number, string> = {
      1: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      2: 'linear-gradient(135deg, #2d0a0a 0%, #1a0505 50%, #0d0202 100%)',
      3: 'linear-gradient(135deg, #301934 0%, #1f0f28 50%, #150a1a 100%)',
      4: 'linear-gradient(135deg, #1c1c1c 0%, #0a0a0a 50%, #000000 100%)',
      5: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
    };
    return scenes[caseId] || scenes[1];
  };

  const getInvestigationIcon = (type: InvestigationType) => {
    switch (type) {
      case 'fingerprint':
        return <Fingerprint size={24} />;
      case 'timeline':
        return <Clock size={24} />;
      case 'document':
        return <FileText size={24} />;
      case 'evidence-match':
        return <LinkIcon size={24} />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'medium':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'hard':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      default:
        return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 opacity-80"
        style={{ background: getSceneBackground(caseId) }}
      />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block px-6 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
            <span className="text-amber-400 font-semibold tracking-wider text-sm uppercase">
              Crime Scene Investigation
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Active Investigations
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            {sceneDescription}
          </p>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" size={20} />
              <span className="text-white font-semibold">
                {completedInvestigations.size} / {investigations.length} investigations completed
              </span>
            </div>
            {canContinue && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-4 py-1 bg-green-500/20 border border-green-500/50 rounded-full"
              >
                <span className="text-green-400 text-sm font-semibold">
                  Ready to proceed
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Investigation List */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {investigations.map((investigation, index) => {
            const isCompleted = completedInvestigations.has(investigation.id);

            return (
              <motion.div
                key={investigation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-slate-800/60 backdrop-blur-sm border-2 rounded-xl p-6 transition-all ${
                  isCompleted
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-slate-700/50 hover:border-amber-500/50 cursor-pointer'
                }`}
                onClick={() => !isCompleted && setActiveInvestigation(investigation)}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <CheckCircle className="text-white" size={24} />
                    </motion.div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {getInvestigationIcon(investigation.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-bold text-lg">
                        {investigation.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full border uppercase font-semibold ${
                        getDifficultyColor(investigation.difficulty)
                      }`}>
                        {investigation.difficulty}
                      </span>
                    </div>

                    <p className="text-slate-400 text-sm mb-3">
                      {investigation.storyContext}
                    </p>

                    {!isCompleted && (
                      <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                        <span>Begin Investigation</span>
                        <ChevronRight size={16} />
                      </div>
                    )}

                    {isCompleted && (
                      <div className="text-green-400 text-sm font-semibold">
                        Investigation Complete
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => onComplete(Array.from(completedInvestigations))}
            disabled={!canContinue}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold text-lg hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-amber-900/30"
          >
            {canContinue
              ? 'Analyze Evidence & Continue'
              : `Complete ${minRequired - completedInvestigations.size} more investigation${minRequired - completedInvestigations.size > 1 ? 's' : ''}`
            }
          </button>
        </div>
      </div>

      {/* Investigation Mini-Game Modals */}
      <AnimatePresence>
        {activeInvestigation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActiveInvestigation(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border-2 border-amber-500/50 rounded-2xl p-8 max-w-4xl w-full shadow-2xl my-8"
            >
              {activeInvestigation.type === 'fingerprint' && (
                <FingerprintMiniGame
                  investigation={activeInvestigation}
                  onComplete={() => handleInvestigationComplete(activeInvestigation.id)}
                  onClose={() => setActiveInvestigation(null)}
                />
              )}
              {activeInvestigation.type === 'timeline' && (
                <TimelineMiniGame
                  investigation={activeInvestigation}
                  onComplete={() => handleInvestigationComplete(activeInvestigation.id)}
                  onClose={() => setActiveInvestigation(null)}
                />
              )}
              {activeInvestigation.type === 'document' && (
                <DocumentMiniGame
                  investigation={activeInvestigation}
                  onComplete={() => handleInvestigationComplete(activeInvestigation.id)}
                  onClose={() => setActiveInvestigation(null)}
                />
              )}
              {activeInvestigation.type === 'evidence-match' && (
                <EvidenceMatchMiniGame
                  investigation={activeInvestigation}
                  onComplete={() => handleInvestigationComplete(activeInvestigation.id)}
                  onClose={() => setActiveInvestigation(null)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FINGERPRINT MATCHING MINI-GAME
function FingerprintMiniGame({
  investigation,
  onComplete,
  onClose
}: {
  investigation: Investigation;
  onComplete: () => void;
  onClose: () => void;
}) {
  const evidenceFingerprint: FingerprintCard = investigation.data.evidence;
  const suspects: FingerprintCard[] = investigation.data.suspects;
  const correctSuspectId: string = investigation.solution.correctId;

  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedSuspect) return;

    const correct = selectedSuspect === correctSuspectId;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const renderFingerprint = (pattern: string, size: number = 80) => {
    const patterns = {
      whorl: (
        <svg width={size} height={size} viewBox="0 0 100 100" className="text-amber-400">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      loop: (
        <svg width={size} height={size} viewBox="0 0 100 100" className="text-amber-400">
          <path d="M20,50 Q20,20 50,20 T80,50" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M25,50 Q25,25 50,25 T75,50" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M30,50 Q30,30 50,30 T70,50" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M35,50 Q35,35 50,35 T65,50" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      arch: (
        <svg width={size} height={size} viewBox="0 0 100 100" className="text-amber-400">
          <path d="M20,80 Q50,20 80,80" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M25,80 Q50,30 75,80" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M30,80 Q50,40 70,80" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M35,80 Q50,50 65,80" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    };
    return patterns[pattern as keyof typeof patterns] || patterns.whorl;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Fingerprint className="text-amber-400" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{investigation.title}</h3>
            <p className="text-amber-400 text-sm">{investigation.storyContext}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Evidence Fingerprint */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-amber-500/30 mb-6">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="text-amber-400" size={18} />
          Evidence Fingerprint
        </h4>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            {renderFingerprint(evidenceFingerprint.pattern, 100)}
          </div>
          <div className="flex-1">
            <p className="text-slate-300 text-sm mb-2">
              <strong className="text-white">Pattern Type:</strong> {evidenceFingerprint.pattern.toUpperCase()}
            </p>
            <p className="text-slate-400 text-sm">{evidenceFingerprint.details}</p>
          </div>
        </div>
      </div>

      {/* Suspect Fingerprints */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Match to Suspect</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {suspects.map((suspect) => (
            <motion.button
              key={suspect.id}
              onClick={() => !showResult && setSelectedSuspect(suspect.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selectedSuspect === suspect.id
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-900/30'
              } ${showResult && suspect.id === correctSuspectId ? 'border-green-500 bg-green-500/10' : ''}
              ${showResult && selectedSuspect === suspect.id && suspect.id !== correctSuspectId ? 'border-red-500 bg-red-500/10' : ''}`}
              whileHover={!showResult ? { scale: 1.05 } : {}}
              whileTap={!showResult ? { scale: 0.95 } : {}}
              disabled={showResult}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  {renderFingerprint(suspect.pattern, 60)}
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">{suspect.suspectName}</p>
                  <p className="text-slate-400 text-xs">{suspect.pattern.toUpperCase()}</p>
                </div>
              </div>

              {showResult && suspect.id === correctSuspectId && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <CheckCircle className="text-white" size={20} />
                </motion.div>
              )}

              {showResult && selectedSuspect === suspect.id && suspect.id !== correctSuspectId && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <X className="text-white" size={20} />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 mb-6 ${
              isCorrect
                ? 'bg-green-500/10 border-green-500/50'
                : 'bg-red-500/10 border-red-500/50'
            }`}
          >
            <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect
                ? 'Excellent work, detective! The fingerprints match.'
                : 'Not quite. Try again and look more carefully at the patterns.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <div className="flex gap-3">
        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={!selectedSuspect}
            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit Match
          </button>
        )}
        {showResult && !isCorrect && (
          <button
            onClick={() => {
              setShowResult(false);
              setSelectedSuspect(null);
            }}
            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// TIMELINE RECONSTRUCTION MINI-GAME
function TimelineMiniGame({
  investigation,
  onComplete,
  onClose
}: {
  investigation: Investigation;
  onComplete: () => void;
  onClose: () => void;
}) {
  const events: TimelineEvent[] = investigation.data.events;
  const [orderedEvents, setOrderedEvents] = useState<TimelineEvent[]>([...events].sort(() => Math.random() - 0.5));
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedEvents];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setOrderedEvents(newOrder);
  };

  const handleSubmit = () => {
    const correct = orderedEvents.every((event, index) => event.order === index);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Clock className="text-amber-400" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{investigation.title}</h3>
            <p className="text-amber-400 text-sm">{investigation.storyContext}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-amber-500/30 mb-6">
        <p className="text-slate-300 text-sm">
          <strong className="text-amber-400">Instructions:</strong> Arrange the events in chronological order from earliest to latest. Use the arrows to move events up or down.
        </p>
      </div>

      {/* Timeline Events */}
      <div className="space-y-3 mb-6">
        {orderedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            layout
            className={`relative bg-slate-900/50 rounded-xl p-4 border-2 ${
              showResult
                ? event.order === index
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-red-500/50 bg-red-500/5'
                : 'border-slate-700'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Order Controls */}
              {!showResult && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveEvent(index, 'up')}
                    disabled={index === 0}
                    className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveEvent(index, 'down')}
                    disabled={index === orderedEvents.length - 1}
                    className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    ↓
                  </button>
                </div>
              )}

              {/* Event Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-amber-400 font-bold text-lg">{index + 1}.</span>
                  <span className="text-white font-semibold bg-slate-800 px-3 py-1 rounded-full text-sm">
                    {event.time}
                  </span>
                </div>
                <p className="text-slate-300 text-sm pl-8">{event.description}</p>
              </div>

              {/* Result Indicator */}
              {showResult && (
                <div>
                  {event.order === index ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <X className="text-red-400" size={24} />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 mb-6 ${
              isCorrect
                ? 'bg-green-500/10 border-green-500/50'
                : 'bg-red-500/10 border-red-500/50'
            }`}
          >
            <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect
                ? 'Perfect! You have successfully reconstructed the timeline.'
                : 'Not quite right. Review the times and try again.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!showResult && (
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all"
          >
            Submit Timeline
          </button>
        )}
        {showResult && !isCorrect && (
          <button
            onClick={() => setShowResult(false)}
            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// DOCUMENT ANALYSIS MINI-GAME
function DocumentMiniGame({
  investigation,
  onComplete,
  onClose
}: {
  investigation: Investigation;
  onComplete: () => void;
  onClose: () => void;
}) {
  const documentData: DocumentData = investigation.data;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(documentData.questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = documentData.questions[currentQuestionIndex];
  const allAnswered = selectedAnswers.every(answer => answer !== null);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < documentData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === documentData.questions[index].correctAnswer
    ).length;
    setScore(correctCount);
    setShowResult(true);

    if (correctCount === documentData.questions.length) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
            <FileText className="text-amber-400" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{investigation.title}</h3>
            <p className="text-amber-400 text-sm">{investigation.storyContext}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {!showResult ? (
        <>
          {/* Document Content */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-amber-500/30 mb-6 max-h-64 overflow-y-auto">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <FileText size={18} />
              {documentData.title}
            </h4>
            <div className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {documentData.content}
            </div>
          </div>

          {/* Question Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">
              Question {currentQuestionIndex + 1} of {documentData.questions.length}
            </span>
            <div className="flex gap-1">
              {documentData.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    selectedAnswers[index] !== null
                      ? 'bg-amber-400'
                      : index === currentQuestionIndex
                      ? 'bg-amber-400/50'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Question */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 mb-6">
            <h4 className="text-white font-semibold mb-4">{currentQuestion.question}</h4>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-slate-600'
                    }`}>
                      {selectedAnswers[currentQuestionIndex] === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full bg-white"
                        />
                      )}
                    </div>
                    <span className="text-slate-300 text-sm">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === documentData.questions.length - 1}
              className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Submit Analysis
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Results */}
          <div className={`p-6 rounded-xl border-2 mb-6 ${
            score === documentData.questions.length
              ? 'bg-green-500/10 border-green-500/50'
              : 'bg-amber-500/10 border-amber-500/50'
          }`}>
            <p className={`font-semibold text-lg mb-2 ${
              score === documentData.questions.length ? 'text-green-400' : 'text-amber-400'
            }`}>
              Score: {score} / {documentData.questions.length}
            </p>
            <p className="text-slate-300 text-sm">
              {score === documentData.questions.length
                ? 'Excellent analysis! You caught all the important details.'
                : 'Good work, but review the document more carefully for all details.'}
            </p>
          </div>

          {/* Answer Review */}
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {documentData.questions.map((question, qIndex) => {
              const isCorrect = selectedAnswers[qIndex] === question.correctAnswer;
              return (
                <div
                  key={qIndex}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect
                      ? 'bg-green-500/5 border-green-500/30'
                      : 'bg-red-500/5 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={18} />
                    ) : (
                      <X className="text-red-400 flex-shrink-0 mt-1" size={18} />
                    )}
                    <p className="text-white text-sm font-semibold">{question.question}</p>
                  </div>
                  <p className="text-slate-400 text-xs ml-6">
                    Correct answer: {question.options[question.correctAnswer]}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          {score !== documentData.questions.length && (
            <button
              onClick={() => {
                setShowResult(false);
                setSelectedAnswers(new Array(documentData.questions.length).fill(null));
                setCurrentQuestionIndex(0);
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all"
            >
              Try Again
            </button>
          )}
        </>
      )}
    </div>
  );
}

// EVIDENCE MATCHING MINI-GAME
function EvidenceMatchMiniGame({
  investigation,
  onComplete,
  onClose
}: {
  investigation: Investigation;
  onComplete: () => void;
  onClose: () => void;
}) {
  const evidence: EvidenceItem[] = investigation.data.evidence;
  const targets: EvidenceTarget[] = investigation.data.targets;
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleMatch = (evidenceId: string, targetId: string) => {
    setMatches(prev => ({
      ...prev,
      [evidenceId]: prev[evidenceId] === targetId ? '' : targetId
    }));
  };

  const handleSubmit = () => {
    const allCorrect = Object.entries(matches).every(([evidenceId, targetId]) => {
      const target = targets.find(t => t.id === targetId);
      return target?.correctEvidenceIds.includes(evidenceId);
    });

    const allMatched = evidence.every(e => matches[e.id]);
    const correct = allCorrect && allMatched;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
            <LinkIcon className="text-amber-400" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{investigation.title}</h3>
            <p className="text-amber-400 text-sm">{investigation.storyContext}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-amber-500/30 mb-6">
        <p className="text-slate-300 text-sm">
          <strong className="text-amber-400">Instructions:</strong> Click on an evidence item, then click on the matching target to connect them.
        </p>
      </div>

      {/* Matching Interface */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Evidence Column */}
        <div>
          <h4 className="text-white font-semibold mb-3">Evidence</h4>
          <div className="space-y-3">
            {evidence.map((item) => (
              <motion.div
                key={item.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  matches[item.id]
                    ? showResult
                      ? targets.find(t => t.id === matches[item.id])?.correctEvidenceIds.includes(item.id)
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-red-500 bg-red-500/10'
                      : 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    matches[item.id] ? 'border-amber-500 bg-amber-500' : 'border-slate-600'
                  }`}>
                    {matches[item.id] && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-white"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm mb-1">{item.name}</p>
                    <p className="text-slate-400 text-xs">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Targets Column */}
        <div>
          <h4 className="text-white font-semibold mb-3">Suspects / Locations</h4>
          <div className="space-y-3">
            {targets.map((target) => {
              const connectedEvidence = evidence.filter(e => matches[e.id] === target.id);

              return (
                <div
                  key={target.id}
                  className="p-4 rounded-xl border-2 border-slate-700 bg-slate-900/50"
                >
                  <p className="text-white font-semibold text-sm mb-3">{target.name}</p>

                  {/* Connected Evidence */}
                  <div className="space-y-2">
                    {evidence.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => !showResult && handleMatch(item.id, target.id)}
                        disabled={showResult}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-all text-xs ${
                          matches[item.id] === target.id
                            ? 'border-amber-500/50 bg-amber-500/20 text-white'
                            : 'border-slate-700/50 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 mb-6 ${
              isCorrect
                ? 'bg-green-500/10 border-green-500/50'
                : 'bg-red-500/10 border-red-500/50'
            }`}
          >
            <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect
                ? 'Perfect! All evidence has been correctly matched.'
                : 'Some matches are incorrect. Review the evidence and try again.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={evidence.length !== Object.keys(matches).filter(k => matches[k]).length}
            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Submit Matches
          </button>
        )}
        {showResult && !isCorrect && (
          <button
            onClick={() => {
              setShowResult(false);
              setMatches({});
            }}
            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold hover:from-amber-500 hover:to-amber-400 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

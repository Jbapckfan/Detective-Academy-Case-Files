import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Sparkles, Image, Clock as ClockIcon } from 'lucide-react';
import type { CaseJournalEntry } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: CaseJournalEntry[];
  zoneName?: string;
}

export function CaseJournalDrawer({ isOpen, onClose, entries, zoneName }: Props) {
  const clues = entries.filter(entry => entry.category === 'clue');
  const artifacts = entries.filter(entry => entry.category === 'artifact');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            className="relative h-full w-full max-w-md bg-slate-900 text-white shadow-2xl border-l border-amber-800/40 overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="p-5 border-b border-amber-800/40 bg-slate-950/60 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/40">
                    <BookOpen className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Case Journal</p>
                    <h3 className="text-lg font-semibold">{zoneName || 'Active Case'}</h3>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 border border-slate-700/60">
                  <X className="w-4 h-4 text-slate-300" />
                </button>
              </div>
              <p className="text-sm text-slate-300 mt-2">Solved clues and unlocked art stay here for quick reference.</p>
            </div>

            <div className="h-full overflow-y-auto p-4 space-y-4">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-amber-200 uppercase text-xs tracking-[0.15em]">
                  <Sparkles className="w-4 h-4" />
                  <span>Clues</span>
                </div>
                {clues.length === 0 ? (
                  <p className="text-slate-500 text-sm">Solve puzzles to log fresh clues.</p>
                ) : (
                  <div className="space-y-3">
                    {clues.map(entry => (
                      <div
                        key={entry.id}
                        className="p-3 rounded-xl bg-slate-800/70 border border-amber-800/40 shadow-inner"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-amber-200">{entry.title}</h4>
                          <span className="text-[10px] uppercase text-amber-300/80">
                            {new Date(entry.obtainedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200 mt-1 leading-relaxed">{entry.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-amber-200 uppercase text-xs tracking-[0.15em]">
                  <Image className="w-4 h-4" />
                  <span>Unlocked Artifacts</span>
                </div>
                {artifacts.length === 0 ? (
                  <p className="text-slate-500 text-sm">Complete a clue to unlock a new vignette.</p>
                ) : (
                  <div className="space-y-3">
                    {artifacts.map(entry => (
                      <div
                        key={entry.id}
                        className="p-3 rounded-xl bg-slate-800/70 border border-amber-800/40 shadow-inner"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-amber-200 font-semibold text-sm">
                            <ClockIcon className="w-4 h-4" />
                            <span>{entry.title}</span>
                          </div>
                          <span className="text-[10px] uppercase text-amber-300/80">
                            {new Date(entry.obtainedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-200 mt-1 leading-relaxed">{entry.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

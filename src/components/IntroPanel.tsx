import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';

interface IntroPanelProps {
  title: string;
  lines: [string, string];
  accentColor?: string;
  background?: string;
  speaker?: string;
}

export function IntroPanel({ title, lines, accentColor = '#fbbf24', background, speaker = 'Detective Companion' }: IntroPanelProps) {
  return (
    <motion.div
      className="mb-6 rounded-2xl overflow-hidden border border-amber-900/40 shadow-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="relative px-5 py-4"
        style={{ background: background || 'linear-gradient(135deg, #0f172a 0%, #1f2937 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.12),transparent_35%)]" />
        <div className="relative flex items-center gap-3 text-amber-100">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Case Intro</p>
            <h3 className="text-lg font-semibold" style={{ color: accentColor }}>
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="relative bg-slate-900/80 px-5 py-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.08),transparent_35%)]" />
        <div className="relative flex items-start gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-300 rounded-xl border border-amber-500/30 shadow-inner">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.15em] text-amber-200/80">{speaker}</p>
            <div className="space-y-1">
              <p className="text-slate-100 text-sm leading-relaxed">{lines[0]}</p>
              <p className="text-slate-200 text-sm leading-relaxed">{lines[1]}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

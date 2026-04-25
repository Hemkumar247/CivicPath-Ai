import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronDown, ChevronUp, MapPin, Search, UserCheck, Vote } from 'lucide-react';
import { cn } from '../lib/utils';
import { ELECTION_PHASES } from '../constants';

interface TimelineProps {
  completedSteps: number[];
  onToggleStep: (id: number) => void;
}

const icons = [UserCheck, Search, CheckCircle2, Vote];

export default function Timeline({ completedSteps, onToggleStep }: TimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="relative pl-6 space-y-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
        {ELECTION_PHASES.map((phase, index) => {
          const Icon = icons[index];
          const isCompleted = completedSteps.includes(phase.id);
          const isExpanded = expandedId === phase.id;

          return (
            <div key={phase.id} className="relative">
              <div
                className={cn(
                  "absolute -left-[23px] w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 transition-colors",
                  isCompleted ? "bg-igreen-500" : (isExpanded ? "bg-navy-600" : "bg-slate-300")
                )}
              />

              <div className={cn(
                "glass p-6 rounded-[1.5rem] shadow-sm transition-all duration-300 border-l-4 hover:shadow-md hover:scale-[1.01] hover:border-slate-300",
                isCompleted 
                  ? "border-l-igreen-500" 
                  : (isExpanded ? "border-l-navy-600" : "border-l-slate-200 opacity-80 hover:opacity-100 bg-white/40")
              )}>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : phase.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "mt-0.5",
                      isCompleted ? "text-igreen-600" : (isExpanded ? "text-navy-600" : "text-slate-400")
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-bold text-sm flex items-center gap-2",
                        isExpanded ? "text-navy-600" : "text-slate-900"
                      )}>
                        0{phase.id}. {phase.title}
                        {isCompleted && <span className="text-[10px] bg-igreen-50 text-igreen-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider ml-2">Done</span>}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{phase.description}</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                        {phase.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                             {detail}
                          </div>
                        ))}

                        <div className="pt-3 flex mt-2">
                          <button
                            onClick={() => {
                              onToggleStep(phase.id);
                              // Auto-collapse and move to the next item if newly marking as completed
                              if (!isCompleted) {
                                setTimeout(() => setExpandedId(phase.id + 1), 300);
                              }
                            }}
                            className={cn(
                              "text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors w-full justify-center sm:w-auto",
                              isCompleted 
                                ? "bg-slate-100 text-slate-500 hover:bg-slate-200" 
                                : "bg-navy-600 text-white hover:bg-navy-700"
                            )}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {isCompleted ? "Mark as Incomplete" : "Mark Step as Done"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

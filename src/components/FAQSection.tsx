import { ChevronRight } from 'lucide-react';
import { FAQ_DATA } from '../constants';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getTranslation, Language } from '../lib/i18n';

export default function FAQSection({ lang }: { lang: Language }) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const t = (key: any) => getTranslation(lang, key);

  const toggle = (id: string) => {
    setOpenIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold mb-3">{t('faqTitle')}</h3>
      <div className="space-y-2">
        {FAQ_DATA.slice(0,3).map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => toggle(item.id)}
                className="w-full p-3 hover:bg-slate-50 rounded-lg cursor-pointer text-sm flex justify-between items-start border border-slate-200 transition-colors text-left font-medium"
              >
                <span className="font-semibold pr-2">{item.question}</span>
                <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0 mt-0.5", isOpen && "rotate-90")} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 text-[13px] text-slate-600 leading-relaxed bg-slate-50 border-x border-b border-slate-200 rounded-b-lg -mt-1 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

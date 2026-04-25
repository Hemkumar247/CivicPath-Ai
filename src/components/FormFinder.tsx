import { useState } from 'react';
import { Search, FileText, Loader2, Link2 } from 'lucide-react';
import { findECIForm } from '../services/geminiService';
import { getTranslation, Language } from '../lib/i18n';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  lang: Language;
}

export default function FormFinder({ lang }: Props) {
  const [situation, setSituation] = useState('');
  const [result, setResult] = useState<{form: string, link: string, desc: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = (key: any) => getTranslation(lang, key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;
    setIsLoading(true);
    const res = await findECIForm(situation, lang);
    setResult(res);
    setIsLoading(false);
  };

  const handlePreset = async (preset: string) => {
    setSituation(preset);
    setIsLoading(true);
    const res = await findECIForm(preset, lang);
    setResult(res);
    setIsLoading(false);
  };

  const situations = [
    "I just turned 18",
    "I moved to a new city",
    "My name is misspelled",
    "I want to link my Aadhaar"
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          {t('formFinderTitle')}
          <FileText className="w-4 h-4 text-saffron-500" />
        </h2>
        <p className="text-sm text-slate-500">{t('formFinderSub')}</p>
      </div>

      <form onSubmit={handleSubmit} className="relative group shrink-0 mb-3">
        <input 
          type="text"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="e.g. I moved to Mumbai from Delhi"
          className="w-full border border-slate-300 rounded-lg py-2.5 px-4 pr-12 focus:ring-2 focus:ring-saffron-500 focus:outline-none text-sm font-medium transition-shadow placeholder:text-slate-400 bg-white"
        />
        <button
          disabled={isLoading || !situation.trim()}
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-2 text-saffron-600 rounded flex items-center justify-center hover:bg-saffron-50 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </form>
      
      {!result && !isLoading && (
        <div className="flex flex-wrap gap-2 mb-2">
          {situations.map(s => (
            <button key={s} type="button" onClick={() => handlePreset(s)} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors">
              "{s}"
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 flex-1 overflow-y-auto min-h-[90px]">
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 bg-saffron-50 rounded-lg border border-saffron-100 h-full flex flex-col justify-between"
            >
              <div>
                <p className="font-bold text-saffron-600 text-lg">{result.form}</p>
                <p className="text-[12px] text-slate-700 leading-tight mt-1">{result.desc}</p>
              </div>
              <a href={result.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-bold text-navy-600 hover:text-navy-700 mt-2">
                official ECI Portal <Link2 className="w-3 h-3" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

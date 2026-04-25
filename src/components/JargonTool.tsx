import { useState } from 'react';
import { Search, Sparkles, Loader2, Info } from 'lucide-react';
import { explainElectionJargon } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { Language, getTranslation } from '../lib/i18n';

interface Props {
  lang: Language;
}

export default function JargonTool({ lang }: Props) {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = (key: any) => getTranslation(lang, key);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const result = await explainElectionJargon(query, lang);
    setExplanation(result);
    setIsLoading(false);
  };

  const handlePreset = async (preset: string) => {
    setQuery(preset);
    setIsLoading(true);
    const result = await explainElectionJargon(preset, lang);
    setExplanation(result);
    setIsLoading(false);
  };

  const commonlyAsked = ['EVM', 'NOTA', 'VVPAT', 'Model Code of Conduct'];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          {t('jargonTitle')}
          <Sparkles className="w-4 h-4 text-navy-600" />
        </h2>
        <p className="text-sm text-slate-500">{t('jargonSub')}</p>
      </div>

      <form onSubmit={handleSearch} className="relative group shrink-0">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Model Code of Conduct, NOTA, EVM"
          className="w-full border border-slate-300 rounded-lg py-2.5 px-4 pr-12 focus:ring-2 focus:ring-navy-600 focus:outline-none text-sm font-medium transition-shadow placeholder:text-slate-400 bg-white"
        />
        <button
          disabled={isLoading || !query.trim()}
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-2 text-navy-600 rounded flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </form>

      {!explanation && !isLoading && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {commonlyAsked.map(term => (
            <button key={term} type="button" onClick={() => handlePreset(term)} className="text-[10px] bg-navy-50 hover:bg-navy-100 text-navy-700 px-2 py-1 rounded transition-colors font-medium">
              {term}
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 flex-1 overflow-y-auto min-h-[80px]">
        <AnimatePresence mode="wait">
          {explanation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 bg-navy-50 rounded-lg border border-navy-100 flex gap-2 h-full"
            >
              <div className="shrink-0 mt-0.5 text-navy-600">
                 <Info className="w-3.5 h-3.5" />
              </div>
              <p className="text-[13px] text-slate-800 leading-relaxed overflow-y-auto">
                {explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { motion } from 'motion/react';
import { UserCircle2, CheckCircle2, Globe2 } from 'lucide-react';
import { getTranslation, Language } from '../lib/i18n';

interface ProgressBarProps {
  progress: number;
  lang: Language;
  setLang: (l: Language) => void;
}

export default function ProgressBar({ progress, lang, setLang }: ProgressBarProps) {
  const t = (key: any) => getTranslation(lang, key);
  const isComplete = progress === 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm h-[73px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-navy-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">C</div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">CivicPath</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">India Elections</p>
        </div>
      </div>

      <div className="hidden sm:block flex-1 max-w-sm mx-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{t('readiness')}</span>
          <span className="text-xs font-bold text-navy-600 flex items-center gap-1">
            {isComplete && <CheckCircle2 className="w-3 h-3 text-igreen-500" />} {progress}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
           <div 
             className="h-full bg-navy-600 transition-all duration-700 ease-out relative"
             style={{ width: `${progress}%` }}
           >
              <div className="absolute inset-0 w-full bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl shadow-inner">
          <Globe2 className="w-4 h-4 text-slate-400 mx-1.5 hidden sm:block" />
          <button onClick={() => setLang('en')} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${lang === 'en' ? 'bg-white shadow-sm text-navy-600' : 'text-slate-500 hover:text-slate-700'}`}>EN</button>
          <button onClick={() => setLang('hi')} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${lang === 'hi' ? 'bg-white shadow-sm text-saffron-600' : 'text-slate-500 hover:text-slate-700'}`}>हि</button>
          <button onClick={() => setLang('ta')} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${lang === 'ta' ? 'bg-white shadow-sm text-igreen-600' : 'text-slate-500 hover:text-slate-700'}`}>தமிழ்</button>
        </div>
      </div>
    </header>
  );
}

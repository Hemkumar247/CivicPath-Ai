import { useState, useMemo } from 'react';
import Timeline from './components/Timeline';
import JargonTool from './components/JargonTool';
import VoterIDSimulator from './components/VoterIDSimulator';
import FAQSection from './components/FAQSection';
import ProgressBar from './components/ProgressBar';
import FormFinder from './components/FormFinder';
import KYCSection from './components/KYCSection';
import InkAndID from './components/InkAndID';
import ConstituencyDashboard from './components/ConstituencyDashboard';
import CandidateExplorer from './components/CandidateExplorer';
import LearningHub from './components/LearningHub';
import CountdownTimer from './components/CountdownTimer';
import { ELECTION_PHASES } from './constants';
import { Language, getTranslation } from './lib/i18n';
import { Map, BookOpen, Mic2, LineChart, GraduationCap } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [currentRoute, setCurrentRoute] = useState<'home' | 'manifestos' | 'analytics' | 'learn'>('home');

  const t = (key: any) => getTranslation(lang, key as any);

  const progress = useMemo(() => {
    return Math.round((completedSteps.length / ELECTION_PHASES.length) * 100);
  }, [completedSteps]);

  const toggleStep = (id: number) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(stepId => stepId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <ProgressBar progress={progress} lang={lang} setLang={setLang} />

      {/* Top App Ribbon Navigation */}
      <div className="w-full bg-white border-b border-slate-200 mt-[73px] shadow-sm z-40 sticky top-[73px]">
         <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex items-center gap-6">
            <button 
              onClick={() => setCurrentRoute('home')}
              className={cn("py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors", currentRoute === 'home' ? "border-navy-600 text-navy-600" : "border-transparent text-slate-500 hover:text-slate-900")}
            >
              <BookOpen className="w-4 h-4" />
              {(t('navHome') as string) || "Voter Guide"}
            </button>
            <button 
              onClick={() => setCurrentRoute('manifestos')}
              className={cn("py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors", currentRoute === 'manifestos' ? "border-navy-600 text-navy-600" : "border-transparent text-slate-500 hover:text-slate-900")}
            >
              <Mic2 className="w-4 h-4" />
              {(t('navManifestos') as string) || "Local Manifestos"}
            </button>
            <button 
              onClick={() => setCurrentRoute('analytics')}
              className={cn("py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors", currentRoute === 'analytics' ? "border-navy-600 text-navy-600" : "border-transparent text-slate-500 hover:text-slate-900")}
            >
              <LineChart className="w-4 h-4" />
              {(t('navAnalytics') as string) || "Analytics"}
            </button>
            <button 
              onClick={() => setCurrentRoute('learn')}
              className={cn("py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors", currentRoute === 'learn' ? "border-navy-600 text-navy-600" : "border-transparent text-slate-500 hover:text-slate-900")}
            >
              <GraduationCap className="w-4 h-4" />
              {(t('navLearn') as string) || "Learning Hub"}
            </button>
         </div>
      </div>

      <main className="flex-1 overflow-y-auto w-full max-w-[1200px] mx-auto p-4 md:p-6 pb-24 relative">
        
        {currentRoute === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-10 mt-6 md:mt-10 pb-4">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-saffron-600 via-navy-600 to-igreen-600 bg-clip-text text-transparent transform transition-all hover:scale-[1.01] cursor-default">{t('heroTitle')}</h1>
              <p className="text-slate-500 font-medium mt-4 max-w-lg mx-auto text-sm md:text-base">{t('heroSub')}</p>
            </div>

            <CountdownTimer lang={lang} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-full">
              {/* Left Column - Timeline & Ink Checklist (col-span-4) */}
              <div className="lg:col-span-4 flex flex-col gap-6 relative">
                <div>
                   <h2 className="text-lg font-bold mb-2 flex items-center gap-2 sticky top-0 bg-slate-50 z-10 py-2">
                     <Map className="w-5 h-5 text-navy-600" />
                     {t('timelineTitle')}
                   </h2>
                   <Timeline 
                     completedSteps={completedSteps} 
                     onToggleStep={toggleStep} 
                   />
                </div>
                
                <InkAndID lang={lang} />
              </div>

              {/* Right Column - Jargon/FormFinder, KYC, Simulator, Dashboard (col-span-8) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Top Row: AI Tools side-by-side inside a glass container */}
                <div className="glass p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-stretch justify-between gap-8 h-auto md:h-[280px] shadow-sm hover:shadow-md transition-all duration-300">
                  
                  {/* Jargon side (50%) */}
                  <div className="w-full md:w-[50%] flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200/60 pb-6 md:pb-0 md:pr-4">
                     <JargonTool lang={lang} />
                  </div>

                  {/* FormFinder side (50%) */}
                  <div className="w-full md:w-[50%] flex flex-col justify-center pt-2 md:pt-0 pl-0 md:pl-4">
                     <FormFinder lang={lang} />
                  </div>

                </div>

                 {/* Middle features - Side by side grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                   <KYCSection lang={lang} />

                   {/* FAQ is now in the grid */}
                   <div className="glass rounded-[2rem] p-6 h-full flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-300">
                       <FAQSection lang={lang} />
                   </div>
                 </div>

                 {/* Simulator */}
                 <VoterIDSimulator lang={lang} />

                 <div className="text-center text-xs text-slate-400 mt-8 mb-4">
                   {t('disclaimer')}
                 </div>
              </div>
            </div>
          </div>
        )}

        {currentRoute === 'manifestos' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-4xl mx-auto h-[700px]">
              <CandidateExplorer lang={lang} />
           </div>
        )}

        {currentRoute === 'analytics' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-4xl mx-auto mt-6">
              <ConstituencyDashboard lang={lang} />
           </div>
        )}

        {currentRoute === 'learn' && (
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-5xl mx-auto mt-6">
              <LearningHub lang={lang} />
           </div>
        )}
      </main>
    </div>
  );
}

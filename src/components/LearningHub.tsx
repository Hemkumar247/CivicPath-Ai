import { useState, useEffect, useRef } from 'react';
import { getTranslation, Language } from '../lib/i18n';
import { PlayCircle, StopCircle, Loader2, BookOpenCheck, Landmark, ShieldCheck, Map, ShieldAlert, Send, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { fetchTopicExplainer, playTTS, stopPlayback } from '../services/ttsService';
import { askElectionDoubt } from '../services/geminiService';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function LearningHub({ lang }: { lang: Language }) {
  const t = (key: any) => getTranslation(lang, key);

  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([0]);
  
  const [content, setContent] = useState<string>('');
  const [ttsPrompt, setTtsPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const levels = [
    { id: 'authority', icon: <Landmark className="w-5 h-5" />, title: lang === 'hi' ? 'लेवल 1: प्राधिकरण' : lang === 'ta' ? 'நிலை 1: ஆணையம்' : 'Level 1: The Authority', desc: "Learn about the Election Commission of India." },
    { id: 'process', icon: <ShieldAlert className="w-5 h-5" />, title: lang === 'hi' ? 'लेवल 2: नियम और आचार संहिता' : lang === 'ta' ? 'நிலை 2: விதிகள்' : 'Level 2: The Rules', desc: "Understand the Model Code of Conduct." },
    { id: 'how_conducted', icon: <BookOpenCheck className="w-5 h-5" />, title: lang === 'hi' ? 'लेवल 3: मतदान प्रक्रिया' : lang === 'ta' ? 'நிலை 3: வாக்குப்பதிவு' : 'Level 3: The Vote', desc: "See how voting is conducted nationwide." }
  ];

  useEffect(() => {
    // Load progress
    const progress = localStorage.getItem('civicpath_progress');
    if (progress) {
      try { setUnlockedLevels(JSON.parse(progress)); } catch(e) {}
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadContent = async () => {
      const topicId = levels[activeLevel].id;
      setIsLoading(true);
      await stopPlayback();
      setIsPlaying(false);
      const data = await fetchTopicExplainer(topicId, lang);
      if (active) {
        setContent(data.content);
        setTtsPrompt(data.ttsPrompt);
        setIsLoading(false);
      }
    };
    loadContent();
    return () => { 
        active = false;
        stopPlayback(); 
    };
  }, [activeLevel, lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleAudioToggle = async () => {
    if (isPlaying) {
      await stopPlayback();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      try {
          await playTTS('Read clearly and engagingly in native language: ' + ttsPrompt, 'Kore'); 
      } catch (e) {
          setIsPlaying(false);
      }
    }
  };

  const handleCompleteLevel = () => {
     if (activeLevel < levels.length - 1) {
        const newUnlocked = Array.from(new Set([...unlockedLevels, activeLevel + 1]));
        setUnlockedLevels(newUnlocked);
        localStorage.setItem('civicpath_progress', JSON.stringify(newUnlocked));
        setActiveLevel(activeLevel + 1);
     }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userQ = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userQ }]);
    setIsChatLoading(true);

    const answer = await askElectionDoubt(userQ, lang);
    setChatMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    setIsChatLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 bg-white/40 border border-slate-200/60 p-6 rounded-[2rem] shadow-sm backdrop-blur-sm gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Map className="w-7 h-7 md:w-8 md:h-8 text-saffron-600" />
            {lang === 'hi' ? 'चुनावी यात्रा' : lang === 'ta' ? 'தேர்தல் பயணம்' : 'Election Journey'}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1 pl-10 md:pl-11">
             {lang === 'hi' ? 'गेम खेलें, ज्ञान अनलॉक करें, और AI से प्रश्न पूछें।' : lang === 'ta' ? 'விளையாடுங்கள், அறிவை திறங்கள் மற்றும் AI-யிடம் கேள்விகள் கேளுங்கள்.' : 'Level up your knowledge and resolve doubts with verified AI.'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
           <span className="text-sm font-bold text-slate-700">Progress:</span>
           <div className="flex items-center gap-1">
             {levels.map((_, i) => (
               <div key={i} className={cn("w-3 h-3 rounded-full", unlockedLevels.includes(i) ? "bg-igreen-500" : "bg-slate-200")} />
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* Main Content Area (Path & Reader) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
             
             {/* Map / Path UI */}
             <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
                <div className="absolute top-1/2 left-8 h-1 bg-navy-600 -translate-y-1/2 rounded-full z-0 transition-all duration-700 ease-in-out" style={{ width: `calc(${(Math.max(...unlockedLevels) / (levels.length - 1)) * 100}% - 4rem)` }}></div>
                
                {levels.map((level, idx) => {
                  const isUnlocked = unlockedLevels.includes(idx);
                  const isActive = activeLevel === idx;
                  return (
                    <button
                      key={level.id}
                      disabled={!isUnlocked}
                      onClick={() => setActiveLevel(idx)}
                      className={cn(
                        "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                        isActive ? "bg-navy-600 border-white shadow-md scale-110 text-white" : 
                        isUnlocked ? "bg-white border-navy-600 text-navy-600 cursor-pointer hover:bg-slate-50" : 
                        "bg-slate-100 border-white text-slate-400 cursor-not-allowed opacity-70"
                      )}
                    >
                      {isUnlocked ? level.icon : <Lock className="w-5 h-5" />}
                    </button>
                  );
                })}
             </div>

             {/* Reader Content Window */}
             <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-sm border border-slate-200 flex-1 min-h-[400px]">
                {isLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-4 min-h-[300px]">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="text-sm font-bold uppercase tracking-widest">Generating Content...</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                            <div>
                              <div className="text-xs font-black uppercase tracking-wider text-saffron-600 mb-1">
                                {lang === 'hi' ? 'लेवल' : lang === 'ta' ? 'நிலை' : 'Level'} {activeLevel + 1}
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                {levels[activeLevel].title.replace(/Level \d: /, '').replace(/लेवल \d: /, '').replace(/நிலை \d: /, '')}
                              </h3>
                            </div>
                            
                            <button 
                               onClick={handleAudioToggle}
                               className={cn("flex items-center gap-2 px-4 py-2 shrink-0 rounded-full font-bold text-sm transition-all shadow-sm ring-1", isPlaying ? "bg-saffron-50 text-saffron-700 ring-saffron-200 hover:bg-saffron-100" : "bg-white text-navy-600 ring-slate-200 hover:bg-slate-50")}
                            >
                               {isPlaying ? (
                                   <><StopCircle className="w-5 h-5 animate-pulse" /> Stop Podcast</>
                               ) : (
                                   <><PlayCircle className="w-5 h-5 text-saffron-500" /> Listen (Native)</>
                               )}
                            </button>
                        </div>

                        <div className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-700 leading-relaxed font-medium mb-8 flex-1">
                            <div className="markdown-body">
                                <Markdown>{content}</Markdown>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={handleCompleteLevel}
                            disabled={activeLevel >= levels.length - 1 && unlockedLevels.includes(levels.length - 1)}
                            className="bg-igreen-600 hover:bg-igreen-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-bold shadow-md shadow-igreen-600/20 flex items-center gap-2 transition-all"
                          >
                            {activeLevel === levels.length - 1 ? 
                              <><CheckCircle2 className="w-5 h-5" /> Completed</> : 
                              <><Sparkles className="w-5 h-5" /> Understand & Next</>}
                          </button>
                        </div>
                    </div>
                )}
             </div>
          </div>

          {/* AI Q&A Sidebar */}
          <div className="lg:col-span-5 flex flex-col glass rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 h-[600px] lg:h-auto">
             <div className="bg-navy-900 p-4 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none">Law AI Assistant</h3>
                    <p className="text-[10px] text-navy-300">Verified official sources only</p>
                  </div>
                </div>
             </div>

             <div className="flex-1 bg-slate-50/50 p-4 overflow-y-auto flex flex-col gap-4">
                {chatMessages.length === 0 && (
                   <div className="text-center text-slate-400 text-sm my-auto px-4">
                      {lang === 'hi' ? 'चुनाव संबंधी कोई प्रश्न पूछें। मैं संविधान और ईसीआई के नियमों की खोजकर उत्तर दूंगा।' : lang === 'ta' ? 'தேர்தல் பற்றிய கேள்விகளைக் கேளுங்கள். சட்டரீதியான, சரிபார்க்கப்பட்ட பதில்களைப் பெறுங்கள்.' : 'Have a hypothetical question or doubt? Ask me and I will find verified, legal answers from official sources.'}
                   </div>
                )}
                
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl p-3 text-sm", msg.role === 'user' ? "bg-navy-600 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm")}>
                      {msg.role === 'assistant' ? (
                        <div className="markdown-body text-sm prose prose-sm prose-slate max-w-none">
                           <Markdown>{msg.content}</Markdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                
                {isChatLoading && (
                   <div className="flex w-full justify-start">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Verifying laws...</span>
                      </div>
                   </div>
                )}
                <div ref={chatEndRef} />
             </div>

             <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-slate-200 shrink-0 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={lang === 'hi' ? "ईसीआई के नियम क्या हैं..." : lang === 'ta' ? "தேர்தல் பற்றி கேளுங்கள்..." : "Ask a legal election doubt..."}
                  className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  disabled={isChatLoading}
                />
                <button 
                  type="submit" 
                  disabled={isChatLoading || !chatInput.trim()}
                  className="bg-navy-600 hover:bg-navy-700 disabled:opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                >
                  <Send className="w-4 h-4 translate-x-px" />
                </button>
             </form>
          </div>
      </div>
    </div>
  );
}

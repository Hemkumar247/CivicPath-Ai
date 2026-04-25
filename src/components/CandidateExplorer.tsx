import { useState } from 'react';
import { getTranslation, Language } from '../lib/i18n';
import { MapPin, Loader2, Megaphone, LocateFixed } from 'lucide-react';
import { fetchLocalCandidates, getConstituencyFromCoords } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface CandidateToken {
  name: string;
  party: string;
  partySymbol?: string;
  flagImageUrl?: string;
  promises: string[];
  color: string;
}

export default function CandidateExplorer({ lang }: { lang: Language }) {
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [results, setResults] = useState<CandidateToken[]>([]);
  const [selectedParty, setSelectedParty] = useState<string>('All');

  // Using inline fallbacks safely, or define them in i18n
  const title = lang === 'hi' ? 'स्थानीय घोषणापत्र और वादे' : lang === 'ta' ? 'உள்ளூர் வாக்குறுதிகள்' : 'Local Manifestos & Promises';
  const sub = lang === 'hi' ? 'अपने स्थानीय उम्मीदवारों के वादों का पता लगाने के लिए अपना स्थान दर्ज करें।' : lang === 'ta' ? 'உள்ளூர் வேட்பாளர்களின் வாக்குறுதிகளை அறிய இருப்பிடத்தை உள்ளிடவும்.' : 'Enter your location to explore local realistic candidates and their key promises.';
  const placeholder = lang === 'hi' ? 'उदा. बेंगलुरु दक्षिण' : lang === 'ta' ? 'எ.கா. சென்னை தெற்கு' : 'e.g. Bangalore South';

  const handleSearch = async (e?: React.FormEvent, bypassLocation: string = '') => {
    if (e) e.preventDefault();
    const query = bypassLocation || location;
    if (!query.trim()) return;
    setIsSearching(true);
    setSelectedParty('All');
    const cands = await fetchLocalCandidates(query, lang);
    setResults(cands);
    setIsSearching(false);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setSelectedParty('All');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const constituencyName = await getConstituencyFromCoords(latitude, longitude);
        if (constituencyName) {
          setLocation(constituencyName);
          handleSearch(undefined, constituencyName);
        } else {
           alert(lang === 'ta' ? "இடம் கண்டறிய முடியவில்லை." : lang === 'hi' ? "स्थान नहीं मिला।" : "Could not determine constituency from coordinates.");
        }
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        alert("Unable to retrieve your location. Please type it manually.");
      }
    );
  };

  const availableParties = ['All', ...Array.from(new Set(results.map(c => c.party)))];
  const filteredResults = selectedParty === 'All' ? results : results.filter(c => c.party === selectedParty);

  return (
    <div className="glass rounded-[2rem] p-8 relative w-full h-full flex flex-col justify-start shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-6 mt-2 shrink-0">
        <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
          {title}
          <MapPin className="w-6 h-6 text-saffron-600" />
        </h2>
        <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">{sub}</p>
      </div>

      <form onSubmit={(e) => handleSearch(e)} className="relative w-full max-w-md mb-4 flex gap-2 shrink-0">
        <div className="relative flex-1">
          <input 
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-slate-300 rounded-lg py-2.5 pl-4 pr-[40px] focus:ring-2 focus:ring-saffron-500 focus:outline-none text-sm font-medium transition-shadow placeholder:text-slate-400 bg-white"
          />
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating || isSearching}
            className="absolute right-2 top-1.5 bottom-1.5 p-1.5 text-slate-400 hover:text-navy-600 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
            title="Use my current location"
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
          </button>
        </div>
        
        <button
          disabled={isSearching || !location.trim()}
          type="submit"
          className="px-4 py-2.5 bg-navy-600 text-white font-bold text-xs rounded-lg flex items-center justify-center hover:bg-navy-700 disabled:opacity-50 transition-colors shrink-0"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Explore"}
        </button>
      </form>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col"
          >
            {/* Dynamic Party Filter Pills */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none shrink-0 w-full pt-1">
              {availableParties.map(party => (
                <button
                  key={party}
                  onClick={() => setSelectedParty(party)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    selectedParty === party
                      ? "bg-navy-600 text-white shadow-sm"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-navy-600"
                  )}
                >
                  {party}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 pb-4">
              {filteredResults.map((cand, idx) => (
                <div key={idx} className="bg-white border text-left border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                   <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundColor: cand.color }}></div>
                   <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: cand.color }}></div>
                   <div className="pl-3 relative z-10">
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <h3 className="font-bold text-sm text-slate-900">{cand.name}</h3>
                         <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: cand.color }}>
                             {cand.party}
                           </span>
                           {cand.partySymbol && (
                             <span className="text-[10px] font-bold text-slate-600 px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 shadow-sm bg-white">
                               {cand.partySymbol}
                             </span>
                           )}
                         </div>
                       </div>
                       <div className="flex flex-col items-center justify-center shrink-0 ml-4">
                         {cand.flagImageUrl ? (
                           <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 bg-slate-50 flex items-center justify-center">
                             <img 
                               src={cand.flagImageUrl} 
                               alt={`${cand.party} flag`} 
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 (e.target as HTMLImageElement).style.display = 'none';
                               }}
                             />
                           </div>
                         ) : (
                           <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100 bg-slate-50 flex items-center justify-center">
                             <Megaphone className="w-4 h-4 text-slate-400" />
                           </div>
                         )}
                       </div>
                     </div>
                     <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100">
                       {cand.promises.map((p, i) => (
                         <div key={i} className="flex gap-2 items-start">
                           <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0 mt-1.5"></div>
                           <p className="text-[11px] font-medium text-slate-600 leading-snug">{p}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isSearching && !isLocating && results.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
             <MapPin className="w-10 h-10 mb-2 grayscale" />
             <p className="text-xs font-bold w-48 mx-auto leading-tight">Enter a constituency to see real local party manifestos.</p>
          </div>
      )}
    </div>
  );
}

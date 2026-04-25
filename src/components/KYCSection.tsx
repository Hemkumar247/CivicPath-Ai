import { useState } from 'react';
import { UserCheck, Loader2, FileCheck2 } from 'lucide-react';
import { explainAffidavit } from '../services/geminiService';
import { getTranslation, Language } from '../lib/i18n';

interface Props {
  lang: Language;
}

export default function KYCSection({ lang }: Props) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMock, setShowMock] = useState(false);

  const t = (key: any) => getTranslation(lang, key);

  const handleLearnMore = async () => {
    setIsLoading(true);
    setShowMock(false);
    const res = await explainAffidavit(lang);
    setExplanation(res);
    setIsLoading(false);
  };

  return (
    <div className="glass rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-center h-full shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {t('kycTitle')}
            <UserCheck className="w-5 h-5 text-saffron-600" />
          </h2>
          <p className="text-sm text-slate-500">Before voting, review the Form 26 Affidavit.</p>
        </div>
      </div>
      
      {(!explanation && !showMock) ? (
         <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center flex-1 flex flex-col justify-center">
            <p className="text-xs text-slate-600 mb-4 px-1">Check criminal records, assets, and education of your local candidates. The ECI mandates full transparency.</p>
            <div className="flex flex-col xl:flex-row items-center gap-2 w-full justify-center">
              <button 
                onClick={handleLearnMore}
                disabled={isLoading}
                className="bg-navy-600 hover:bg-navy-700 text-white text-xs font-bold py-2 px-3 rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 w-full"
              >
                {isLoading && <Loader2 className="w-3 h-3 animate-spin"/>}
                Why it matters?
              </button>
              <button 
                onClick={() => setShowMock(true)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 px-3 rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors w-full"
              >
                <FileCheck2 className="w-3 h-3"/> Example
              </button>
            </div>
         </div>
      ) : showMock ? (
        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 flex-1">
           <h3 className="text-xs font-bold text-slate-900 mb-2 border-b pb-2 flex justify-between items-center">
              Mock Affidavit
              <button onClick={() => setShowMock(false)} className="text-[10px] text-blue-600 hover:underline">Close</button>
           </h3>
           <div className="grid grid-cols-1 gap-y-1.5 text-[11px] mt-2">
              <div><span className="text-slate-500 w-20 inline-block">Name:</span> <span className="font-semibold text-slate-800">Aisha Sharma</span></div>
              <div><span className="text-slate-500 w-20 inline-block">Education:</span> <span className="font-semibold text-slate-800">B.A. Poli-Sci</span></div>
              <div><span className="text-slate-500 w-20 inline-block">Assets:</span> <span className="font-semibold text-slate-800">₹ 24,50,000</span></div>
              <div><span className="text-slate-500 w-20 inline-block">Criminal:</span> <span className="font-semibold text-igreen-600">0 Pending Cases</span></div>
           </div>
        </div>
      ) : (
         <div className="mt-4 bg-igreen-50 border border-igreen-100 rounded-xl p-4 relative flex-1">
            <button onClick={() => setExplanation(null)} className="absolute top-2 right-2 text-[10px] text-igreen-700 font-bold hover:underline">Clear</button>
            <p className="text-xs text-igreen-700 font-medium leading-relaxed pr-6">
              {explanation}
            </p>
            <p className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-igreen-200/50">Details via <a href="https://kyc.eci.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">ECI KYC App</a></p>
         </div>
      )}
    </div>
  );
}

import { Fingerprint, CheckCircle2 } from 'lucide-react';
import { getTranslation, Language } from '../lib/i18n';

export default function InkAndID({ lang }: { lang: Language }) {
  const t = (key: any) => getTranslation(lang, key);
  
  return (
    <div className="glass p-6 rounded-[2rem] relative border-t-4 border-t-igreen-500 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
        <Fingerprint className="w-5 h-5 text-igreen-600" />
        {t('inkIdTitle')}
      </h3>
      
      <p className="text-xs text-slate-600 mb-4">You need ONE of these approved photo IDs to vote, even if you have a voter slip:</p>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {['EPIC (Voter ID)', 'Aadhaar Card', 'PAN Card', 'Driving License', 'Indian Passport', 'MNREGA Job Card'].map((id) => (
          <div key={id} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium bg-slate-50 p-1.5 rounded border border-slate-200">
            <CheckCircle2 className="w-3 h-3 text-igreen-500 shrink-0" />
            {id}
          </div>
        ))}
      </div>

      <div className="bg-igreen-50 p-3 rounded-lg flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-igreen-100 flex items-center justify-center shrink-0 border border-igreen-200">
          <div className="w-1.5 h-4 bg-navy-600 rounded-full rotate-12 transform origin-bottom"></div>
        </div>
        <div>
          <p className="font-bold text-xs text-igreen-600">The Indelible Ink</p>
          <p className="text-[10px] text-igreen-600/80 leading-tight mt-0.5">Applied to your left forefinger to prevent double-voting. Wear it with pride!</p>
        </div>
      </div>
    </div>
  );
}

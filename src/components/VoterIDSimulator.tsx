import { useState, useRef } from 'react';
import { Camera, Vote, Upload, Sparkles, Loader2, ScanLine } from 'lucide-react';
import { cn } from '../lib/utils';
import { getTranslation, Language } from '../lib/i18n';
import { extractVoterIDInfo } from '../services/geminiService';

interface VoterDetails {
  name: string;
  epic: string;
  dob: string;
  address: string;
}

export default function VoterIDSimulator({ lang = 'en' }: { lang?: Language }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [details, setDetails] = useState<VoterDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = (key: any) => getTranslation(lang, key);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setPhoto(base64);
        setIsScanning(true);
        // Call Gemini Vision to extract details
        const extracted = await extractVoterIDInfo(base64);
        if (extracted) {
          setDetails(extracted);
        } else {
          // Fallback if scanning completely fails
          setDetails({
            name: "Unknown Voter (Scan Failed)",
            epic: "XXXXXXXXXX",
            dob: "XX-XX-XXXX",
            address: "Data unreadable. Try another photo."
          });
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutofillMock = () => {
    setPhoto("https://api.dicebear.com/7.x/notionists/svg?seed=Aisha&backgroundColor=e8e8e8");
    setDetails({
      name: "Aisha Sharma",
      epic: "IND827493",
      dob: "14-06-2004 (20 yrs)",
      address: "42, Lotus Apartments, MG Road, Bengaluru, 560001"
    });
  };

  return (
    <div className="glass rounded-[2rem] p-8 relative w-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          {t('simulatorTitle')}
          {isScanning && <Loader2 className="w-4 h-4 text-navy-600 animate-spin" />}
        </h2>
        {!details && !isScanning && (
          <button onClick={handleAutofillMock} className="flex items-center gap-1.5 px-3 py-1 bg-saffron-50 text-saffron-600 border border-saffron-100 hover:bg-saffron-100 rounded-lg text-[10px] font-bold transition-colors">
            <Sparkles className="w-3 h-3" /> Auto-fill Mock ID
          </button>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Mock ID Card */}
        <div className="w-full lg:w-[360px] h-[220px] bg-gradient-to-br from-slate-50 to-slate-200 border-2 border-slate-300 rounded-2xl shadow-xl relative p-6 shrink-0 overflow-hidden">
          {isScanning && (
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center">
              <ScanLine className="w-8 h-8 text-navy-600 animate-pulse mb-2" />
              <span className="text-xs font-bold text-navy-800 bg-white/80 px-3 py-1 rounded-full shadow-sm">AI Scanning ID...</span>
            </div>
          )}

          <div className="flex justify-between items-start mb-5">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-colors overflow-hidden border border-slate-300 relative group",
                photo ? "bg-white" : "bg-slate-300 text-slate-500 hover:bg-slate-400"
              )}
            >
              {photo ? (
                <>
                  <img src={photo} className="w-full h-full object-cover" alt="ID Profile" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </>
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Election Commission</div>
              <div className="text-sm font-black tracking-widest text-slate-800">
                {details ? details.epic : "ABC1234567"}
              </div>
            </div>
          </div>

          {details ? (
            <div className="space-y-2 mt-2">
              <div className="flex items-end gap-2">
                 <span className="text-[9px] text-slate-500 font-bold uppercase w-12 shrink-0">Name</span>
                 <span className="text-sm font-bold text-slate-900 border-b border-slate-300 flex-1 truncate">{details.name}</span>
              </div>
              <div className="flex items-end gap-2">
                 <span className="text-[9px] text-slate-500 font-bold uppercase w-12 shrink-0">DOB / Age</span>
                 <span className="text-[11px] font-bold text-slate-800 border-b border-slate-300 flex-1 truncate">{details.dob}</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                 <span className="text-[9px] text-slate-500 font-bold uppercase w-12 shrink-0 mt-0.5">Address</span>
                 <span className="text-[10px] font-medium text-slate-700 leading-tight line-clamp-2" title={details.address}>{details.address}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 mt-4">
              <div className="w-3/4 h-3 bg-slate-300 rounded"></div>
              <div className="w-1/2 h-3 bg-slate-300 rounded"></div>
              <div className="w-2/3 h-3 bg-slate-300 rounded"></div>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-slate-400 rounded-full opacity-20 flex items-center justify-center font-bold text-[8px] uppercase text-center leading-tight">
            Voter<br/>Auth
          </div>
        </div>

        {/* Info Cards */}
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-navy-200 transition-colors">
            <span className="text-xs font-bold text-navy-600 block mb-1">EPIC Number</span>
            <p className="text-[11px] text-slate-500 leading-tight">Your unique identifier used to find your name on the roll.</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-navy-200 transition-colors">
            <span className="text-xs font-bold text-navy-600 block mb-1">Polling Station</span>
            <p className="text-[11px] text-slate-500 leading-tight">The specific physical location where you must cast your vote.</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-navy-200 transition-colors col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-navy-600 block mb-1">Assembly Const.</span>
            <p className="text-[11px] text-slate-500 leading-tight">The local area map that determines which candidates you vote for.</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="bg-white p-3 rounded-xl border-2 border-navy-200 bg-navy-50 shadow-sm flex items-center justify-center border-dashed hover:bg-navy-100 disabled:opacity-50 transition-colors cursor-pointer w-full col-span-2 sm:col-span-1"
          >
            <span className="text-xs font-bold text-navy-600 flex items-center justify-center gap-1 w-full text-center">
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-3 h-3" />} 
              {isScanning ? "Scanning..." : photo ? "Scan Another ID" : "Upload Real ID Scan"}
            </span>
          </button>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
}

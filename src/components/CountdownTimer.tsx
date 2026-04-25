import { useState, useEffect } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { Language } from '../lib/i18n';

// For this example, let's pick a general future date for a major election.
// E.g., General Elections 2029 or upcoming state elections. Let's use May 31, 2029 for demo.
const TARGET_ELECTION_DATE = new Date('2029-05-31T00:00:00Z').getTime();

export default function CountdownTimer({ lang }: { lang: Language }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_ELECTION_DATE - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const title = lang === 'hi' ? 'अगला आम चुनाव' : lang === 'ta' ? 'அடுத்த பொதுத் தேர்தல்' : 'Next General Election';

  return (
    <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 w-full bg-gradient-to-br from-white to-slate-50 border border-slate-100 mb-6">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center">
          <CalendarDays className="w-6 h-6 text-navy-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {title}
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              <Clock className="w-3 h-3" /> Live
            </span>
          </h3>
          <p className="text-sm text-slate-500">Estimated Target: May 2029</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-center min-w-[70px]">
          <div className="text-3xl font-black text-navy-600 bg-white shadow-sm border border-slate-100 rounded-xl px-4 py-2 w-full text-center">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-black text-slate-300 pt-2">:</div>
        </div>
        <div className="flex flex-col items-center min-w-[70px]">
          <div className="text-3xl font-black text-navy-600 bg-white shadow-sm border border-slate-100 rounded-xl px-4 py-2 w-full text-center">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Hrs</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-black text-slate-300 pt-2">:</div>
        </div>
        <div className="flex flex-col items-center min-w-[70px]">
          <div className="text-3xl font-black text-navy-600 bg-white shadow-sm border border-slate-100 rounded-xl px-4 py-2 w-full text-center">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Min</span>
        </div>
      </div>
    </div>
  );
}

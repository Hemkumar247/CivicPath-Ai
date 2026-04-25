import { BarChart3, TrendingUp, Users, History, PieChart as PieChartIcon, MapPin, Target } from 'lucide-react';
import { getTranslation, Language } from '../lib/i18n';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, 
  LineChart, Line, PieChart, Pie, Legend
} from 'recharts';

export default function ConstituencyDashboard({ lang }: { lang: Language }) {
  const t = (key: any) => getTranslation(lang, key);

  const wardData = [
    { name: 'Ward 42', clicks: 850, color: '#1e3a8a' }, // navy-900
    { name: 'Ward 15', clicks: 620, color: '#1d4ed8' }, // blue-700
    { name: 'Ward 88', clicks: 410, color: '#3b82f6' }, // blue-500
    { name: 'Ward 03', clicks: 290, color: '#93c5fd' }, // blue-300
  ];

  const turnoutData = [
    { year: '2009', male: 60.1, female: 55.8, overall: 58.0 },
    { year: '2014', male: 67.1, female: 65.6, overall: 66.4 },
    { year: '2019', male: 67.4, female: 67.2, overall: 67.4 },
    { year: '2024', male: 68.2, female: 69.1, overall: 68.6 },
  ];

  const demoData = [
    { name: '18-25 Yrs', value: 22, color: '#fb923c' }, // saffron-400
    { name: '26-40 Yrs', value: 38, color: '#1d4ed8' }, // navy-700
    { name: '41-60 Yrs', value: 25, color: '#22c55e' }, // igreen-500
    { name: '60+ Yrs', value: 15, color: '#94a3b8' },   // slate-400
  ];

  const notaData = [
    { year: '2014', percent: 1.08 },
    { year: '2019', percent: 1.04 },
    { year: '2024', percent: 0.98 },
  ];

  const voteShareData = [
    { name: 'NDA', value: 43.3, color: '#f97316' }, // saffron-500
    { name: 'INDIA', value: 41.6, color: '#3b82f6' }, // blue-500
    { name: 'Others', value: 15.1, color: '#94a3b8' }, // slate-400
  ];

  const seatShareData = [
    { name: 'NDA', seats: 293, color: '#f97316' }, // saffron-500
    { name: 'INDIA', seats: 234, color: '#3b82f6' }, // blue-500
    { name: 'Others', seats: 16, color: '#94a3b8' }, // slate-400
  ];

  const pageTitle = lang === 'hi' ? 'एनालिटिक्स और ऐतिहासिक रुझान' : lang === 'ta' ? 'பகுப்பாய்வு மற்றும் வரலாற்றுப் போக்குகள்' : 'Analytics & Historical Trends';
  const pageSub = lang === 'hi' ? 'जनसांख्यिकीय डेटा, मतदान इतिहास और सिविकपाथ संसाधन का अन्वेषण करें।' : lang === 'ta' ? 'வாக்காளர் தரவு மற்றும் தேர்தல் வரலாற்றை ஆராயுங்கள்.' : 'Explore demographic data, national voting history, and CivicPath resource intents.';

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      
      {/* Header Info */}
      <div className="flex flex-col mb-4 bg-white/40 border border-slate-200/60 p-6 rounded-[2rem] shadow-sm backdrop-blur-sm">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
          <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-saffron-600" />
          {pageTitle}
        </h2>
        <p className="text-sm text-slate-500 font-medium mt-1 pl-10 md:pl-11">{pageSub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
      
        {/* Card 1: Historical Turnout */}
        <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-2 mb-6">
            <History className="w-5 h-5 text-navy-600 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">National Turnout Trend</h3>
              <p className="text-xs text-slate-500 mt-1 pb-2">Comparing Male, Female, and Overall voting percentages over the last 4 major elections.</p>
            </div>
          </div>
          <div className="w-full flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={turnoutData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} domain={[50, 75]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', zIndex: 50 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="overall" name="Overall" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="female" name="Female" stroke="#fb923c" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="male" name="Male" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Age Demographics */}
        <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-2 mb-2">
            <PieChartIcon className="w-5 h-5 text-saffron-600 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Voter Age Demographics (2024)</h3>
              <p className="text-xs text-slate-500 mt-1">Breakdown of the electorate by age group, highlighting the impact of youth participation.</p>
            </div>
          </div>
          <div className="w-full flex-1 min-h-[220px] flex items-center justify-center relative mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={demoData}
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {demoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`${value}%`, 'Electorate']}
                />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none md:pr-[115px] pr-[100px]">
               <span className="text-[26px] font-black text-slate-900 leading-none">968M</span>
               <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Total Voters</span>
            </div>
          </div>
        </div>

        {/* Card 5: Vote Share 2024 */}
        <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">National Vote Share (2024)</h3>
              <p className="text-xs text-slate-500 mt-1">Distribution of valid votes among major alliances.</p>
            </div>
          </div>
          <div className="w-full flex-1 min-h-[220px] flex items-center justify-center relative mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={voteShareData}
                  innerRadius={0}
                  outerRadius={90}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {voteShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`${value}%`, 'Vote Share']}
                />
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 6: Seat Distribution 2024 */}
        <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-2 mb-6">
            <MapPin className="w-5 h-5 text-saffron-600 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Seat Distribution (Lok Sabha 2024)</h3>
              <p className="text-xs text-slate-500 mt-1 pb-2">Total seats won by alliances nationwide.</p>
            </div>
          </div>
          <div className="w-full flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seatShareData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 300]}/>
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`${value} Seats`, 'Total Won']}
                />
                <Bar dataKey="seats" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
                  {seatShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: SVEEP Resource Board */}
        <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start gap-2">
               <TrendingUp className="w-5 h-5 text-igreen-600 shrink-0 mt-0.5" />
               <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                    {t('dashboardTitle')}
                  </h3>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">Live CivicPath Intents</p>
               </div>
            </div>
            <div className="p-1 px-2 text-[10px] bg-igreen-50 text-igreen-600 border border-igreen-100 rounded font-bold shadow-sm whitespace-nowrap hidden sm:block">
              Updated Live
            </div>
          </div>
          <div className="w-full flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  width={65}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`${value} Intents`, 'Registration']}
                />
                <Bar dataKey="clicks" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
                  {wardData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: NOTA Trends */}
        <div className="glass rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-2 mb-6">
            <Users className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">NOTA Usage Trend</h3>
              <p className="text-xs text-slate-500 mt-1 pb-2">Percentage of total votes cast for 'None Of The Above' choices nationwide.</p>
            </div>
          </div>
          <div className="w-full flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={notaData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 1.5]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'slate' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`${value}%`, 'NOTA Vote Share']}
                />
                <Bar dataKey="percent" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1500}>
                  {notaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#64748b' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}

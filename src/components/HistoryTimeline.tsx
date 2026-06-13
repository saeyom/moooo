import { historyTimeline } from '../data';
import { motion } from 'motion/react';
import { BookOpen, Calendar, HelpCircle, Landmark, Globe, Cpu } from 'lucide-react';

export default function HistoryTimeline() {
  
  // Helper matching titles to icons
  const getTimelineIcon = (year: string) => {
    if (year.includes('3000')) return <Landmark className="w-5 h-5 text-amber-600" />;
    if (year.includes('1494')) return <BookOpen className="w-5 h-5 text-teal-600" />;
    if (year.includes('19')) return <Landmark className="w-5 h-5 text-violet-600" />;
    if (year.includes('1973')) return <Globe className="w-5 h-5 text-sky-600" />;
    return <Cpu className="w-5 h-5 text-indigo-600" />;
  };

  return (
    <section id="timeline" className="py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-600 tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase font-mono">
            العمق التاريخي للمهنة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            تطور التاريخ المحاسبي عبر العصور
          </h2>
          <p className="text-slate-600 mt-3 font-light text-base sm:text-lg">
            من ألواح الطين البابلية إلى السحب الحسابية المتطورة؛ رحلة شيقة تريك كيف طوعت البشرية الأرقام والرياضيات لتوثيق الثقة وعمران الحضارات.
          </p>
        </div>

        {/* Timeline Path Layout */}
        <div className="relative border-r border-slate-200 mr-4 sm:mr-8 lg:mr-32 space-y-12 pb-4">
          
          {historyTimeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative pr-8 sm:pr-12 group"
            >
              
              {/* Vertical path node dot */}
              <div className="absolute top-1.5 -right-4.5 w-9 h-9 bg-white border-2 border-slate-200 group-hover:border-teal-500 rounded-full flex items-center justify-center transition-colors shadow-2xs z-10">
                {getTimelineIcon(item.year)}
              </div>

              {/* Individual content card */}
              <div className="bg-slate-50/60 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-6 transition-all duration-300 shadow-2xs hover:shadow-md">
                
                <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full font-mono uppercase">
                      {item.category}
                    </span>
                    <span className="text-slate-400 font-bold text-sm">|</span>
                    <h4 className="text-slate-800 font-black text-base">{item.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-white px-2.5 py-1 rounded-md border border-slate-150 font-bold self-start mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.year}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed font-light mt-2">
                  {item.desc}
                </p>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}

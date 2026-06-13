import { useState } from 'react';
import { quizQuestions } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, HelpCircle, Award, GraduationCap, RefreshCw, Star, ShieldCheck, User } from 'lucide-react';

export default function InteractiveQuiz() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  
  // Certificate states
  const [userName, setUserName] = useState<string>('');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const currentQuestion = quizQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return; // Locked once checked
    setSelectedAns(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAns === null) return;
    
    // Check correct answer and increment score
    if (selectedAns === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    // Reset state for next round
    setSelectedAns(null);
    setIsSubmitted(false);

    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setShowCertificate(false);
    setUserName('');
  };

  return (
    <section id="quiz" className="py-20 bg-slate-50/50 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase font-mono">
            اختبار قياس الكفاءة
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            اختبر ثقافتك المحاسبية والمالية 🎓
          </h2>
          <p className="text-slate-500 mt-2 font-light text-sm">
            أجب على خمسة أسئلة نموذجية مستلهمة من معايير الهيئة السعودية للمراجعين والمحاسبين وزمالات SOCPA و CPA مع تفسير تفصيلي لكل إجابة.
          </p>
        </div>

        {/* Dynamic Card Container with exit animations */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden min-h-[400px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {!quizFinished ? (
              
              // -------------------- ACTIVE QUESTION VIEW --------------------
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="p-6 md:p-8 flex flex-col justify-between h-full flex-1"
              >
                
                {/* Question Info Progress */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full font-mono">
                      سؤال {currentIdx + 1} من {quizQuestions.length}
                    </span>
                    <div className="w-1/3 bg-slate-150 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-600 h-full transition-all duration-300"
                        style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Text */}
                  <h4 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                    {currentQuestion.question}
                  </h4>
                </div>

                {/* Multiple Choices List */}
                <div className="space-y-2.5 mt-6">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAns === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    
                    let bgBorderColor = 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700';
                    if (isSelected && !isSubmitted) {
                      bgBorderColor = 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-500';
                    } else if (isSubmitted) {
                      if (isCorrect) {
                        bgBorderColor = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
                      } else if (isSelected) {
                        bgBorderColor = 'bg-rose-50 border-rose-500 text-rose-850';
                      } else {
                        bgBorderColor = 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isSubmitted}
                        className={`w-full text-right p-4 rounded-xl border font-medium text-xs sm:text-sm flex items-center justify-between transition-all ${bgBorderColor}`}
                        id={`option-${idx}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-white border border-slate-250 flex items-center justify-center text-[10px] font-mono tracking-tight text-slate-500 font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {/* Submission indicators */}
                        {isSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                        {isSubmitted && isSelected && !isCorrect && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question Explanation Box */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-light"
                    >
                      <span className="font-extrabold text-slate-800 block mb-1">📘 التوضيح الفقهي المحاسبي للمسألة:</span>
                      {currentQuestion.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">FINANCIAL MCQ COMPILER</span>
                  
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAns === null}
                      className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-md cursor-pointer transition-transform active:scale-98"
                      id="btn-quiz-submit"
                    >
                      تأكيد الإجابة 🚀
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl flex items-center gap-1 shadow-md transition-transform active:scale-98"
                      id="btn-quiz-next"
                    >
                      {currentIdx + 1 === quizQuestions.length ? 'إنهاء الاختبار 🏁' : 'السؤال التالي ←'}
                    </button>
                  )}
                </div>

              </motion.div>
            ) : (
              
              // -------------------- FINISHED / RESULTS VIEW --------------------
              <motion.div
                key="quiz-finished"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 md:p-8 text-center space-y-8 flex flex-col justify-between h-full flex-1"
              >
                <div className="space-y-4 max-w-lg mx-auto py-6">
                  
                  {/* Performance Medal Illustration */}
                  <div className="bg-yellow-500/10 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto border-2 border-yellow-250 animate-bounce">
                    <Award className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-black text-slate-800">
                    أحسنت! أتممت بنجاح اختبار الكفاءة
                  </h3>
                  
                  {/* Scoring scale */}
                  <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold block mb-1">النتيجة النهائية المحققة:</span>
                    <span className="text-3xl font-black text-teal-600 font-mono">
                      {score} <span className="text-slate-350 text-xl">/ 5</span>
                    </span>
                    <p className="text-xs text-slate-500 font-light mt-1.5">
                      {score === 5 && '🏆 عبقرية مطلقة ومعرفة محاسبية كاملة بالمعايير الدولية!'}
                      {score >= 3 && score < 5 && '✨ أداء رائع تدل على فهم ممتاز لأركان الحسابات وعملك ممتاز!'}
                      {score < 3 && '📚 هناك بعض النقاط التي تطلب مراجعة، أعد تصفح المفاهيم بالتفصيل للحصول على العلامة الكاملة.'}
                    </p>
                  </div>

                </div>

                {/* Personalized Certificate Builder block */}
                {!showCertificate ? (
                  <div className="bg-teal-500/5 border border-teal-500/20 max-w-md mx-auto p-5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 justify-center text-teal-800">
                      <GraduationCap className="w-5.5 h-5.5 text-teal-600" />
                      <span className="font-bold text-sm">احصل على شهادة اجتياز تفاعلية مخصصة</span>
                    </div>
                    <p className="text-xs text-slate-500 font-light leading-snug">
                      أدخل اسمك الكريم أدناه لنقوم بجلب الأرقام وإضافة توقيع معتمد لشهادتك الشخصية فوراً تقديراً لكم.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="مثل: أسامة الحربي"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                      />
                      <button
                        onClick={() => userName.trim() ? setShowCertificate(true) : alert('يرجى كتابة الاسم أولاً')}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                        id="btn-generate-cert"
                      >
                        إصدار الشهادة 📜
                      </button>
                    </div>
                  </div>
                ) : (
                  
                  // Beautiful physical Certificate mock-up
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto border-8 border-double border-amber-300 bg-linear-to-b from-amber-50/20 via-white to-white p-6 md:p-8 rounded-2xl relative shadow-md text-right select-all"
                    id="certificate-printout"
                  >
                    {/* Badge Stamp Accent */}
                    <div className="absolute top-4 left-4 bg-yellow-500/10 text-yellow-600 p-2 rounded-full border border-yellow-300">
                      <ShieldCheck className="w-6 h-6 animate-pulse" />
                    </div>

                    <div className="text-center space-y-4">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 block">INTERACTIVE ACCOUNTING DIPLOMA</span>
                      <h4 className="text-xl font-bold text-amber-800">شهــادة تفـوق واجتـياز</h4>
                      <p className="text-xs text-slate-400">تُمنح هذه الوثيقة تقديراً للجهود والتميز العلمي في مبادئ المحاسبة الأساسية إلى:</p>
                      
                      <div className="py-2 inline-block border-b-2 border-slate-700 min-w-[200px] text-center my-1">
                        <span className="text-xl font-black text-slate-800 h-8 block">{userName}</span>
                      </div>

                      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                        نظير نجاحه الباهر واجتيازه لكافة الاختبارات التطبيقية التي تمثل "العناصر الخمسة الكبرى"، وحساب ميزان القيود للقيد المزدوج بتقدير ممتاز بنتيجة {score}/5.
                      </p>

                      <div className="grid grid-cols-2 pt-6 text-[10px] sm:text-xs text-slate-450 border-t border-slate-100 font-mono mt-4">
                        <div>
                          <span className="block text-slate-400">تاريخ الإصدار:</span>
                          <span className="font-bold text-slate-700">{new Date().toISOString().split('T')[0]}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400">رمز التحقق:</span>
                          <span className="font-bold text-slate-700 uppercase">IAC-{Math.floor(Math.random() * 900000 + 100000)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Footer Controls */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">SOCPA TRAINING ACADEMY</span>
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-bold bg-teal-50 px-4 py-2.5 rounded-xl transition-all"
                    id="btn-restart-quiz"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إعادة خوض الاختبار 🔄</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}

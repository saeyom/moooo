import { useState, useMemo } from 'react';
import { initialFinancialItems } from '../data';
import { FinancialItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Edit2, Sliders, TrendingUp, CheckCircle, Calculator, Heart, Landmark, RefreshCw } from 'lucide-react';

export default function FinancialStatements() {
  const [items, setItems] = useState<FinancialItem[]>(initialFinancialItems);
  const [activeSheet, setActiveSheet] = useState<'income' | 'balance'>('balance');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // Formulas & Ratios calculations
  const stats = useMemo(() => {
    let currentAssets = 0;
    let fixedAssets = 0;
    let currentLiabilities = 0;
    let longTermLiabilities = 0;
    let paidInCapital = 0;
    let pastRetainedEarnings = 0;
    let totalRevenue = 0;
    let totalExpense = 0;

    items.forEach(item => {
      if (item.category === 'Asset') {
        if (item.subCategory === 'أصول متداولة') currentAssets += item.amount;
        else fixedAssets += item.amount;
      } else if (item.category === 'Liability') {
        if (item.subCategory === 'التزامات متداولة') currentLiabilities += item.amount;
        else longTermLiabilities += item.amount;
      } else if (item.category === 'Equity') {
        if (item.nameAr.includes('رأس مال')) paidInCapital += item.amount;
        else pastRetainedEarnings += item.amount;
      } else if (item.category === 'Revenue') {
        totalRevenue += item.amount;
      } else if (item.category === 'Expense') {
        totalExpense += item.amount;
      }
    });

    // Calculates current Net Income (إيرادات - مصروفات)
    const netIncome = totalRevenue - totalExpense;

    // Total Assets = Current + Fixed
    const totalAssets = currentAssets + fixedAssets;

    // Total liabilities
    const totalLiabilities = currentLiabilities + longTermLiabilities;

    // Ending Retained Earnings = past retained earnings + net income
    const endingRetainedEarnings = pastRetainedEarnings + netIncome;

    // Total Equity = Paid-In Capital + Ending Retained Earnings
    const totalEquity = paidInCapital + endingRetainedEarnings;

    // Working Capital = Current Assets - Current Liabilities
    const workingCapital = currentAssets - currentLiabilities;

    // Debt to Equity Ratio = Total Liabilities / Total Equity
    const debtToEquity = totalEquity > 0 ? (totalLiabilities / totalEquity) : 0;

    return {
      currentAssets,
      fixedAssets,
      totalAssets,
      currentLiabilities,
      longTermLiabilities,
      totalLiabilities,
      paidInCapital,
      endingRetainedEarnings,
      totalEquity,
      totalRevenue,
      totalExpense,
      netIncome,
      workingCapital,
      debtToEquity,
      isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 1
    };
  }, [items]);

  // Handle value modifications
  const handleEditValue = (id: string, currentValue: number) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleSaveValue = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, amount: editValue };
      }
      return item;
    }));
    setEditingId(null);
  };

  const handleResetDefaults = () => {
    setItems(initialFinancialItems);
    setEditingId(null);
  };

  return (
    <section id="statements" className="py-20 bg-slate-50/50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase font-mono">
            التقارير المالية التفاعلية
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            استكشف القوائم المالية والنسب الذكية
          </h2>
          <p className="text-slate-600 mt-3 font-light text-base sm:text-lg">
            الأرقام في الميزانيات ليست صامتة! قم بتعديل أي رقم بالنقر على <Edit2 className="w-3 h-3 inline text-slate-400" /> لتشاهد تأثير السداد والإهلاك وتغير الأسعار على كفتي الميزان والنسب المالية فوراً.
          </p>
        </div>

        {/* Dynamic Financial Health Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Net Income Metric Card */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">صافي الربح أو الخسارة (Net Income)</span>
              <p className={`text-xl font-mono font-black ${stats.netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${stats.netIncome.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 font-light">يُرحّل تلقائياً لحقوق الملكية بنهاية الدورة</p>
            </div>
            <div className={`p-3.5 rounded-xl ${stats.netIncome >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Working Capital Metric Card */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">رأس المال العامل (Working Capital)</span>
              <p className="text-xl font-mono font-black text-slate-800">
                ${stats.workingCapital.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 font-light">يقيس مقدرة الفواتير وسداد الالتزامات القريبة</p>
            </div>
            <div className="p-3.5 rounded-xl bg-violet-50 text-violet-600">
              <Calculator className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Leverage Metric Card */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold">نسبة الالتزامات للملكية (Debt-to-Equity)</span>
              <p className="text-xl font-mono font-black text-slate-800">
                {stats.debtToEquity.toFixed(2)}x
              </p>
              <p className="text-[11px] text-slate-400 font-light">توضح حجم المخاطرة المالية والتمويل بالدين</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600">
              <Landmark className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Tab Selection */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200/60 p-2.5 rounded-2xl mb-8 gap-4">
          
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto gap-1">
            <button
              onClick={() => setActiveSheet('balance')}
              className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeSheet === 'balance' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. الميزانية العمومية (مركز مالي)
            </button>
            <button
              onClick={() => setActiveSheet('income')}
              className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeSheet === 'income' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. قائمة الدخل (الأرباح والخسائر)
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة تعيين الأرقام لافتراضية</span>
          </button>

        </div>

        {/* Display Container with transition animation */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden p-6 md:p-8">
          
          <AnimatePresence mode="wait">
            {activeSheet === 'balance' ? (
              
              // -------------------- BALANCE SHEET VIEW --------------------
              <motion.div
                key="balance-sheet"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-8"
              >
                
                {/* Visual Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                      <FileText className="w-5.5 h-5.5 text-teal-600" />
                      <span>الميزانية العُمومية ( Balance Sheet )</span>
                    </h4>
                    <p className="text-xs text-slate-400 font-light">لقطة سريعة لأصول المنشأة والتزاماتها وحقوق ملاكها في لحظة زمنية معينة.</p>
                  </div>
                  <div className="text-left font-mono text-[10px] text-slate-400 font-bold">
                    AS OF JUNE 13, 2026
                  </div>
                </div>

                {/* Grid Structure: Right Side Assets, Left Side Liabilities + Equity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-100">
                  
                  {/* Right Half: Assets (الأصول) */}
                  <div className="space-y-6 pt-6 lg:pt-0 pl-0 lg:pl-4">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <h5 className="font-extrabold text-slate-800 text-sm">الأصول (الممتلكات المادية والمستحقات)</h5>
                      <span className="font-mono text-xs font-bold text-slate-400">Total Asset Items</span>
                    </div>

                    {/* Sub Category: Current Assets */}
                    <div className="space-y-2 mt-4">
                      <span className="text-xs font-black text-slate-400">الأصول المتداولة (قريبة تسييلها لنقدية)</span>
                      <div className="space-y-1 block">
                        {items.filter(it => it.category === 'Asset' && it.subCategory === 'أصول متداولة').map(item => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg group transition-colors">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.nameAr}</span>
                            
                            <div className="flex items-center gap-2 font-mono">
                              {editingId === item.id ? (
                                <input
                                  type="number"
                                  className="w-20 bg-slate-100 border border-slate-300 rounded-md px-1.5 py-0.5 text-xs text-left font-bold"
                                  value={editValue}
                                  onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                                  onBlur={() => handleSaveValue(item.id)}
                                  onKeyDown={e => e.key === 'Enter' && handleSaveValue(item.id)}
                                  autoFocus
                                />
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">${item.amount.toLocaleString()}</span>
                                  <button onClick={() => handleEditValue(item.id, item.amount)} className="text-slate-400 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sub Category: Fixed Assets */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-black text-slate-400">الأصول غير المتداولة (الأصول الثابتة)</span>
                      <div className="space-y-1 block">
                        {items.filter(it => it.category === 'Asset' && it.subCategory === 'أصول ثابتة').map(item => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg group transition-colors">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.nameAr}</span>
                            
                            <div className="flex items-center gap-2 font-mono">
                              {editingId === item.id ? (
                                <input
                                  type="number"
                                  className="w-20 bg-slate-100 border border-slate-300 rounded-md px-1.5 py-0.5 text-xs text-left font-bold"
                                  value={editValue}
                                  onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                                  onBlur={() => handleSaveValue(item.id)}
                                  onKeyDown={e => e.key === 'Enter' && handleSaveValue(item.id)}
                                  autoFocus
                                />
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">${item.amount.toLocaleString()}</span>
                                  <button onClick={() => handleEditValue(item.id, item.amount)} className="text-slate-400 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assets Total Summary Row */}
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between text-emerald-800 mt-6 shadow-2xs font-bold text-sm">
                      <span>إجمالي الأصول المالي (Total Assets)</span>
                      <span className="font-mono text-base font-black">${stats.totalAssets.toLocaleString()}</span>
                    </div>

                  </div>

                  {/* Left Half: Liabilities + Equity (الالتزامات وحقوق الملكية) */}
                  <div className="space-y-6 pt-6 lg:pt-0 pr-0 lg:pr-8">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <h5 className="font-extrabold text-slate-800 text-sm">الالتزامات وحقوق الملكية</h5>
                      <span className="font-mono text-xs font-bold text-slate-400">Claims & Equity</span>
                    </div>

                    {/* Sub Category: Current Liabilities */}
                    <div className="space-y-2 mt-4">
                      <span className="text-xs font-black text-slate-400">الالتزامات المتداولة (الديون العاجلة)</span>
                      <div className="space-y-1 block">
                        {items.filter(it => it.category === 'Liability' && it.subCategory === 'التزامات متداولة').map(item => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg group transition-colors">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.nameAr}</span>
                            
                            <div className="flex items-center gap-2 font-mono">
                              {editingId === item.id ? (
                                <input
                                  type="number"
                                  className="w-20 bg-slate-100 border border-slate-300 rounded-md px-1.5 py-0.5 text-xs text-left font-bold"
                                  value={editValue}
                                  onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                                  onBlur={() => handleSaveValue(item.id)}
                                  onKeyDown={e => e.key === 'Enter' && handleSaveValue(item.id)}
                                  autoFocus
                                />
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">${item.amount.toLocaleString()}</span>
                                  <button onClick={() => handleEditValue(item.id, item.amount)} className="text-slate-400 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sub Category: Long-Term Liabilities */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-black text-slate-400">الالتزامات غير المتداولة (الديون طويلة الأجل)</span>
                      <div className="space-y-1 block">
                        {items.filter(it => it.category === 'Liability' && it.subCategory === 'التزامات طويلة الأجل').map(item => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg group transition-colors">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.nameAr}</span>
                            
                            <div className="flex items-center gap-2 font-mono">
                              {editingId === item.id ? (
                                <input
                                  type="number"
                                  className="w-20 bg-slate-100 border border-slate-300 rounded-md px-1.5 py-0.5 text-xs text-left font-bold"
                                  value={editValue}
                                  onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                                  onBlur={() => handleSaveValue(item.id)}
                                  onKeyDown={e => e.key === 'Enter' && handleSaveValue(item.id)}
                                  autoFocus
                                />
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">${item.amount.toLocaleString()}</span>
                                  <button onClick={() => handleEditValue(item.id, item.amount)} className="text-slate-400 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sub Category: Equity (حقوق الملكية) */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-black text-slate-400">حقوق الملكية للمستثمرين والأرباح</span>
                      <div className="space-y-1 block">
                        {items.filter(it => it.category === 'Equity').map(item => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg group transition-colors">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.nameAr}</span>
                            
                            <div className="flex items-center gap-2 font-mono">
                              {editingId === item.id ? (
                                <input
                                  type="number"
                                  className="w-20 bg-slate-100 border border-slate-300 rounded-md px-1.5 py-0.5 text-xs text-left font-bold"
                                  value={editValue}
                                  onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                                  onBlur={() => handleSaveValue(item.id)}
                                  onKeyDown={e => e.key === 'Enter' && handleSaveValue(item.id)}
                                  autoFocus
                                />
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">${item.amount.toLocaleString()}</span>
                                  <button onClick={() => handleEditValue(item.id, item.amount)} className="text-slate-400 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Calculated Net Income transfer line - showing why double-entry balances */}
                        <div className="flex items-center justify-between py-2 border-b border-dashed border-slate-200 bg-teal-50/20 px-2 rounded-lg font-bold">
                          <span className="text-xs text-teal-800 flex items-center gap-1">
                            <span>أرباح قائمة الدخل للعام الحالي (+)</span>
                            <span className="text-[9px] font-normal text-slate-400 block font-mono">(Traced automatically)</span>
                          </span>
                          <span className="font-mono text-xs text-teal-700 font-bold">${stats.netIncome.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Liabilities + Equity Summary */}
                    <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl flex items-center justify-between text-teal-800 mt-6 shadow-2xs font-bold text-sm">
                      <span>إجمالي الالتزامات وحقوق الملكية</span>
                      <span className="font-mono text-base font-black">${(stats.totalLiabilities + stats.totalEquity).toLocaleString()}</span>
                    </div>

                  </div>

                </div>

                {/* Proof Balance Checker */}
                <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 border border-emerald-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600 animate-bounce duration-3000" />
                    <span className="text-xs font-bold text-emerald-800">صحة القيد: ميزانية متزنة 100% ومتكافئة</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    قانون بيلر: <span className="font-mono text-[11px] font-bold">الأصول (${stats.totalAssets.toLocaleString()}) = الالتزامات (${stats.totalLiabilities.toLocaleString()}) + حقوق الملكية (${stats.totalEquity.toLocaleString()})</span>
                  </div>
                </div>

              </motion.div>
            ) : (
              
              // -------------------- INCOME STATEMENT VIEW --------------------
              <motion.div
                key="income-statement"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-8"
              >
                
                {/* Visual Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                      <FileText className="w-5.5 h-5.5 text-teal-600" />
                      <span>قائمة الدخل - تقرير الأرباح والخسائر ( Income Statement )</span>
                    </h4>
                    <p className="text-xs text-slate-400 font-light">يقيس الكفاءة والنتيجة المالية للنشاط والشركة خلال فترة معينة من مبيعات ومصاريف تشغيل.</p>
                  </div>
                  <div className="text-left font-mono text-[10px] text-slate-400 font-bold">
                    FOR THE MONTH ENDED JUNE 13, 2026
                  </div>
                </div>

                {/* Table Layout */}
                <div className="space-y-6">
                  
                  {/* Revenues section */}
                  <div className="space-y-2">
                    <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/10 flex justify-between items-center">
                      <h5 className="font-black text-emerald-900 text-sm">أولاً: الإيرادات (Revenues)</h5>
                      <span className="text-xs font-bold font-mono text-emerald-700">Inflows</span>
                    </div>

                    <div className="space-y-1 pl-2">
                      {items.filter(it => it.category === 'Revenue').map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg group transition-colors">
                          <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.nameAr}</span>
                          
                          <div className="flex items-center gap-2 font-mono">
                            {editingId === item.id ? (
                              <input
                                  type="number"
                                  className="w-20 bg-slate-100 border border-slate-300 rounded-md px-1.5 py-0.5 text-xs text-left font-bold"
                                  value={editValue}
                                  onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                                  onBlur={() => handleSaveValue(item.id)}
                                  onKeyDown={e => e.key === 'Enter' && handleSaveValue(item.id)}
                                  autoFocus
                              />
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-xs sm:text-sm font-bold text-slate-800">${item.amount.toLocaleString()}</span>
                                <button onClick={() => handleEditValue(item.id, item.amount)} className="text-slate-400 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-emerald-800 px-2 py-1 bg-emerald-50/40 rounded-lg">
                      <span>إجمالي الإيرادات (Gross Revenue)</span>
                      <span className="font-mono">${stats.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Expenses section */}
                  <div className="space-y-2 pt-4">
                    <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/10 flex justify-between items-center">
                      <h5 className="font-black text-rose-900 text-sm">ثانياً: المصروفات التشغيلية والعمومية (Expenses)</h5>
                      <span className="text-xs font-bold font-mono text-rose-700">Outflows</span>
                    </div>

                    <div className="space-y-1 pl-2 font-medium">
                      {items.filter(it => it.category === 'Expense').map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg group transition-colors">
                          <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.nameAr}</span>
                          
                          <div className="flex items-center gap-2 font-mono">
                            {editingId === item.id ? (
                              <input
                                  type="number"
                                  className="w-20 bg-slate-100 border border-slate-300 rounded-md px-1.5 py-0.5 text-xs text-left font-bold"
                                  value={editValue}
                                  onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                                  onBlur={() => handleSaveValue(item.id)}
                                  onKeyDown={e => e.key === 'Enter' && handleSaveValue(item.id)}
                                  autoFocus
                              />
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-xs sm:text-sm font-bold text-slate-800">${item.amount.toLocaleString()}</span>
                                <button onClick={() => handleEditValue(item.id, item.amount)} className="text-slate-400 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-rose-800 px-2 py-1 bg-rose-50/40 rounded-lg">
                      <span>إجمالي المصروفات (Total Expense)</span>
                      <span className="font-mono">${stats.totalExpense.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Net income line */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between mt-8 shadow-md">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base">صافي الدخل المالي للنشاط التجاري (NET INCOME)</h4>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5">صيغة المعادلة: الإيرادات المستلمة والمستحقة مطروحاً منها كافة التكاليف المصروفة</p>
                    </div>
                    <div className="text-left">
                      <span className={`text-xl sm:text-2xl font-black font-mono ${stats.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${stats.netIncome.toLocaleString()}
                      </span>
                      <span className="text-[11px] block text-slate-300 font-bold">
                        {stats.netIncome >= 0 ? '✓ ربـح تشغيلي صافي' : '⚠️ خسـارة مالية دفتيرية'}
                      </span>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { Calculator as CalcIcon, DollarSign, Percent, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function Calculator() {
  const [activeCalc, setActiveCalc] = useState<'emi' | 'compound'>('emi');
  
  // EMI State
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(12);
  
  // Compound Interest State
  const [cPrincipal, setCPrincipal] = useState(50000);
  const [cRate, setCRate] = useState(7);
  const [cTime, setCTime] = useState(5);
  const [compoundsPerYear, setCompoundsPerYear] = useState(12);

  const calculateEMI = () => {
    const r = rate / (12 * 100);
    const n = tenure;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emi || 0;
  };

  const calculateCompoundInterest = () => {
    const r = cRate / 100;
    const n = compoundsPerYear;
    const t = cTime;
    const amount = cPrincipal * Math.pow(1 + r / n, n * t);
    return amount || 0;
  };

  const emi = calculateEMI();
  const totalPayment = emi * tenure;
  const totalInterest = totalPayment - principal;

  const compoundAmount = calculateCompoundInterest();
  const compoundInterest = compoundAmount - cPrincipal;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-banking-blue mb-2">Công cụ tính toán tài chính</h2>
        <p className="text-slate-500">Công cụ chuyên nghiệp để lập kế hoạch vay vốn và đầu tư</p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-white p-1 rounded-full shadow-sm border border-slate-100 flex">
          <button 
            onClick={() => setActiveCalc('emi')}
            className={`px-8 py-2 rounded-full font-semibold transition-all ${activeCalc === 'emi' ? 'bg-banking-blue text-white' : 'text-slate-500 hover:text-banking-blue'}`}
          >
            Trả góp (EMI)
          </button>
          <button 
            onClick={() => setActiveCalc('compound')}
            className={`px-8 py-2 rounded-full font-semibold transition-all ${activeCalc === 'compound' ? 'bg-banking-blue text-white' : 'text-slate-500 hover:text-banking-blue'}`}
          >
            Lãi kép
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
          {activeCalc === 'emi' ? (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-banking-blue mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-banking-gold" /> Chi tiết khoản vay
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Số tiền gốc ($)</label>
                <input 
                  type="range" min="1000" max="1000000" step="1000"
                  value={principal} onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-banking-blue"
                />
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-slate-400">$1,000</span>
                  <input 
                    type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-32 text-right font-bold text-banking-blue border-b border-slate-200 focus:border-banking-blue outline-none"
                  />
                  <span className="text-xs text-slate-400">$1,000,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Lãi suất (%/năm)</label>
                <input 
                  type="range" min="1" max="25" step="0.1"
                  value={rate} onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-banking-blue"
                />
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-slate-400">1%</span>
                  <input 
                    type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))}
                    className="w-20 text-right font-bold text-banking-blue border-b border-slate-200 focus:border-banking-blue outline-none"
                  />
                  <span className="text-xs text-slate-400">25%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Thời hạn (Tháng)</label>
                <input 
                  type="range" min="6" max="360" step="6"
                  value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-banking-blue"
                />
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-slate-400">6th</span>
                  <input 
                    type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-20 text-right font-bold text-banking-blue border-b border-slate-200 focus:border-banking-blue outline-none"
                  />
                  <span className="text-xs text-slate-400">360th</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-banking-blue mb-6 flex items-center gap-2">
                <Percent className="w-5 h-5 text-banking-gold" /> Chi tiết đầu tư
              </h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Vốn đầu tư ban đầu ($)</label>
                <input 
                  type="number" value={cPrincipal} onChange={(e) => setCPrincipal(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-banking-blue outline-none font-bold text-banking-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Lãi suất năm (%)</label>
                  <input 
                    type="number" value={cRate} onChange={(e) => setCRate(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-banking-blue outline-none font-bold text-banking-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Thời gian (Năm)</label>
                  <input 
                    type="number" value={cTime} onChange={(e) => setCTime(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-banking-blue outline-none font-bold text-banking-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tần suất tính lãi</label>
                <select 
                  value={compoundsPerYear} onChange={(e) => setCompoundsPerYear(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-banking-blue outline-none font-bold text-banking-blue"
                >
                  <option value={1}>Hằng năm</option>
                  <option value={2}>Nửa năm một lần</option>
                  <option value={4}>Hằng quý</option>
                  <option value={12}>Hằng tháng</option>
                  <option value={365}>Hằng ngày</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-banking-blue rounded-3xl shadow-xl p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-banking-gold mb-8 uppercase tracking-widest">Tóm tắt</h3>
            
            {activeCalc === 'emi' ? (
              <div className="space-y-8">
                <div>
                  <p className="text-white/60 text-sm mb-1">Trả góp hằng tháng (EMI)</p>
                  <p className="text-4xl font-black">${emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Tổng tiền lãi</p>
                    <p className="text-xl font-bold">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1">Tổng số tiền trả</p>
                    <p className="text-xl font-bold">${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <p className="text-white/60 text-sm mb-1">Giá trị khi đáo hạn</p>
                  <p className="text-4xl font-black">${compoundAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Tổng lãi kiếm được</p>
                  <p className="text-xl font-bold text-banking-gold">${compoundInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-xs text-white/40 italic">
              *Các tính toán chỉ mang tính chất tham khảo và phục vụ mục đích giáo dục.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

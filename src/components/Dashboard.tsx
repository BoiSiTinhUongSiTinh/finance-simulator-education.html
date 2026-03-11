import React from 'react';
import { CATEGORIES } from '../data/mockData';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  onSelectCategory: (id: string) => void;
}

export default function Dashboard({ onSelectCategory }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-banking-blue mb-4"
        >
          Chào mừng đến với <span className="text-banking-gold">FinEdu</span>
        </motion.h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Làm chủ sự phức tạp của ngân hàng và tài chính hiện đại với nền tảng học tập tương tác của chúng tôi.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category, index) => {
          const IconComponent = (Icons as any)[category.icon];
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectCategory(category.id)}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 bg-banking-blue/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-banking-gold/10 transition-colors">
                {IconComponent && <IconComponent className="w-8 h-8 text-banking-blue group-hover:text-banking-gold transition-colors" />}
              </div>
              <h3 className="text-xl font-bold text-banking-blue mb-2">{category.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{category.description}</p>
              <div className="mt-6 flex items-center text-banking-gold font-semibold text-sm group-hover:gap-2 transition-all">
                Khám phá ngay <Icons.ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <section className="mt-20 bg-banking-blue rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng cho chứng chỉ của bạn?</h2>
          <p className="text-white/70 mb-8">
            Các mô-đun chuyên biệt của chúng tôi được thiết kế cho các chuyên gia ngân hàng và sinh viên chuẩn bị cho các kỳ thi CFA, FRM hoặc nội bộ ngân hàng.
          </p>
          <button className="bg-banking-gold text-banking-blue px-8 py-3 rounded-full font-bold hover:bg-white transition-colors">
            Bắt đầu bài kiểm tra
          </button>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Icons.Landmark className="w-full h-full transform translate-x-1/4 -translate-y-1/4" />
        </div>
      </section>
    </div>
  );
}

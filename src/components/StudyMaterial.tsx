import React from 'react';
import { BookOpen, CheckCircle, FileText, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

export default function StudyMaterial() {
  const sections = [
    {
      title: "Vai trò của Ngân hàng Trung ương",
      content: "Ngân hàng trung ương là cơ quan quản lý tiền tệ của một quốc gia. Các chức năng chính của họ bao gồm phát hành tiền tệ, quản lý chính sách tiền tệ và đóng vai trò là người cho vay cuối cùng cho các ngân hàng thương mại trong các cuộc khủng hoảng tài chính.",
      points: ["Ổn định giá cả", "Tạo việc làm tối đa", "Giám sát hệ thống tài chính"]
    },
    {
      title: "Các công cụ Chính sách Tiền tệ",
      content: "Ngân hàng trung ương sử dụng nhiều công cụ khác nhau để tác động đến nền kinh tế. Phổ biến nhất là Nghiệp vụ Thị trường Mở (OMO), nơi họ mua hoặc bán chứng khoán chính phủ để điều chỉnh cung tiền.",
      points: ["Lãi suất chiết khấu", "Dự trữ bắt buộc", "Lãi suất tiền gửi dự trữ"]
    },
    {
      title: "Hoạt động của Ngân hàng Thương mại",
      content: "Ngân hàng thương mại đóng vai trò trung gian giữa người tiết kiệm và người đi vay. Họ tạo ra doanh thu chủ yếu thông qua 'chênh lệch lãi suất'—sự khác biệt giữa lãi suất trả cho tiền gửi và lãi suất thu được từ các khoản vay.",
      points: ["Quản trị Tài sản-Nợ", "Đánh giá rủi ro tín dụng", "Quản trị thanh khoản"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-banking-blue mb-4">Tài liệu học: Ngân hàng Trung ương</h2>
        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Mô-đun 1.1</span>
          <span className="flex items-center gap-1"><Bookmark className="w-4 h-4" /> 15 phút đọc</span>
        </div>
      </header>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
          >
            <h3 className="text-xl font-bold text-banking-blue mb-4 flex items-center gap-2">
              <div className="w-2 h-8 bg-banking-gold rounded-full" />
              {section.title}
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              {section.content}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.points.map((point, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-banking-gold" />
                  {point}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-banking-gold/10 rounded-3xl border border-banking-gold/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-xl font-bold text-banking-blue mb-1">Sẵn sàng kiểm tra kiến thức?</h4>
          <p className="text-slate-600">Làm bài kiểm tra Ngân hàng Trung ương để xem bạn đã học được bao nhiêu.</p>
        </div>
        <button className="whitespace-nowrap bg-banking-blue text-white px-8 py-3 rounded-full font-bold hover:bg-banking-blue/90 transition-all">
          Làm bài kiểm tra ngay
        </button>
      </div>
    </div>
  );
}

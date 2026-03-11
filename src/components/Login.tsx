import React, { useState } from 'react';
import { Landmark, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !name) return;
    onLogin({ name: name || email.split('@')[0], email });
  };

  return (
    <div className="min-h-screen bg-banking-light flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-banking-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Landmark className="w-10 h-10 text-banking-gold" />
          </div>
          <h1 className="text-3xl font-bold text-banking-blue">FinEdu</h1>
          <p className="text-slate-500 mt-2">Nền tảng học tập tài chính chuyên nghiệp</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-banking-blue outline-none transition-all"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-banking-blue outline-none transition-all"
              />
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-banking-blue outline-none transition-all"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-banking-blue text-white py-4 rounded-xl font-bold hover:bg-banking-blue/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-banking-blue/20"
          >
            {isRegistering ? 'Đăng ký ngay' : 'Đăng nhập'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-medium text-banking-gold hover:text-banking-blue transition-colors"
          >
            {isRegistering ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
            <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

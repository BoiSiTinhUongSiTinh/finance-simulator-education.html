import React from 'react';
import { Landmark, BookOpen, Calculator, LayoutDashboard, HelpCircle, Flame, CheckCircle2, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; email: string } | null;
  streak: number;
  onLogout: () => void;
}

export default function Navbar({ activeTab, setActiveTab, user, streak, onLogout }: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'quiz', label: 'Bài kiểm tra', icon: HelpCircle },
    { id: 'calculator', label: 'Công cụ tính', icon: Calculator },
    { id: 'simulator', label: 'Giả lập AI', icon: Cpu },
    { id: 'study', label: 'Tài liệu học', icon: BookOpen },
    { id: 'tasks', label: 'Nhiệm vụ', icon: CheckCircle2 },
  ];

  return (
    <nav className="bg-banking-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <Landmark className="w-8 h-8 text-banking-gold" />
            <span className="text-2xl font-bold tracking-tight">FinEdu</span>
          </div>
          
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-banking-gold text-banking-blue' 
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-sm font-bold">{streak}</span>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 bg-banking-gold/20 hover:bg-banking-gold/30 px-3 py-1.5 rounded-full border border-banking-gold/30 transition-all">
                <div className="w-6 h-6 bg-banking-gold rounded-full flex items-center justify-center text-banking-blue font-bold text-xs uppercase">
                  {user?.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold hidden lg:block">{user?.name}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                <div className="px-4 py-2 border-bottom border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Đăng nhập với</p>
                  <p className="text-sm text-banking-blue font-bold truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

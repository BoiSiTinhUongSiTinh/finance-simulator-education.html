/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FlashcardModule from './components/FlashcardModule';
import QuizEngine from './components/QuizEngine';
import Calculator from './components/Calculator';
import StudyMaterial from './components/StudyMaterial';
import DailyTasks from './components/DailyTasks';
import FinancialSimulator from './components/FinancialSimulator';
import Login from './components/Login';
import { INITIAL_DAILY_TASKS, DailyTask } from './data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [streak, setStreak] = useState(3); // Mock streak
  const [points, setPoints] = useState(450); // Mock points
  const [tasks, setTasks] = useState<DailyTask[]>(INITIAL_DAILY_TASKS);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('fine_edu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem('fine_edu_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fine_edu_user');
    setActiveTab('dashboard');
  };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id && !task.completed) {
        setPoints(p => p + task.reward);
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onSelectCategory={(id) => setActiveTab('study')} />;
      case 'flashcards':
        return <FlashcardModule />;
      case 'quiz':
        return <QuizEngine />;
      case 'calculator':
        return <Calculator />;
      case 'simulator':
        return <FinancialSimulator points={points} setPoints={setPoints} />;
      case 'study':
        return <StudyMaterial />;
      case 'tasks':
        return (
          <DailyTasks 
            tasks={tasks} 
            streak={streak} 
            points={points} 
            onCompleteTask={handleCompleteTask} 
          />
        );
      default:
        return <Dashboard onSelectCategory={(id) => setActiveTab('study')} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-banking-light flex flex-col">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        streak={streak} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-banking-blue rounded-lg flex items-center justify-center">
              <span className="text-banking-gold font-bold text-xs">FE</span>
            </div>
            <span className="text-xl font-bold text-banking-blue">FinEdu</span>
          </div>
          <p className="text-slate-500 text-sm mb-6">
            Trao quyền cho thế hệ lãnh đạo tài chính tiếp theo thông qua giáo dục tương tác.
          </p>
          <div className="flex justify-center gap-8 text-slate-400 text-sm font-medium">
            <a href="#" className="hover:text-banking-blue transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-banking-blue transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-banking-blue transition-colors">Hỗ trợ khách hàng</a>
          </div>
          <p className="text-slate-300 text-xs mt-8">
            © {new Date().getFullYear()} Hệ thống học tập FinEdu. Bảo lưu mọi quyền.
          </p>
        </div>
      </footer>
    </div>
  );
}

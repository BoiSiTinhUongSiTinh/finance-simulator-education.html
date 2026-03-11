import React from 'react';
import { CheckCircle2, Circle, Trophy, Star, Flame, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { DailyTask } from '../data/mockData';

interface DailyTasksProps {
  tasks: DailyTask[];
  streak: number;
  points: number;
  onCompleteTask: (id: string) => void;
}

export default function DailyTasks({ tasks, streak, points, onCompleteTask }: DailyTasksProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chuỗi ngày</p>
            <p className="text-2xl font-black text-banking-blue">{streak} Ngày</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-banking-gold/20 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 text-banking-gold fill-banking-gold" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Điểm thưởng</p>
            <p className="text-2xl font-black text-banking-blue">{points} Pts</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hoàn thành</p>
            <p className="text-2xl font-black text-banking-blue">{completedCount}/{tasks.length}</p>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-banking-blue p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Nhiệm vụ hằng ngày</h2>
              <p className="text-white/60 text-sm">Hoàn thành để nhận điểm thưởng và duy trì chuỗi ngày học tập.</p>
            </div>
            <Calendar className="w-8 h-8 text-banking-gold opacity-50" />
          </div>
          
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-banking-gold h-full"
            />
          </div>
          <p className="text-right text-xs mt-2 font-bold text-banking-gold">{Math.round(progress)}% Hoàn thành</p>
        </div>

        <div className="p-4 md:p-8 space-y-4">
          {tasks.map((task, index) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                task.completed 
                  ? 'bg-emerald-50 border-emerald-100' 
                  : 'bg-white border-slate-100 hover:border-banking-blue/30'
              }`}
            >
              <div className="flex items-center gap-4">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300" />
                )}
                <div>
                  <h3 className={`font-bold ${task.completed ? 'text-emerald-700 line-through opacity-50' : 'text-banking-blue'}`}>
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">+{task.reward} Điểm thưởng</p>
                </div>
              </div>
              
              {!task.completed && (
                <button 
                  onClick={() => onCompleteTask(task.id)}
                  className="bg-banking-blue text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-banking-blue/90 transition-all"
                >
                  Nhận thưởng
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-400 text-sm">
          Nhiệm vụ sẽ được làm mới sau <span className="font-bold text-banking-blue">08:24:12</span>
        </p>
      </div>
    </div>
  );
}

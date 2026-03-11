import React, { useState } from 'react';
import { CENTRAL_BANKING_QUIZ } from '../data/mockData';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuizEngine() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === CENTRAL_BANKING_QUIZ[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < CENTRAL_BANKING_QUIZ.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const progress = ((currentQuestion + 1) / CENTRAL_BANKING_QUIZ.length) * 100;

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-banking-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-banking-gold" />
          </div>
          <h2 className="text-3xl font-bold text-banking-blue mb-2">Hoàn thành bài kiểm tra!</h2>
          <p className="text-slate-500 mb-8">Chúc mừng bạn đã hoàn thành mô-đun Ngân hàng Trung ương.</p>
          
          <div className="text-6xl font-black text-banking-blue mb-4">
            {score} <span className="text-2xl text-slate-400">/ {CENTRAL_BANKING_QUIZ.length}</span>
          </div>
          
          <div className="w-full bg-slate-100 h-4 rounded-full mb-12 overflow-hidden">
            <div 
              className="bg-banking-gold h-full transition-all duration-1000" 
              style={{ width: `${(score / CENTRAL_BANKING_QUIZ.length) * 100}%` }}
            />
          </div>

          <button 
            onClick={resetQuiz}
            className="flex items-center gap-2 bg-banking-blue text-white px-8 py-3 rounded-full font-bold hover:bg-banking-blue/90 transition-all mx-auto"
          >
            <RotateCcw className="w-5 h-5" /> Làm lại bài kiểm tra
          </button>
        </motion.div>
      </div>
    );
  }

  const question = CENTRAL_BANKING_QUIZ[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-banking-gold font-bold text-sm uppercase tracking-widest">Câu hỏi {currentQuestion + 1} / {CENTRAL_BANKING_QUIZ.length}</span>
            <h2 className="text-2xl font-bold text-banking-blue mt-1">Kiến thức Ngân hàng Trung ương</h2>
          </div>
          <span className="text-slate-400 font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-banking-blue h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <motion.div 
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12"
      >
        <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-8 leading-tight">
          {question.question}
        </h3>

        <div className="space-y-4">
          {question.options.map((option, idx) => {
            let statusClass = "border-slate-200 hover:border-banking-blue hover:bg-slate-50";
            if (isAnswered) {
              if (idx === question.correctAnswer) statusClass = "border-emerald-500 bg-emerald-50 text-emerald-700";
              else if (idx === selectedOption) statusClass = "border-rose-500 bg-rose-50 text-rose-700";
              else statusClass = "border-slate-100 opacity-50";
            } else if (selectedOption === idx) {
              statusClass = "border-banking-blue bg-banking-blue/5 text-banking-blue font-semibold";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${statusClass}`}
              >
                <span>{option}</span>
                {isAnswered && idx === question.correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="w-5 h-5 text-rose-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <h4 className="font-bold text-banking-blue mb-2">Giải thích:</h4>
              <p className="text-slate-600 leading-relaxed">{question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex justify-end">
          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className={`px-10 py-3 rounded-full font-bold transition-all ${
                selectedOption !== null 
                  ? 'bg-banking-blue text-white hover:bg-banking-blue/90' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Kiểm tra đáp án
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-banking-gold text-banking-blue px-10 py-3 rounded-full font-bold hover:bg-banking-gold/90 transition-all"
            >
              {currentQuestion + 1 === CENTRAL_BANKING_QUIZ.length ? 'Xem kết quả' : 'Câu tiếp theo'} <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

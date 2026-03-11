import React, { useState } from 'react';
import { CENTRAL_BANKING_FLASHCARDS } from '../data/mockData';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FlashcardModule() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CENTRAL_BANKING_FLASHCARDS.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + CENTRAL_BANKING_FLASHCARDS.length) % CENTRAL_BANKING_FLASHCARDS.length);
    }, 150);
  };

  const currentCard = CENTRAL_BANKING_FLASHCARDS[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-banking-blue mb-2">Flashcards Ngân hàng Trung ương</h2>
        <p className="text-slate-500">Nhấn vào thẻ để lật và xem định nghĩa</p>
      </div>

      <div className="flex flex-col items-center">
        <div 
          className={`relative w-full max-w-md h-80 perspective-1000 cursor-pointer ${isFlipped ? 'card-flip' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="card-inner relative w-full h-full preserve-3d">
            {/* Front */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border-2 border-banking-blue/5 flex flex-col items-center justify-center p-8 backface-hidden">
              <span className="text-banking-gold font-bold text-sm uppercase tracking-widest mb-4">Thuật ngữ</span>
              <h3 className="text-2xl md:text-3xl font-bold text-banking-blue text-center">{currentCard.term}</h3>
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 bg-banking-blue rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180">
              <span className="text-banking-gold font-bold text-sm uppercase tracking-widest mb-4">Định nghĩa</span>
              <p className="text-white text-center text-lg leading-relaxed">{currentCard.definition}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-8">
          <button 
            onClick={handlePrev}
            className="p-4 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-slate-50 transition-all text-banking-blue"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-slate-500 font-medium">
            {currentIndex + 1} / {CENTRAL_BANKING_FLASHCARDS.length}
          </div>

          <button 
            onClick={handleNext}
            className="p-4 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-slate-50 transition-all text-banking-blue"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <button 
          onClick={() => {
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="mt-8 flex items-center gap-2 text-banking-gold font-semibold hover:text-banking-blue transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Làm mới bộ thẻ
        </button>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Cpu, Send, RefreshCw, AlertCircle, Coins, Trophy, TrendingUp, ShieldCheck, Landmark, Wallet, BarChart3, ArrowUpRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FinancialSimulatorProps {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}

type SimulationLevel = {
  id: 'basic' | 'intermediate' | 'advanced';
  label: string;
  cost: number;
  description: string;
};

const LEVELS: SimulationLevel[] = [
  { id: 'basic', label: 'Cơ bản', cost: 200, description: 'Phù hợp cho người mới bắt đầu. Tập trung vào các khái niệm đơn giản.' },
  { id: 'intermediate', label: 'Trung cấp', cost: 500, description: 'Yêu cầu kiến thức về báo cáo tài chính và chỉ số vĩ mô.' },
  { id: 'advanced', label: 'Cao cấp', cost: 1000, description: 'Kịch bản phức tạp, đòi hỏi phân tích chuyên sâu và đa chiều.' },
];

const SYSTEM_INSTRUCTION = `Bạn là "Hệ thống Mô phỏng Tài chính Thông minh" (Financial Intelligence Simulator). Bạn vận hành theo 3 chế độ riêng biệt:

### CHẾ ĐỘ 1: KIỂM TRA ĐẦU VÀO (5 CÂU HỎI)
- Mục tiêu: Phân loại trình độ.
- Quy tắc:
  1. Đưa ra từng câu hỏi trắc nghiệm kèm theo định dạng: [OPTIONS]: {"A": "...", "B": "...", "C": "...", "D": "..."}.
  2. Khi người dùng chọn: CHỈ giải giải thích bản chất kiến thức tại sao lựa chọn đó đúng hoặc sai. 
  3. TUYỆT ĐỐI KHÔNG tiết lộ đáp án đúng là chữ cái nào (A, B, C hay D) nếu người dùng chọn sai để họ phải tự suy ngẫm.
  4. Sau 5 câu, tổng kết trình độ: Newbie, Amateur, hoặc Pro.

### CHẾ ĐỘ 2: GIẢ LẬP THỰC CHIẾN (SANDBOX)
- Đích đến (Win Condition): Người dùng phải đạt được 150.000.000 VNĐ (Lợi nhuận 50%) trong vòng 10 lượt quyết định để "Tốt nghiệp".
- Quy tắc cập nhật tài sản (Bắt buộc):
  Mỗi lựa chọn của người dùng PHẢI dẫn đến sự thay đổi số dư tiền mặt. Bạn phải tính toán logic và trả về khối JSON ở cuối mỗi phản hồi để hệ thống cập nhật Dashboard:
  Định dạng: [DATA_UPDATE]: {"cash": 120000000, "turn": 3, "message": "Lãi/Lỗ cụ thể"}

- Ma trận kết quả (Cố định):
  1. Giữ tiền mặt + Lạm phát cao = -10% tiền mặt.
  2. Vay nợ (Leverage) + Lãi suất tăng = -20% tiền mặt.
  3. Đầu tư đúng ngành hot + Thị trường ổn định = +15% tiền mặt.

### CHẾ ĐỘ 3: QUẢN LÝ NHIỆM VỤ (QUEST SYSTEM)
- Mỗi khi người dùng bắt đầu hành trình, hãy chào mừng và đưa ra "Nhiệm vụ hôm nay".
- Nhiệm vụ phải bám sát trình độ (Level) hiện tại của người dùng.
- Sau khi người dùng hoàn thành một hành động trong Giả lập, hãy kiểm tra xem họ có đạt mục tiêu nhiệm vụ không.
- Trả về JSON: [QUEST_UPDATE]: {"task_id": 1, "status": "completed", "bonus_cash": 1000000, "progress": 100, "task_name": "Tên nhiệm vụ"}

### PHONG CÁCH PHẢN HỒI:
- Luôn cung cấp [OPTIONS] cho nút bấm khi có lựa chọn.
- Luôn cung cấp [DATA_UPDATE] trong phần Giả lập thực chiến.
- Luôn cung cấp [QUEST_UPDATE] khi có thay đổi về nhiệm vụ.
- Ngôn ngữ: Tiếng Việt, chuyên nghiệp nhưng dễ hiểu.`;

export default function FinancialSimulator({ points, setPoints }: FinancialSimulatorProps) {
  const [level, setLevel] = useState<SimulationLevel | null>(null);
  const [userDecision, setUserDecision] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<any>(null);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
  const [options, setOptions] = useState<{ [key: string]: string } | null>(null);

  // Simulator Internal State
  const [cash, setCash] = useState(100000000); // 100M VND initial
  const [stocks, setStocks] = useState(0);
  const [simLevel, setSimLevel] = useState("Tập sự");
  const [turn, setTurn] = useState(0);
  const [lastMessage, setLastMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [currentQuest, setCurrentQuest] = useState<{ id: number; name: string; progress: number; completed: boolean } | null>(null);

  const aiRef = useRef<GoogleGenAI | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.env.GEMINI_API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    // Streak logic
    const updateStreak = () => {
      const lastLogin = localStorage.getItem('fs_lastLogin');
      const today = new Date().toDateString();
      let currentStreak = parseInt(localStorage.getItem('fs_streak') || '0');

      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastLogin === yesterday.toDateString()) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        localStorage.setItem('fs_lastLogin', today);
        localStorage.setItem('fs_streak', currentStreak.toString());
      }
      setStreak(currentStreak);
    };

    updateStreak();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const parseAIResponse = (text: string) => {
    let cleanedText = text;

    // 1. Parse DATA_UPDATE
    const dataMatch = cleanedText.match(/\[DATA_UPDATE\]:\s*(\{.*\})/);
    if (dataMatch) {
      try {
        const newData = JSON.parse(dataMatch[1]);
        if (newData.cash !== undefined) setCash(newData.cash);
        if (newData.turn !== undefined) setTurn(newData.turn);
        if (newData.message !== undefined) setLastMessage(newData.message);
        cleanedText = cleanedText.replace(/\[DATA_UPDATE\]:\s*\{.*\}/, '').trim();
      } catch (e) {
        console.error("Failed to parse data update JSON", e);
      }
    }

    // 2. Parse QUEST_UPDATE
    const questMatch = cleanedText.match(/\[QUEST_UPDATE\]:\s*(\{.*\})/);
    if (questMatch) {
      try {
        const questData = JSON.parse(questMatch[1]);
        setCurrentQuest({
          id: questData.task_id,
          name: questData.task_name || "Nhiệm vụ hàng ngày",
          progress: questData.progress || 0,
          completed: questData.status === 'completed'
        });
        if (questData.status === 'completed' && questData.bonus_cash) {
          setCash(prev => prev + questData.bonus_cash);
        }
        cleanedText = cleanedText.replace(/\[QUEST_UPDATE\]:\s*\{.*\}/, '').trim();
      } catch (e) {
        console.error("Failed to parse quest update JSON", e);
      }
    }

    // 3. Parse OPTIONS
    const optionsMatch = cleanedText.match(/\[OPTIONS\]:\s*(\{.*\})/);
    if (optionsMatch) {
      try {
        const parsed = JSON.parse(optionsMatch[1]);
        setOptions(parsed);
        cleanedText = cleanedText.replace(/\[OPTIONS\]:\s*\{.*\}/, '').trim();
      } catch (e) {
        console.error("Failed to parse options JSON", e);
      }
    } else {
      setOptions(null);
    }

    return cleanedText;
  };

  const startSimulation = async (selectedLevel: SimulationLevel) => {
    if (points < selectedLevel.cost) {
      setError(`Bạn không đủ điểm! Cần ${selectedLevel.cost} Pts nhưng bạn chỉ có ${points} Pts.`);
      return;
    }

    setLoading(true);
    setError(null);
    setUserDecision('');
    setHistory([]);
    setCash(100000000);
    setStocks(0);
    setSimLevel("Tập sự");
    setTurn(0);
    setLastMessage("");
    setOptions(null);
    setCurrentQuest(null);

    try {
      if (!aiRef.current) throw new Error("AI chưa được khởi tạo.");

      const newChat = aiRef.current.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      setChat(newChat);
      const response = await newChat.sendMessage({ message: `Tôi muốn bắt đầu hành trình trở thành nhà đầu tư. Hãy bắt đầu bằng việc chào mừng, đưa ra Nhiệm vụ hôm nay (CHẾ ĐỘ 3) và sau đó là câu hỏi đầu tiên của CHẾ ĐỘ 1: KIỂM TRA ĐẦU VÀO.` });
      
      const cleanedText = parseAIResponse(response.text);
      setHistory([{ role: 'model', text: cleanedText }]);
      setPoints(prev => prev - selectedLevel.cost);
      setLevel(selectedLevel);
    } catch (err: any) {
      setError("Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitDecision = async (decision?: string) => {
    const textToSubmit = decision || userDecision;
    if (!textToSubmit.trim() || !chat) return;

    setLoading(true);
    setError(null);
    setUserDecision('');
    setHistory(prev => [...prev, { role: 'user', text: textToSubmit }]);

    try {
      const response = await chat.sendMessage({ message: textToSubmit });
      const aiText = response.text;
      
      const cleanedText = parseAIResponse(aiText);
      setHistory(prev => [...prev, { role: 'model', text: cleanedText }]);
      
      // Update simLevel based on AI content if it mentions ranking
      if (aiText.includes("Newbie")) setSimLevel("Newbie");
      if (aiText.includes("Amateur")) setSimLevel("Amateur");
      if (aiText.includes("Pro")) setSimLevel("Pro");

      // Check win/loss condition (150M in 10 turns)
      if (turn >= 10 || cash >= 150000000) {
        if (cash >= 150000000) {
          setLastMessage("CHÚC MỪNG! BẠN ĐÃ TỐT NGHIỆP!");
        } else if (turn >= 10) {
          setLastMessage("HẾT LƯỢT! BẠN CẦN CỐ GẮNG HƠN.");
        }
      }

    } catch (err: any) {
      setError("Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLevel(null);
    setUserDecision('');
    setChat(null);
    setHistory([]);
  };

  if (!level) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20">
            <Cpu className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-indigo-900 mb-4 tracking-tight">Financial Intelligence Simulator</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Hành trình từ con số 0 trở thành nhà đầu tư thực thụ thông qua các kịch bản thực tế và đánh giá năng lực AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LEVELS.map((l) => (
            <motion.div
              key={l.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    l.id === 'basic' ? 'bg-emerald-100 text-emerald-700' :
                    l.id === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {l.label}
                  </span>
                  <div className="flex items-center gap-1 text-indigo-600 font-black">
                    <Coins className="w-4 h-4" /> {l.cost}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{l.label} Journey</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{l.description}</p>
              </div>
              <button
                onClick={() => startSimulation(l)}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Bắt đầu hành trình'}
              </button>
            </motion.div>
          ))}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </div>
    );
  }

  const totalAssets = cash + stocks;
  const isLoss = totalAssets < 100000000;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-100">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow-lg flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight uppercase">Finance Simulator v1.0</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-indigo-500 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
            Cấp độ: <strong className="text-white">{simLevel}</strong>
          </span>
          <button onClick={reset} className="text-white/60 hover:text-white transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Dashboard */}
        <aside className="w-80 lg:w-96 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Tài sản của bạn</h2>
            {turn > 0 && (
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Lượt: {turn}/10
              </span>
            )}
          </div>

          {/* Streak & Quests */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-[10px] text-orange-600 font-bold uppercase">Chuỗi hiện tại</p>
                <p className="text-lg font-black text-orange-700">{streak} Ngày</p>
              </div>
            </div>

            {currentQuest && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex justify-between items-center">
                  Nhiệm vụ ngày 
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${currentQuest.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {currentQuest.completed ? 'Đã xong' : 'Đang thực hiện'}
                  </span>
                </h4>
                <div className="space-y-3">
                  <div className="group">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 italic font-medium">{currentQuest.name}</span>
                      <span className="font-bold text-indigo-600">{currentQuest.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${currentQuest.progress}%` }}
                        className="bg-indigo-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Total Assets Card */}
          <motion.div 
            animate={{ backgroundColor: isLoss ? '#f43f5e' : '#10b981' }}
            className={`p-6 rounded-3xl text-white shadow-xl transition-colors duration-500 relative overflow-hidden`}
          >
            <div className="relative z-10">
              <p className="text-xs opacity-80 font-medium mb-1 uppercase tracking-wider">Tổng tài sản (VNĐ)</p>
              <h3 className="text-3xl font-black tracking-tight">{totalAssets.toLocaleString()}</h3>
              <div className="mt-4 flex items-center gap-2 text-xs bg-black/20 w-fit px-3 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                <span>{lastMessage || (isLoss ? 'Giảm sức mua' : 'Tăng trưởng ổn định')}</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Wallet className="w-32 h-32" />
            </div>
          </motion.div>

          {/* Asset Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Coins className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Tiền mặt</p>
                  <p className="text-[10px] text-slate-400 italic">Sẵn sàng đầu tư</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">{cash.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Cổ phiếu (VN30)</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Giá trị hiện tại</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">{stocks.toLocaleString()}</span>
            </div>
          </div>

          {/* Stats/History Placeholder */}
          <div className="mt-auto p-5 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử giao dịch</span>
            </div>
            <p className="text-center text-slate-400 text-[11px] italic leading-relaxed">
              Hoàn thành bài kiểm tra đánh giá để kích hoạt biểu đồ tăng trưởng và lịch sử giao dịch.
            </p>
          </div>
        </aside>

        {/* Right Section: AI Chat */}
        <section className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {/* Chat Window */}
          <div 
            ref={scrollRef}
            className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth"
          >
            {history.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-lg shadow-indigo-600/20">
                    AI
                  </div>
                )}
                <div className={`max-w-[80%] p-5 rounded-2xl shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500' 
                    : 'bg-white text-slate-700 rounded-tl-none border-slate-200'
                }`}>
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'} 
                    prose-headings:text-inherit prose-strong:text-inherit 
                    prose-table:border prose-table:border-slate-200 prose-th:bg-slate-100/50 prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-slate-200`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 animate-pulse">
                  AI
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm ml-3">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            {/* Quick Actions (Dynamic Options from AI) */}
            <AnimatePresence>
              {options && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide"
                >
                  {Object.entries(options).map(([key, value]) => (
                    <button 
                      key={key}
                      onClick={() => submitDecision(`${key}. ${value}`)}
                      disabled={loading}
                      className="whitespace-nowrap px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100 disabled:opacity-50 shadow-sm"
                    >
                      <span className="text-indigo-400 mr-1">{key}.</span> {value}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              <input 
                type="text" 
                value={userDecision}
                onChange={(e) => setUserDecision(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitDecision();
                  }
                }}
                placeholder="Nhập câu trả lời hoặc lệnh của bạn..." 
                className="flex-1 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-slate-50/50"
              />
              <button 
                onClick={() => submitDecision()}
                disabled={loading || !userDecision.trim()}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">GỬI</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

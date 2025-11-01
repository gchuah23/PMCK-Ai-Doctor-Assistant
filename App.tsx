import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import DoctorCard from './components/DoctorCard';
import ChatInterface from './components/ChatInterface';
import WelcomeScreen from './components/WelcomeScreen';
import { PMCK_DOCTORS } from './constants';
import { ChatMessage, MessageSender, AppMode, Doctor } from './types';
import { runQuery } from './services/geminiService';
import SearchIcon from './components/icons/SearchIcon';
import LightBulbIcon from './components/icons/LightBulbIcon';
import ClipboardCheckIcon from './components/icons/ClipboardCheckIcon';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';

const getModeInfo = (mode: AppMode | null) => {
    switch (mode) {
        case AppMode.ASK_QUESTION:
            return { title: "Ask a Health Question", prompt: "Welcome! Ask any health-related question, and I'll provide an answer from the perspective of a relevant PMCK specialist." };
        case AppMode.VERIFY_ARTICLE:
            return { title: "Verify Article Snippet", prompt: "Please paste the article snippet and the doctor's name below to verify its accuracy against our specialists' profiles." };
        case AppMode.FIND_DOCTOR:
            return { title: "Find the Right Specialist", prompt: "Describe a health condition or medical topic, and I will suggest the most suitable PMCK doctor." };
        case AppMode.HEALTH_TIP:
            return { title: "Health Tip of the Day", prompt: "" };
        default:
            return { title: "", prompt: "" };
    }
}


function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AppMode | null>(null);

  // State for verification form
  const [snippet, setSnippet] = useState('');
  const [doctorName, setDoctorName] = useState('');


  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = { sender: MessageSender.USER, text: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');
    setSnippet('');
    setDoctorName('');

    try {
      const responseText = await runQuery(message);
      const botMessage: ChatMessage = { sender: MessageSender.BOT, text: responseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: ChatMessage = { sender: MessageSender.BOT, text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleActionSelect = (selectedMode: AppMode) => {
    setMode(selectedMode);
    if (selectedMode === AppMode.HEALTH_TIP) {
        setMessages([]);
        handleSendMessage("Give me a Health Tip of the Day.");
    } else {
        const { prompt } = getModeInfo(selectedMode);
        setMessages([{ sender: MessageSender.BOT, text: prompt }]);
    }
  };

  const handleStartOver = () => {
    setMode(null);
    setMessages([]);
    setInput('');
    setSnippet('');
    setDoctorName('');
  }

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snippet.trim() || !doctorName.trim()) {
      alert("Please fill in both the snippet and the doctor's name.");
      return;
    }
    const verificationPrompt = `I have an article snippet mentioning "${doctorName}". Here is the snippet: "${snippet}". Based on your knowledge of PMCK doctors, please verify if Dr. ${doctorName} is a suitable expert for this topic and if the information is plausible given their specialty.`;
    handleSendMessage(verificationPrompt);
  }

  const modeInfo = getModeInfo(mode);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Interaction Pane */}
          <div className="lg:col-span-2 h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-slate-200">
            { !mode ? (
                <WelcomeScreen onActionSelect={handleActionSelect} />
            ) : (
                <>
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-700">{modeInfo.title}</h2>
                    <button onClick={handleStartOver} className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
                        Start Over
                    </button>
                </div>
                <ChatInterface 
                  messages={messages}
                  isLoading={isLoading}
                />
                
                <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
                    {mode === AppMode.VERIFY_ARTICLE ? (
                        <form onSubmit={handleVerificationSubmit}>
                            <textarea
                                value={snippet}
                                onChange={(e) => setSnippet(e.target.value)}
                                placeholder="Paste article snippet here..."
                                disabled={isLoading}
                                rows={4}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow disabled:bg-slate-100 mb-3 text-sm"
                            />
                             <input
                                type="text"
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
                                placeholder="Enter doctor's name (e.g., Dr. Yong Chen Fei)"
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow disabled:bg-slate-100 mb-3 text-sm"
                            />
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed transition-colors font-semibold">
                                <ClipboardCheckIcon className="w-5 h-5 mr-2" />
                                Verify Snippet
                            </button>
                        </form>
                    ) : (
                        <>
                        <form onSubmit={handleStandardSubmit} className="flex items-center space-x-3">
                        <div className="relative flex-grow">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === AppMode.FIND_DOCTOR ? "Describe a condition to find a specialist..." : "Ask a question..."}
                            disabled={isLoading}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow disabled:bg-slate-100"
                            />
                        </div>
                        <button type="submit" disabled={isLoading} className="bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed transition-colors shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                        </form>
                        <button 
                            onClick={() => handleActionSelect(AppMode.HEALTH_TIP)}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center text-center bg-slate-200/50 text-slate-600 font-semibold p-2 rounded-lg text-sm hover:bg-slate-200 transition-colors mt-3 disabled:opacity-50"
                        >
                            <LightBulbIcon className="w-5 h-5 mr-2"/>
                            Get a Health Tip of the Day
                        </button>
                        </>
                    )}
                </div>
            </>
            )}
          </div>

          {/* Doctors Pane */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-bold text-slate-700 mb-4">PMCK Specialists Directory</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                {PMCK_DOCTORS.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default App;
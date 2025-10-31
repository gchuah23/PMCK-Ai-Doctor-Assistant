import React, { useState, useRef, useEffect } from 'react';
import { AppMode, ChatMessage, MessageSender } from '../types';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ChatInterfaceProps {
  mode: AppMode;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onStartOver: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ mode, messages, isLoading, onSendMessage, onStartOver }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const placeholders: { [key in AppMode]: string } = {
    [AppMode.ASK_QUESTION]: 'e.g., What are the common symptoms of a heart attack?',
    [AppMode.VERIFY_ARTICLE]: 'Paste a quote and the doctor\'s name, e.g., "Dr. Chiam Kok Peng said regular exercise is key for bone density."',
    [AppMode.FIND_DOCTOR]: 'e.g., I have persistent skin rashes.',
    [AppMode.HEALTH_TIP]: 'Click "Get Tip" for a new health tip!',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleGetTip = () => {
    if (!isLoading) {
      onSendMessage('Generate a health tip.');
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
        <h2 className="text-lg font-bold text-slate-700">{mode}</h2>
        <button 
          onClick={onStartOver} 
          className="flex items-center text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors"
          title="Go back to main menu"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
          Start Over
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === MessageSender.BOT && (
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                  <BotIcon />
                </div>
              )}
              <div className={`max-w-xl p-3 rounded-xl ${msg.sender === MessageSender.USER ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                 <div className="prose prose-sm max-w-none prose-p:my-2" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
              </div>
              {msg.sender === MessageSender.USER && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <UserIcon />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                  <BotIcon />
                </div>
                <div className="max-w-md p-3 rounded-xl bg-slate-100 text-slate-800 rounded-bl-none">
                  <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
        {mode === AppMode.HEALTH_TIP ? (
           <button onClick={handleGetTip} disabled={isLoading} className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Getting Tip...' : 'Get New Health Tip'}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholders[mode]}
              disabled={isLoading}
              className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow disabled:bg-slate-100"
            />
            <button type="submit" disabled={isLoading} className="bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
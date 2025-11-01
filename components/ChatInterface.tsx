import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageSender } from '../types';
import UserIcon from './icons/UserIcon';
import BotIcon from './icons/BotIcon';
// FIX: Import ReactMarkdown to safely render markdown content from the AI.
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === MessageSender.BOT && (
              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                <BotIcon />
              </div>
            )}
            <div className={`max-w-xl p-3 rounded-xl shadow-sm ${msg.sender === MessageSender.USER ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
              {/* FIX: Use ReactMarkdown for bot responses to correctly render markdown and avoid security risks with dangerouslySetInnerHTML. User messages are rendered as plain text. */}
              {msg.sender === MessageSender.BOT ? (
                <div className="prose prose-sm max-w-none prose-p:my-2">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
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
              <div className="max-w-md p-3 rounded-xl shadow-sm bg-slate-100 text-slate-800 rounded-bl-none">
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
  );
};

export default ChatInterface;

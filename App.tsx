import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import DoctorCard from './components/DoctorCard';
import ChatInterface from './components/ChatInterface';
import WelcomeScreen from './components/WelcomeScreen';
import { DOCTORS } from './lib/doctors';
import { AppMode, ChatMessage, MessageSender } from './types';
import { runQuery } from './services/geminiService';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.ASK_QUESTION);
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getWelcomeMessage = (currentMode: AppMode): string => {
    switch(currentMode) {
      case AppMode.ASK_QUESTION:
        return "Hello! I'm here to help you with the 'Ask The Doctor' series. What medical question do you have? I will find the most relevant PMCK doctor to answer it.";
      case AppMode.VERIFY_ARTICLE:
        return "Ready to fact-check! Please paste the snippet from your article, including who you quoted, and I'll verify if they are the right specialist for the topic.";
      case AppMode.FIND_DOCTOR:
        return "Need to find the right specialist for an article? Describe a health condition, and I'll suggest the most appropriate PMCK doctor to consult or quote.";
      case AppMode.HEALTH_TIP:
        return "Let's find a great health tip for your readers. Click the button below to generate a new tip from one of our PMCK specialists.";
      default:
        return "Welcome to the PMCK AI Doctor Assistant!";
    }
  }

  const handleActionSelect = (selectedMode: AppMode) => {
    setMode(selectedMode);
    setMessages([{ sender: MessageSender.BOT, text: getWelcomeMessage(selectedMode) }]);
    setIsChatActive(true);
    if (selectedMode === AppMode.HEALTH_TIP) {
      handleSendMessage('Generate a health tip', selectedMode);
    }
  };
  
  const handleStartOver = () => {
    setIsChatActive(false);
  }

  const handleSendMessage = useCallback(async (message: string, currentMode: AppMode = mode) => {
    setIsLoading(true);
    
    // Don't add the initial "Generate a health tip" as a user message
    if (currentMode !== AppMode.HEALTH_TIP || message !== 'Generate a health tip') {
       const userMessage: ChatMessage = { sender: MessageSender.USER, text: message };
       setMessages(prev => [...prev, userMessage]);
    } else {
       // For health tip, clear previous messages and show only the welcome text
       setMessages([{ sender: MessageSender.BOT, text: getWelcomeMessage(currentMode) }]);
    }

    try {
      const responseText = await runQuery(currentMode, message);
      const botMessage: ChatMessage = { sender: MessageSender.BOT, text: responseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: ChatMessage = { sender: MessageSender.BOT, text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Interaction Pane */}
          <div className="lg:col-span-2 h-[85vh]">
            {isChatActive ? (
               <ChatInterface 
                mode={mode}
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onStartOver={handleStartOver}
              />
            ) : (
              <WelcomeScreen onActionSelect={handleActionSelect} />
            )}
          </div>

          {/* Doctors Pane */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-bold text-slate-700 mb-4">Our PMCK Specialists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[80vh] overflow-y-auto pr-2">
                {DOCTORS.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;
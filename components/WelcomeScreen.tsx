import React from 'react';
import { AppMode } from '../types';
import ClipboardCheckIcon from './icons/ClipboardCheckIcon';
import SearchIcon from './icons/SearchIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out text-left w-full flex flex-col items-start"
  >
    <div className="bg-cyan-100 text-cyan-600 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-slate-500 text-sm flex-grow">{description}</p>
    <div className="mt-4 text-cyan-600 font-semibold text-sm">
      Start Now &rarr;
    </div>
  </button>
);

interface WelcomeScreenProps {
  onActionSelect: (mode: AppMode) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onActionSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col h-full p-6 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">What would you like to do?</h2>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Select a task below to begin creating accurate and reliable medical content with your PMCK AI Assistant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        <ActionCard
          icon={<QuestionMarkCircleIcon className="w-7 h-7" />}
          title="Ask a Health Question"
          description="Get AI-driven answers for your 'Ask The Doctor' series, attributed to the most relevant PMCK specialist."
          onClick={() => onActionSelect(AppMode.ASK_QUESTION)}
        />
        <ActionCard
          icon={<ClipboardCheckIcon className="w-7 h-7" />}
          title="Verify an Article Snippet"
          description="Check a quote or medical claim in your article to ensure the correct PMCK doctor is cited for the topic."
          onClick={() => onActionSelect(AppMode.VERIFY_ARTICLE)}
        />
        <ActionCard
          icon={<SearchIcon className="w-7 h-7" />}
          title="Find the Right Specialist"
          description="Describe a health condition to find and learn about the most appropriate PMCK doctor for your article."
          onClick={() => onActionSelect(AppMode.FIND_DOCTOR)}
        />
      </div>

       <div className="mt-8 pt-6 border-t border-slate-200">
         <button 
            onClick={() => onActionSelect(AppMode.HEALTH_TIP)}
            className="w-full flex items-center justify-center text-center bg-cyan-50/70 text-cyan-700 font-semibold p-4 rounded-xl text-md hover:bg-cyan-100 transition-colors"
         >
           <LightBulbIcon className="w-6 h-6 mr-3"/>
           Or, get a quick Health Tip of the Day
         </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;

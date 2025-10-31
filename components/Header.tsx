
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-cyan-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">PMCK AI Doctor Assistant</h1>
            <p className="text-sm text-slate-500">Your intelligent partner for creating accurate medical content.</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

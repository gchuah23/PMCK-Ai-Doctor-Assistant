import React from 'react';
import { Doctor } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg border border-slate-200/80 overflow-hidden transition-shadow duration-300 ease-in-out flex flex-col">
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-slate-800">{doctor.name}</h3>
        <p className="text-sm font-medium text-cyan-600 mb-2">{doctor.specialty}</p>
        <div className="mt-2 text-xs text-slate-600 flex-grow prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
          <ReactMarkdown>{doctor.bio}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;

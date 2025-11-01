
import React from 'react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
      <img className="w-full h-40 object-cover" src={doctor.imageUrl} alt={`Portrait of ${doctor.name}`} />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-slate-800">{doctor.name}</h3>
        <p className="text-sm font-medium text-cyan-600">{doctor.specialty}</p>
        <p className="mt-2 text-sm text-slate-600 flex-grow">{doctor.bio}</p>
        <div className="mt-4">
            <a 
                href={doctor.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-cyan-50 text-cyan-700 font-semibold py-2 px-4 rounded-md text-sm hover:bg-cyan-100 transition-colors"
            >
                View Full Profile
            </a>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;

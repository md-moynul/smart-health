import React from 'react';
import { Pill, Clock, FileText } from 'lucide-react';

export interface Medicine {
  name: string;
  dosage: string;
}

export interface AnalysisResult {
  medicines: Medicine[];
  doctorNotes?: string;
}

export const ResultsDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  return (
    <div className="w-full max-w-2xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-xl font-semibold text-gray-800">Extracted Prescription Data</h3>
        
        {result.medicines.length === 0 ? (
          <p className="text-gray-500 italic">No medicines found in the image.</p>
        ) : (
          <div className="space-y-4">
            {result.medicines.map((med, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 rounded-xl border border-teal-100 bg-teal-50 p-4 transition-colors hover:bg-teal-100/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
                  <Pill size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-teal-900">{med.name}</span>
                  <div className="flex items-start gap-2 text-sm text-teal-700">
                    <Clock size={16} className="mt-0.5 shrink-0" />
                    <span>{med.dosage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {result.doctorNotes && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
              <FileText size={18} />
              <span>Doctor's Notes</span>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{result.doctorNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

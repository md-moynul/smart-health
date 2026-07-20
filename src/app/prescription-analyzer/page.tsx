"use client";

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, FileImage } from 'lucide-react';
import { ResultsDisplay, AnalysisResult } from '@/components/Prescription/ResultsDisplay';

export default function PrescriptionAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG).');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('prescription', file);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/analyze-prescription`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          AI Prescription Analyzer
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Upload a clear image of your prescription, and our AI will extract the medicine names and dosage instructions for you.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        {!previewUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-teal-200 rounded-2xl p-12 bg-teal-50/50 hover:bg-teal-50 cursor-pointer transition-colors group"
          >
            <div className="rounded-full bg-teal-100 p-4 mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="text-teal-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Click to upload or drag and drop</h3>
            <p className="text-sm text-gray-500 mt-2">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[3/4] mb-6 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
              <img src={previewUrl} alt="Prescription preview" className="object-cover w-full h-full" />
              <button 
                onClick={clearFile}
                className="absolute top-3 right-3 bg-white/90 text-gray-700 p-1.5 rounded-full hover:bg-white hover:text-red-600 shadow-sm transition-colors"
                title="Remove image"
              >
                <X size={20} />
              </button>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <FileImage size={20} />
                  Analyze Prescription
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 text-red-700 text-center text-sm border border-red-100">
            {error}
          </div>
        )}
      </div>

      {/* Analysis Results Skeleton Loader or Actual Results */}
      {isAnalyzing && (
        <div className="w-full max-w-2xl mt-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="h-10 w-10 shrink-0 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && !isAnalyzing && (
        <ResultsDisplay result={result} />
      )}
    </main>
  );
}

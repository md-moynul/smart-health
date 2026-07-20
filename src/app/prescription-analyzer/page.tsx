"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Loader2, FileImage, CloudUpload, Clock, Pill, FileText } from 'lucide-react';
import { ResultsDisplay, AnalysisResult } from '@/components/Prescription/ResultsDisplay';
import { authClient } from '@/lib/auth-client';

interface PrescriptionRecord {
  _id: string;
  imageName?: string;
  analysisResult: AnalysisResult;
  createdAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

export default function PrescriptionAnalyzerPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PrescriptionRecord[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch prescription history for current user
  useEffect(() => {
    if (!userId) return;
    fetch(`${BASE_URL}/api/prescriptions/${userId}`)
      .then((r) => r.json())
      .then((data) => setHistory(data.prescriptions ?? []))
      .catch(console.error);
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG).');
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
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
      const res = await fetch(`${BASE_URL}/api/analyze-prescription`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      const analysisResult: AnalysisResult = data.result;
      setResult(analysisResult);

      // Persist result if the user is logged in
      if (userId) {
        setIsSaving(true);
        try {
          await fetch(`${BASE_URL}/api/save-prescription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              imageName: file.name,
              analysisResult,
            }),
          });

          // Refresh history after save
          const histRes = await fetch(`${BASE_URL}/api/prescriptions/${userId}`);
          const histData = await histRes.json();
          setHistory(histData.prescriptions ?? []);
        } catch (saveErr) {
          console.error('Failed to save prescription:', saveErr);
        } finally {
          setIsSaving(false);
        }
      }
    } catch (err: any) {
      console.error('Frontend Error Details:', err);
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
              disabled={isAnalyzing || isSaving}
              className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing Image...
                </>
              ) : isSaving ? (
                <>
                  <CloudUpload size={20} className="animate-pulse" />
                  Saving Result...
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

      {/* Skeleton Loader */}
      {isAnalyzing && (
        <div className="w-full max-w-2xl mt-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 rounded mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="h-10 w-10 shrink-0 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-1/2 bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {result && !isAnalyzing && <ResultsDisplay result={result} />}

      {/* Prescription History */}
      {history.length > 0 && (
        <div className="w-full max-w-2xl mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">Previous Analyses</h2>
          </div>
          <div className="space-y-4">
            {history.map((record) => (
              <details
                key={record._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm group open:shadow-md transition-shadow"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {record.imageName ?? 'Prescription'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(record.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                    <Pill size={12} />
                    {record.analysisResult.medicines.length} medicine{record.analysisResult.medicines.length !== 1 ? 's' : ''}
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <ResultsDisplay result={record.analysisResult} />
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
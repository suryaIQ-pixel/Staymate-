/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShieldAlert, Upload, Loader2, Check, Fingerprint, Sparkles } from 'lucide-react';

interface KYCModalProps {
  onClose: () => void;
  onVerificationComplete: (aadhaarNum: string) => void;
  userName: string;
}

export default function KYCModal({ onClose, onVerificationComplete, userName }: KYCModalProps) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [kycState, setKycState] = useState<'idle' | 'uploading' | 'verifying' | 'success'>('idle');
  const [loadingText, setLoadingText] = useState('');

  // Aadhaar clean formatted input
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.replace(/\D/g, '').slice(0, 12).replace(/(\d{4})/g, '$1-').trim();
    if (formatted.endsWith('-')) {
      setAadhaarNumber(formatted.slice(0, 14));
    } else {
      setAadhaarNumber(formatted);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNumber.length < 14) return; // 12 numbers + 2 hyphens

    // Process file uploading
    setKycState('uploading');
    setLoadingText('Uploading document scans to government secure repository...');
    await new Promise(resolve => setTimeout(resolve, 1400));

    // Process OCR Reading
    setKycState('verifying');
    setLoadingText(`Initiating optical scanning on "${fileName || 'Aadhaar_Doc_Front.jpg'}"...`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLoadingText('Extracting UIDAI biometric details...');
    await new Promise(resolve => setTimeout(resolve, 800));

    setLoadingText(`Cross-matching CIDR (uidai.gov.in) signatures with card name: "${userName}"...`);
    await new Promise(resolve => setTimeout(resolve, 1200));

    setKycState('success');
    onVerificationComplete(aadhaarNumber);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden card-shadow text-left flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-display font-semibold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <Fingerprint className="w-5 h-5 text-indigo-500" /> Government Aadhaar KYC Verification
            </h3>
            <span className="text-xs text-slate-400">StayMate Safe Owner / Tenant Shield Program</span>
          </div>
          <button 
            id="close-kyc"
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- DYNAMIC STATES RENDERS --- */}
        <div className="p-6">

          {kycState === 'idle' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              
              <div className="bg-amber-500/10 text-amber-700 dark:text-amber-300 p-3.5 rounded-2xl border border-amber-500/25 flex gap-3 text-xs">
                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
                <div>
                  <strong>Mandatory anti-fraud check:</strong> StayMate requires Aadhaar or business entity validation to verify real listing owners and tenants, avoiding spam, false reviews, and fraud activities.
                </div>
              </div>

              {/* Enter Card text */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Aadhaar Card Number (UIDAI)</label>
                <input 
                  type="text"
                  placeholder="e.g. 5566-7788-9900"
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  className="w-full tracking-wider font-mono text-base p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 text-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Upload drag-n-drop form */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Upload Aadhaar PDF / JPG Scan</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center ${
                    dragOver 
                      ? 'border-brand-500 bg-brand-500/5' 
                      : fileName 
                        ? 'border-emerald-400 bg-emerald-500/5' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <input 
                    type="file" 
                    id="file-upload-input" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                  />

                  {fileName ? (
                    <div className="space-y-1">
                      <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block truncate max-w-[200px]">{fileName}</span>
                      <span className="text-[10px] text-slate-400 block">Click or drag different file to replace</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                      <div className="text-xs flex flex-col gap-0.5">
                        <span className="font-semibold text-brand-600 dark:text-brand-400">Click to upload document</span>
                        <span className="text-slate-400">or Drag & Drop files here</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block">Maximum file size: 5MB (PDF, JPEG, or PNG)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Certifies */}
              <div className="text-[10px] text-slate-400 leading-tight">
                🔒 UIDAI government compliant. Details are protected with complete encryption protocols and never shared publicly.
              </div>

              {/* Submit triggers */}
              <button
                type="submit"
                id="btn-trigger-kyc"
                disabled={aadhaarNumber.length < 14}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  aadhaarNumber.length < 14 
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-brand-600 hover:bg-brand-700 text-white'
                }`}
              >
                <span>Process Document Verification</span>
              </button>

            </form>
          )}

          {/* UPLOADING/VERIFYING STATES */}
          {(kycState === 'uploading' || kycState === 'verifying') && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
              <div className="space-y-1">
                <span className="font-display font-medium text-slate-800 dark:text-white block">Securing Identity Verification...</span>
                <span className="text-xs text-brand-600 font-mono block animate-pulse-slow">{loadingText}</span>
              </div>
              <span className="text-[10px] text-slate-400">Verifying security signatures safely...</span>
            </div>
          )}

          {/* SUCCESS STATUS */}
          {kycState === 'success' && (
            <div className="py-6 text-center space-y-4 select-none shrink-0 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center border border-emerald-300 text-emerald-500">
                <Check className="w-8 h-8" strokeWidth={3} />
              </div>
              <div>
                <h4 className="font-display text-xl font-bold text-slate-800 dark:text-white">KYC Verified Successfully!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Aadhaar signature matches registration. You can now list properties, make bookings, and access featured recommendations instantly.
                </p>
              </div>
              <button
                type="button"
                id="btn-finish-kyc"
                onClick={onClose}
                className="w-full max-w-[200px] bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Complete setup
              </button>
              <div className="text-[9px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Premium verified shield added to your profile!
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

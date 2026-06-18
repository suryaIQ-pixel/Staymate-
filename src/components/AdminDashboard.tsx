/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Users, Building, ShieldAlert, Check, X, FileText, TrendingUp, Sparkles, Activity, Plus } from 'lucide-react';
import { Property, Booking, VerificationRequest, PaymentRecord } from '../types';

interface AdminDashboardProps {
  properties: Property[];
  bookings: Booking[];
  kycRequests: VerificationRequest[];
  payments: PaymentRecord[];
  onApproveKYC: (requestId: string, ownerEmail: string) => void;
  onRejectKYC: (requestId: string) => void;
}

export default function AdminDashboard({
  properties,
  bookings,
  kycRequests,
  payments,
  onApproveKYC,
  onRejectKYC
}: AdminDashboardProps) {
  
  const [successBanner, setSuccessBanner] = useState('');

  // Total booking deposits processed
  const totalProcessedValue = payments
    .filter(p => p.status === 'Success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Platform commissions (typically 3%)
  const platformCommissions = Math.round(totalProcessedValue * 0.03);

  // Anti-fraud automated reports list
  const [fraudReports, setFraudReports] = useState([
    {
      id: "fraud-1",
      reportedUser: "bot_scrap_99@yahoo.com",
      nature: "Bulk directory phone number scraping",
      riskLevel: "Critical",
      actionTaken: "Blocked IP subnet & session expired",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: "fraud-2",
      reportedUser: "fake_owner_delhi@gmail.com",
      nature: "Repeated landlord Aadhaar validation failure",
      riskLevel: "High",
      actionTaken: "Blacklisted Aadhaar hash",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const handleApprove = (reqId: string, email: string) => {
    onApproveKYC(reqId, email);
    setSuccessBanner(`✓ Owner account "${email}" has been premium verified successfully! Notification sent.`);
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-8">
      
      {/* Alert notifications banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 font-semibold text-sm flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          {successBanner}
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-brand-600" /> Platform Security Admin Dashboard
          </h2>
          <span className="text-xs text-slate-400">Manage owner documents, monitor active financial transactions, and resolve fraud report channels.</span>
        </div>
        <div className="bg-brand-500/10 text-brand-600 dark:text-brand-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-brand-500/20 shadow-sm shrink-0 font-bold">
          🛡️ Platform Firewall: Live & Active
        </div>
      </div>

      {/* Analytical KPI Block grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-750 card-shadow">
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wide">Platform Lodgings</span>
            <Building className="w-5 h-5" />
          </div>
          <span className="text-3xl font-display font-bold block">{properties.length}</span>
          <span className="text-[11px] text-slate-400">Live active PG Rooms/Studios listed</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-750 card-shadow">
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wide">Pending Owner KYCs</span>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <span className="text-3xl font-display font-bold block text-indigo-600 dark:text-indigo-400">
            {kycRequests.filter(k => k.status === 'Pending').length}
          </span>
          <span className="text-[11px] text-slate-400">Awaiting UIDAI validation audits</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-750 card-shadow">
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wide">Deposits Ledger Total</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-display font-bold block text-emerald-500">₹{totalProcessedValue.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">Secured through Razorpay nodes</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-white card-shadow">
          <div className="flex items-center justify-between mb-3 text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wide">System Commissions (3%)</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-display font-bold block text-brand-400">₹{platformCommissions.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500">Revenue to StayMate Platform Inc</span>
        </div>

      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Verification lists queues */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl card-shadow overflow-hidden flex flex-col h-[400px]">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 flex items-center justify-between">
            <h4 className="font-display font-bold text-sm uppercase text-slate-400 tracking-wider">Aadhaar Landlord Verification queue</h4>
            <span className="text-[10px] uppercase font-bold text-slate-400">UIDAI OCR match verify</span>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {kycRequests.length === 0 ? (
              <div className="py-24 text-center text-slate-400">
                <ShieldCheck className="w-12 h-12 text-slate-350 mx-auto mb-3" />
                <span>No owner registrations requiring manual audit.</span>
              </div>
            ) : (
              kycRequests.map(req => (
                <div key={req.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-left space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-display font-bold text-sm text-slate-800 dark:text-white leading-tight">{req.ownerName}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block leading-tight">{req.ownerEmail}</span>
                    <span className="text-[11px] font-mono text-slate-400 block pt-1">
                      📄 Document: <strong>{req.documentType} ({req.documentNumber})</strong>
                    </span>
                  </div>

                  {req.status === 'Pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleApprove(req.id, req.ownerEmail)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button 
                        onClick={() => onRejectKYC(req.id)}
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-slate-600 dark:text-slate-200 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}

                  {req.status === 'Approved' && (
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 shrink-0">
                      ✓ Audited & Verified
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Anti-Fraud Threat report logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white flex flex-col h-[400px]">
          <div className="mb-4 text-left border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-sm tracking-wide text-rose-500 uppercase flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 animate-pulse" /> Threat Intelligence Logs
              </h4>
              <span className="text-[10px] text-slate-500 block">StayMate platform firewall activities</span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto space-y-3.5 divide-y divide-slate-800 pr-1">
            {fraudReports.map(report => (
              <div key={report.id} className="pt-3 first:pt-0 text-left space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-rose-400 font-mono tracking-widest">{report.riskLevel} threat</strong>
                  <span className="text-[10px] font-mono text-slate-500">{report.timestamp}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  📄 IP Target: <code className="text-slate-400 font-mono text-[10px]">{report.reportedUser}</code>
                </div>
                <div className="text-slate-400 text-[10px]">
                  <em>Details: {report.nature}</em>
                </div>
                <div className="mt-1 text-emerald-400 text-[10px] font-medium flex items-center">
                  🛡️ Firewall mitigation: {report.actionTaken}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-left leading-tight">
            ℹ️ Under UIDAI section rules, failed IP addresses trying bulk scraping are automatically routed and banned from accessing platform owners.
          </div>
        </div>

      </div>

      {/* Platform Transactions Ledger summary table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 card-shadow text-left">
        <div className="mb-4 border-b border-slate-50 dark:border-slate-700/50 pb-3 flex justify-between items-center">
          <h4 className="font-display font-bold text-sm uppercase tracking-wider text-slate-400">Financial Ledger history</h4>
          <span className="text-xs bg-emerald-500/10 text-emerald-500 font-medium px-2 py-0.5 rounded-md">
            All nodes running securely
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3 text-left">Booking User</th>
                <th className="pb-3 text-left">Property</th>
                <th className="pb-3 text-left">Transaction ID</th>
                <th className="pb-3 text-left">Method</th>
                <th className="pb-3 text-right">Amount Settled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {payments.map(pay => (
                <tr key={pay.id} className="text-slate-700 dark:text-slate-300">
                  <td className="py-3 font-semibold">{pay.userName}</td>
                  <td className="py-3">{pay.propertyName}</td>
                  <td className="py-3 font-mono text-slate-500 text-[11px]">{pay.transactionId}</td>
                  <td className="py-3 font-mono text-indigo-500 text-[11px] uppercase">{pay.paymentMethod}</td>
                  <td className="py-3 text-right font-display font-bold text-slate-800 dark:text-white">₹{pay.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

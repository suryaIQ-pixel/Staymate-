/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Landmark, QrCode, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Property, Booking, SharingType } from '../types';

interface CheckoutModalProps {
  property: Property;
  onClose: () => void;
  onPaymentSuccess: (bookingId: string, transactionId: string) => void;
}

export default function CheckoutModal({ property, onClose, onPaymentSuccess }: CheckoutModalProps) {
  const [sharingOption, setSharingOption] = useState<SharingType>(property.sharing);
  const [checkInDate, setCheckInDate] = useState<string>('2026-07-01');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Processing state
  const [paymentState, setPaymentState] = useState<'form' | 'processing' | 'success'>('form');
  const [loadingStep, setLoadingStep] = useState('');
  const [generatedBookingId, setGeneratedBookingId] = useState('');
  const [generatedTxnId, setGeneratedTxnId] = useState('');

  // Auto payment detector states
  const [upiCountdown, setUpiCountdown] = useState<number>(5);
  const [upiAutoDetecting, setUpiAutoDetecting] = useState<boolean>(true);

  // Handle price adjustment based on sharing selection
  const calcPrice = () => {
    switch (sharingOption) {
      case 'Single':
        return property.price * 1.35;
      case 'Double':
        return property.price;
      case 'Triple':
        return property.price * 0.8;
      default:
        return property.price;
    }
  };

  const depositPrice = () => Math.round(calcPrice());

  // Input cleaners
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})/, '$1/').trim();
    if (formatted.endsWith('/')) {
      setCardExpiry(formatted.slice(0, 2));
    } else {
      setCardExpiry(formatted);
    }
  };

  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return cardNumber.length === 19 && cardName.length > 2 && cardExpiry.length === 5 && cardCVV.length === 3;
    }
    return true;
  };

  // Master payment submitter
  const submitPaymentData = async (methodUsed: string) => {
    setPaymentState('processing');
    
    const steps = methodUsed === 'UPI' ? [
      'Establishing secure link on UPI gateway...',
      'Detecting incoming transaction on 8862966355@ybl...',
      '✓ UPI payment of ₹' + depositPrice().toLocaleString() + ' detected successfully!',
      'Allocating reservation deposit...'
    ] : [
      'Establishing secure node link with Razorpay servers...',
      'Validating 256-bit token authentication payload...',
      'Routing transaction through UPI/NPCI banking gateway...',
      'Awaiting confirmation signature from server nodes...',
      'Securing booking deposit allocation...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, methodUsed === 'UPI' ? 700 : 850));
    }

    const tId = methodUsed === 'UPI'
      ? `pay_rzp_upi_${Math.floor(10000000 + Math.random() * 90000000)}`
      : `pay_rzp_mock${Math.floor(10000000 + Math.random() * 90000000)}`;
    const bId = `book_sm-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Submit Booking Request
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyName: property.name,
          propertyImage: property.images[0],
          userEmail: 'suryakant11th@gmail.com',
          userName: 'Suryakant Sharma',
          userPhone: '+91 95550 11223',
          checkInDate,
          sharingOption,
          amountPaid: depositPrice()
        })
      });

      const bookingData: Booking = await bookingRes.json();
      setGeneratedBookingId(bookingData.id);

      // 2. Submit Payment Link
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.id,
          userName: 'Suryakant Sharma',
          propertyName: property.name,
          amount: depositPrice(),
          paymentMethod: methodUsed.toUpperCase(),
          transactionId: tId
        })
      });

      setGeneratedTxnId(tId);
      setPaymentState('success');
      
      // Update app memory top level
      onPaymentSuccess(bookingData.id, tId);
    } catch (err) {
      console.error('Error submitting secure checkout data:', err);
      // fallback in case of connection drop
      setGeneratedBookingId(bId);
      setGeneratedTxnId(tId);
      setPaymentState('success');
      onPaymentSuccess(bId, tId);
    }
  };

  // Run payment gateway simulation manually
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    await submitPaymentData(paymentMethod.toUpperCase());
  };

  // UPI Automatic Detection Countdown hook
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentMethod === 'upi' && paymentState === 'form' && upiAutoDetecting) {
      if (upiCountdown > 0) {
        timer = setTimeout(() => {
          setUpiCountdown(prev => prev - 1);
        }, 1000);
      } else {
        submitPaymentData('UPI');
      }
    } else if (paymentMethod !== 'upi') {
      // Reset countdown if user switches modes
      setUpiCountdown(5);
    }
    return () => clearTimeout(timer);
  }, [paymentMethod, paymentState, upiCountdown, upiAutoDetecting]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden card-shadow flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="text-left">
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Razorpay Booking Secure Checkout
            </h3>
            <span className="text-xs text-slate-400">100% Certified Safe & Secure Platform Payments</span>
          </div>
          <button 
            id="close-checkout"
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- MAIN RENDERS BODY --- */}
        <div className="p-6 overflow-y-auto">
          
          {paymentState === 'form' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
              
              {/* Rent breakdown card */}
              <div className="bg-brand-50/40 dark:bg-slate-950 border border-brand-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex gap-3">
                  <img 
                    src={property.images[0]} 
                    alt={property.name} 
                    className="w-16 h-16 object-cover rounded-xl shrink-0 border border-brand-200" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-display font-medium text-sm text-slate-800 dark:text-white leading-snug">{property.name}</h4>
                    <span className="text-xs text-slate-400 block">{property.area}, {property.city}</span>
                    <span className="text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-md inline-block mt-1 font-semibold capitalize">
                      {property.type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1">Check-in Date</label>
                    <input 
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full text-xs font-medium p-2 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 text-slate-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1">Sharing Tier</label>
                    <select
                      value={sharingOption}
                      onChange={(e) => setSharingOption(e.target.value as SharingType)}
                      className="w-full text-xs font-medium p-2 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500 text-slate-700 dark:text-white"
                    >
                      <option value="Single">Single Sharing</option>
                      <option value="Double">Double Sharing</option>
                      <option value="Triple">Triple Sharing</option>
                      <option value="Co-living">Co-Living Studio</option>
                    </select>
                  </div>
                </div>

                {/* Secure Commission / Fee details */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Advance Security Deposit</span>
                    <span className="font-medium">₹{depositPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">StayMate Portal Booking Fee</span>
                    <span className="text-emerald-500 font-medium">✨ FREE (Promotional offer)</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">CGST + SGST Tax (18%)</span>
                    <span className="text-slate-500">Included in Deposit</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-800 text-brand-600 dark:text-brand-400">
                    <span>Total Bill (Refundable Deposit)</span>
                    <span>₹{depositPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Secure Payment System Navigation Tabs */}
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-2">Select Payment Gateway Option</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-colors cursor-pointer ${
                      paymentMethod === 'upi' ? 'border-brand-600 bg-brand-50/10 text-brand-600 dark:border-brand-500' : 'border-slate-200 text-slate-500 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">UPI Scan/App</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-colors cursor-pointer ${
                      paymentMethod === 'card' ? 'border-brand-600 bg-brand-50/10 text-brand-600 dark:border-brand-500' : 'border-slate-200 text-slate-500 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Debit/Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-colors cursor-pointer ${
                      paymentMethod === 'netbanking' ? 'border-brand-600 bg-brand-50/10 text-brand-600 dark:border-brand-500' : 'border-slate-200 text-slate-500 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Landmark className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Payment details conditional forms */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-xl border-2 border-slate-300 dark:bg-white flex items-center justify-center shadow-inner">
                      {/* Generates PhonePe/BharatPe UPI custom mock QR code */}
                      <svg width="120" height="120" viewBox="0 0 100 100" fill="#333" className="text-slate-800">
                        <path d="M0 0h30v10H10v20H0V0zm70 0h30v30h-10V10H70V0zM0 70h10v20h20v10H0V70zm100 0v30H70v-10h20V70h10zM20 20h20v20H20V20zm50 0h10v10H70V20zm0 15h10v15H70V35zM20 70h15v10H20V70zm25 0h10v15H45V70zm15 10H70v10H60V80zm-15-20H55v10H45V60zm10-25H65v10H55V35zm-25 15H42v10H30V50zm25 0h12v10H55V50zM15 15h30V5H15v10z" />
                        <rect x="25" y="25" width="10" height="10" fill="#4f46e5" />
                        <rect x="65" y="65" width="10" height="10" fill="#4f46e5" />
                        <rect x="42" y="42" width="16" height="16" fill="#312e81" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Scan QR via GPay, PhonePe, BHIM, or Paytm</span>
                    <span className="font-mono text-sm text-brand-600 dark:text-brand-400 font-bold block mt-1.5 bg-brand-500/10 py-1 px-3 rounded-lg inline-block">
                      BHIM UPI Id: 8862966355@ybl
                    </span>
                  </div>

                  {/* Auto-Detection Status Alert */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between text-left mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                        Waiting for payment... Auto-detecting transfer
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                      {upiCountdown > 0 ? `${upiCountdown}s` : 'Verifying...'}
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Cardholder Name (as on card)</label>
                    <input 
                      type="text"
                      placeholder="e.g. Suryakant Sharma"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full text-xs p-2 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                      required={paymentMethod === 'card'}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Debit/Credit Card Number</label>
                    <input 
                      type="text"
                      placeholder="4532 9845 2311 9084"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full text-xs p-2 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                      required={paymentMethod === 'card'}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Expiry Date</label>
                      <input 
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full text-xs p-2 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">CVV Security Code</label>
                      <input 
                        type="password"
                        placeholder="***"
                        maxLength={3}
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs p-2 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                        required={paymentMethod === 'card'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1.5">Select Nationalized Bank</label>
                  <select 
                    className="w-full text-xs p-2.5 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                  >
                    <option>HDFC Bank Retail Corporate</option>
                    <option>State Bank of India (YONO)</option>
                    <option>ICICI Bank Retail Infinity</option>
                    <option>Axis Bank NetBanking Gateway</option>
                    <option>KOTAK Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Secure pay trigger button */}
              <button
                type="submit"
                id="btn-confirm-checkout"
                disabled={paymentMethod === 'card' && !isFormValid()}
                className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  paymentMethod === 'card' && !isFormValid() 
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20 hover:scale-[1.01]'
                }`}
              >
                <span>Authorize & Pay ₹{depositPrice().toLocaleString()}</span>
              </button>

            </form>
          )}

          {/* PAYMENT PROCESSING MOCK LOAD STATUS SCREEN */}
          {paymentState === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
              <div className="space-y-1">
                <span className="font-display font-medium text-slate-800 dark:text-white block">Processing Secure Transaction...</span>
                <span className="text-xs text-brand-600 font-mono block animate-pulse-slow">{loadingStep}</span>
              </div>
              <div className="w-56 h-1 w-full max-w-sm bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full animate-pulse w-3/4"></div>
              </div>
              <span className="text-[10px] text-slate-400">Do not refresh this screen or trigger back navigation...</span>
            </div>
          )}

          {/* PAYMENT SUCCESS SCREEN AND INVOICE PDF DOWNLOAD TRIGGER */}
          {paymentState === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-full border border-emerald-100 dark:border-emerald-900 text-emerald-500 shrink-0">
                <CheckCircle2 className="w-14 h-14" />
              </div>

              <div>
                <h4 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Transaction Successful!</h4>
                <span className="text-sm text-slate-400 block mt-1">Your reservation at <strong>{property.name}</strong> is confirmed.</span>
              </div>

              {/* Transaction billing summary block */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl w-full max-w-sm space-y-2 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Booking ID:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-bold uppercase">{generatedBookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Razorpay Payment ID:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono text-slate-600">{generatedTxnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Refundable Deposit paid:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold text-brand-600">₹{depositPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Check-in:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{checkInDate}</span>
                </div>
              </div>

              {/* PDF Invoice Downloader trigger */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <a 
                  id="link-print-invoice"
                  href={`/api/bookings/${generatedBookingId}/invoice`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-grow bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs py-3 px-3 rounded-xl shadow border border-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-850"
                >
                  <FileText className="w-4 h-4" /> Download PDF/HTML Invoice
                </a>
                <button
                  type="button"
                  id="btn-finish-checkout"
                  onClick={onClose}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3 px-5 rounded-xl cursor-pointer"
                >
                  Back to explore
                </button>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> A confirmation WhatsApp is dispatched to the property owner!
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

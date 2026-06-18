/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, ShieldCheck, Utensils, Compass, Calendar, Phone, MessageSquare, Play, Info, Video, CheckCircle, Image as ImageIcon, Send } from 'lucide-react';
import { Property, Review } from '../types';
import MapContainer from './MapContainer';

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
  onBookNow: (prop: Property) => void;
  darkMode: boolean;
  onAddReview: (propertyId: string, rating: number, comment: string) => void;
  reviews: Review[];
}

export default function PropertyDetail({
  property,
  onClose,
  onBookNow,
  darkMode,
  onAddReview,
  reviews
}: PropertyDetailProps) {
  
  const [activeImage, setActiveImage] = useState(property.images[0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Review inputs
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [showSubmitMsg, setShowSubmitMsg] = useState(false);

  useEffect(() => {
    setActiveImage(property.images[0]);
    setIsVideoPlaying(false);
    setUserComment('');
    setUserRating(5);
    setShowSubmitMsg(false);
  }, [property]);

  const propertyReviews = reviews.filter(r => r.propertyId === property.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    onAddReview(property.id, userRating, userComment);
    setUserComment('');
    setShowSubmitMsg(true);
    setTimeout(() => setShowSubmitMsg(false), 3500);
  };

  return (
    <div className={`fixed inset-0 z-40 overflow-y-auto ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Detail Wrapper Max Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-left">
        
        {/* Floating Back Header navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            id="btn-back-explore"
            onClick={onClose}
            className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
          >
            ← Back to accommodatons
          </button>
          
          <span className="font-mono text-xs text-slate-400">Stay ID: {property.id}</span>
        </div>

        {/* Brand visual header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Visuals: Image slider & video tours */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Visual stage frame */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow">
              
              {isVideoPlaying ? (
                // Beautifully simulated walkthrough player frame
                <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between p-4 text-white">
                  
                  {/* Glowing camera lens overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-indigo-950/10 to-slate-900 pointer-events-none"></div>

                  <div className="z-10 flex justify-between items-center text-xs">
                    <span className="bg-rose-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center shrink-0">
                      🔴 Virtual Video Tour
                    </span>
                    <button 
                      onClick={() => setIsVideoPlaying(false)}
                      className="text-white hover:text-slate-350 bg-white/10 py-1 px-2.5 rounded-md"
                    >
                      Exit Player
                    </button>
                  </div>

                  {/* Aesthetic mock scanning line bar */}
                  <div className="absolute inset-x-0 top-1/4 h-0.5 bg-brand-500/30 shadow shadow-brand-500 animate-pulse pointer-events-none"></div>

                  {/* Centered walkthrough visual mockup frames */}
                  <div className="m-auto text-center space-y-2.5 select-none shrink-0 z-10 p-4">
                    <Video className="w-12 h-12 text-brand-400 mx-auto animate-pulse" />
                    <div>
                      <span className="text-sm font-bold block">Simulated High-Definition Interior Walkthrough</span>
                      <span className="text-xs text-slate-300 max-w-sm block mx-auto">Showing single AC beds, modular washrooms, water filtration systems, and lounge zones.</span>
                    </div>
                  </div>

                  {/* Player timeline and dashboard logs */}
                  <div className="z-10 bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-mono">0:24 / 1:15 mins</span>
                    <div className="w-1/2 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-brand-500 rounded-full"></div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">1080p Streamed live</span>
                  </div>

                </div>
              ) : (
                <img
                  src={activeImage}
                  alt={property.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Float Trigger Video icon option */}
              {!isVideoPlaying && (
                <button
                  id="btn-play-tour"
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute bottom-5 right-5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-2xl cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> View Visual Walkthrough Tour
                </button>
              )}
            </div>

            {/* Thumbnail selector reels */}
            <div className="flex gap-3 overflow-x-auto select-none py-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveImage(img); setIsVideoPlaying(false); }}
                  className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === img && !isVideoPlaying ? 'border-brand-600 scale-[1.02]' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <img src={img} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
              {/* Extra thumbnail for video tour */}
              <button
                onClick={() => setIsVideoPlaying(true)}
                className={`w-24 h-16 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white shrink-0 border-2 text-[9px] font-bold ${
                  isVideoPlaying ? 'border-brand-600 scale-[1.02]' : 'border-slate-700'
                }`}
              >
                <Video className="w-4 h-4 mb-0.5 text-rose-500" />
                Video Walkthrough
              </button>
            </div>

          </div>

          {/* Right booking checkout pane specs */}
          <div className="space-y-6">
            
            {/* Rent summary Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-750 card-shadow space-y-4">
              
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Advance deposit</span>
                  <div className="flex items-baseline">
                    <span className="font-display font-extrabold text-2xl">₹{property.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 ml-0.5">/mo (Fully Refundable)</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md block">
                    {property.sharing} Sharing
                  </span>
                </div>
              </div>

              {/* Inclusions parameters list */}
              <div className="space-y-3 font-medium text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Gender Allocation:</span>
                  <strong className="text-indigo-600 dark:text-brand-300">{property.genderEligibility}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Meals Included:</span>
                  <strong>{property.foodIncluded ? 'Breakfast, Lunch & Dinner' : 'Kitchen Accessible'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total vacant rooms:</span>
                  <span className="text-rose-500 font-bold">Just {property.vacancies} vacancies left!</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Furnishing tier:</span>
                  <strong>{property.furnished}</strong>
                </div>
              </div>

              {/* Book instant trigger button */}
              <button
                id="btn-detail-book"
                onClick={() => onBookNow(property)}
                className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/15 cursor-pointer hover:scale-[1.01] transition-transform text-center"
              >
                Book stay reservation instantly
              </button>

              <div className="text-center">
                <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  ✓ Protected with StayMate secure check-gate rules
                </span>
              </div>
            </div>

            {/* Landlord Operator specs card */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-750 card-shadow text-left space-y-4">
              <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">Property Owner Info</h4>
              
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-full flex items-center justify-center">
                  {property.ownerName.charAt(0)}
                </div>
                <div>
                  <strong className="text-sm block">{property.ownerName}</strong>
                  <span className="text-xs text-slate-400 block">{property.ownerEmail}</span>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> Government ID Verified Landlord
                  </span>
                </div>
              </div>

              {/* Contact owner action buttons */}
              {property.ownerEmail === 'suryakant11th@gmail.com' || property.ownerPhone?.includes('8862966355') ? (
                <div className="text-center pt-2">
                  <a 
                    id="link-email-owner"
                    href={`mailto:${property.ownerEmail}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all text-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Email Owner ({property.ownerEmail})
                  </a>
                  <span className="text-[10px] text-slate-400 block mt-2 text-center">
                    🛡️ Call/WhatsApp contact disabled for security. Please email the owner directly.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <a 
                    id="link-call-owner"
                    href={`tel:${property.ownerPhone}`}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> Call Owner
                  </a>
                  <a 
                    id="link-whatsapp-owner"
                    href={`https://wa.me/${property.ownerPhone.replace(/\D/g, '')}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100/50"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Direct
                  </a>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Dynamic Map Placemark details */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="font-display font-extrabold text-xl">Interactive Proximity Coordinates</h3>
            <span className="text-xs text-slate-400 block mt-0.5">Calculates real walkable distance nodes to adjoining universities, medical centers, and transport linkages.</span>
          </div>
          
          <MapContainer property={property} darkMode={darkMode} />
        </div>

        {/* Reviews and feedback program */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          
          {/* Review form submissions */}
          <div>
            <div className="mb-4">
              <h4 className="font-display font-extrabold text-lg text-slate-800 dark:text-white">Submit Verified Feedback</h4>
              <p className="text-xs text-slate-400 mt-1">Have you visited or stayed at this location? Help students make safe choices.</p>
            </div>

            {showSubmitMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-semibold text-xs flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" /> 
                ✓ Thank you! Review submitted and verification logs updated.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1">Star score (1 - 5 stars)</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        id={`btn-star-${star}`}
                        onClick={() => setUserRating(star)}
                        className="p-1 focus:ring-0 cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1">Landlord Commentary</label>
                  <textarea 
                    rows={3}
                    placeholder="e.g. WiFi is super solid... pure drinking water facilities are clean. Landlord is highly co-operative."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  id="btn-submit-review"
                  className="w-full py-2.5 px-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-800 cursor-pointer text-center"
                >
                  Post Feedback
                </button>
              </form>
            )}

          </div>

          {/* Reviews list timeline */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display font-extrabold text-base text-slate-850 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800/55 flex items-center justify-between">
              <span>Verified Resident Reviews ({propertyReviews.length})</span>
              <span className="text-xs font-normal text-slate-400 flex items-center font-display gap-1">
                Average Rating: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> <strong>{property.rating}</strong>
              </span>
            </h4>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {propertyReviews.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-medium">
                  Be the first to post a review for this accommodation!
                </div>
              ) : (
                propertyReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-slate-905 border border-slate-100 dark:border-slate-800/80 space-y-2 card-shadow text-left">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-xs block">{rev.userName}</strong>
                          <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                        </div>
                      </div>

                      {/* Stars count */}
                      <div className="flex bg-slate-55 dark:bg-slate-900 border border-slate-100 dark:border-slate-750 rounded px-1.5 py-0.5 text-[10px] font-bold items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {rev.rating}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-2">{rev.comment}</p>
                    
                    {rev.verified && (
                      <span className="text-[9px] text-emerald-500 font-bold flex items-center mt-1">
                        <CheckCircle className="w-3 h-3 mr-0.5" /> Verified Resident of StayMate
                      </span>
                    )}
                  </div>
                )
              ))
              }
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

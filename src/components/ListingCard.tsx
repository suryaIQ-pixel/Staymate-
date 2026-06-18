/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ShieldCheck, MapPin, Sparkles, Plus, Utensils, Zap, Users, ShieldAlert } from 'lucide-react';
import { Property } from '../types';

interface ListingCardProps {
  property: Property;
  onSelect: (prop: Property) => void;
  onQuickBook: (prop: Property) => void;
}

export default function ListingCard({ property, onSelect, onQuickBook }: ListingCardProps) {
  
  // Custom Visual Themes for gender eligibility
  const getGenderStyle = (gender: Property['genderEligibility']) => {
    switch (gender) {
      case 'Boys':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'Girls':
        return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-705 overflow-hidden card-shadow card-hover flex flex-col h-full"
      id={`property-${property.id}`}
    >
      {/* Featured / Sponsored Pill Labels */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {property.featured && (
          <span className="bg-amber-500 text-white text-[10px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-md flex items-center shadow-md">
            <Sparkles className="w-3 h-3 mr-1" /> Premium Stay
          </span>
        )}
        {property.sponsored && (
          <span className="bg-brand-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-md flex items-center shadow-md">
            Featured
          </span>
        )}
      </div>

      {/* Vacancy & Gender Badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 pointer-events-none">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${getGenderStyle(property.genderEligibility)}`}>
          {property.genderEligibility}
        </span>
      </div>

      {/* Hero Cover Photo */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-700 cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={property.images[0] || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80"}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Transparent blackout shade cover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

        {/* Rating overlay */}
        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center space-x-1 shadow">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{property.rating}</span>
          <span className="text-slate-400 font-normal">({property.reviewsCount})</span>
        </div>

        {/* Price Tag overlay on bottom left */}
        <div className="absolute bottom-3 left-3 bg-brand-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg shadow-md">
          <span className="text-xs font-medium text-slate-200">from </span>
          <span className="font-display font-bold text-base">₹{property.price.toLocaleString()}</span>
          <span className="text-[10px] font-normal">/mo</span>
        </div>
      </div>

      {/* Card Content body */}
      <div className="p-4 flex flex-col flex-grow text-left">
        
        <div className="flex items-start justify-between mb-1.5">
          <span className="text-slate-400 uppercase font-bold text-[10px] tracking-widest">{property.type} • {property.sharing} Sharing</span>
          {property.vacancies <= 2 ? (
            <span className="text-rose-500 font-semibold text-xs flex items-center">
              <ShieldAlert className="w-3 h-3 mr-0.5 animate-pulse" /> Just {property.vacancies} left!
            </span>
          ) : (
            <span className="text-emerald-500 font-semibold text-xs">{property.vacancies} Vacancies</span>
          )}
        </div>

        <h3 
          className="font-display text-lg font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer mb-1"
          onClick={() => onSelect(property)}
        >
          {property.name}
        </h3>

        <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
          <span className="truncate">{property.area}, {property.city}</span>
        </div>

        {/* Quick inclusions visual specs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {property.ac ? (
            <span className="text-[10px] font-medium bg-slate-50 border border-slate-100 text-slate-600 dark:bg-slate-700/50 dark:border-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md flex items-center">
              ❄️ AC
            </span>
          ) : (
            <span className="text-[10px] font-medium bg-slate-50 border border-slate-100 text-slate-400 dark:bg-slate-700/50 dark:border-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-md flex items-center">
              ❄️ Non-AC
            </span>
          )}

          {property.foodIncluded ? (
            <span className="text-[10px] font-medium bg-cyan-50 border border-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:border-cyan-800 dark:text-cyan-300 px-2 py-0.5 rounded-md flex items-center">
              <Utensils className="w-3 h-3 mr-0.5" /> Food Incl.
            </span>
          ) : (
            <span className="text-[10px] font-medium bg-slate-50 border border-slate-100 text-slate-500 dark:bg-slate-700/50 dark:border-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
              Kitchen Priv.
            </span>
          )}

          <span className="text-[10px] font-medium bg-slate-50 border border-slate-100 text-slate-600 dark:bg-slate-700/50 dark:border-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md">
             {property.furnished}
          </span>
        </div>

        {/* Card Footer row */}
        <div className="mt-auto pt-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
          <button 
            id={`btn-view-${property.id}`}
            onClick={() => onSelect(property)}
            className="text-xs font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300 transition-colors py-2"
          >
            Full Details & Map →
          </button>
          
          <button
            id={`btn-book-${property.id}`}
            onClick={(e) => { e.stopPropagation(); onQuickBook(property); }}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            Instant Book
          </button>
        </div>

      </div>
    </div>
  );
}

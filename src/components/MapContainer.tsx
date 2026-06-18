/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MapPin, School, Activity, ShoppingBag, Navigation, ZoomIn, ZoomOut, Compass, ArrowRight } from 'lucide-react';
import { Property } from '../types';

interface MapContainerProps {
  property: Property;
  darkMode: boolean;
}

export default function MapContainer({ property, darkMode }: MapContainerProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'college' | 'hospital' | 'market'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [mapCenter, setMapCenter] = useState({ lat: property.lat, lng: property.lng });

  useEffect(() => {
    setMapCenter({ lat: property.lat, lng: property.lng });
  }, [property]);

  // Handle zoom
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 10));

  // Simulated node positions relative to parent property center (lat/lng offset multiplier)
  const getSimulatedCoordinates = (index: number, total: number, radius = 70) => {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    // return visual relative positions in % for visual absolute overlay
    return {
      x: 50 + radius * Math.cos(angle) * (14 / zoomLevel),
      y: 50 + radius * Math.sin(angle) * (14 / zoomLevel)
    };
  };

  return (
    <div className={`rounded-2xl border overflow-hidden flex flex-col md:flex-row h-[420px] ${
      darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
    } card-shadow mb-6`}>
      
      {/* Interactive Map Visual Stage */}
      <div className="flex-grow relative h-[300px] md:h-full overflow-hidden select-none bg-slate-100 dark:bg-slate-950">
        
        {/* Visual Simulated Grid streets */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, ${darkMode ? '#ffffff 1px' : '#4f46e5 1.5px'}, transparent 1.5px)`,
            backgroundSize: `${30 * (zoomLevel / 14)}px ${30 * (zoomLevel / 14)}px`
          }}
        ></div>

        {/* Diagonal street lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg width="100%" height="100%">
            <line x1="0" y1="20%" x2="100%" y2="80%" stroke={darkMode ? "white" : "indigo"} strokeWidth="4" strokeDasharray="5,15" />
            <line x1="10%" y1="0%" x2="90%" y2="100%" stroke={darkMode ? "white" : "indigo"} strokeWidth="2" />
            <line x1="90%" y1="0%" x2="10%" y2="100%" stroke={darkMode ? "white" : "indigo"} strokeWidth="1" />
            <circle cx="50%" cy="50%" r={100 * (zoomLevel / 14)} fill="none" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(79, 70, 229, 0.05)"} strokeWidth="2" />
            <circle cx="50%" cy="50%" r={180 * (zoomLevel / 14)} fill="none" stroke={darkMode ? "rgba(255,255,255,0.03)" : "rgba(79, 70, 229, 0.03)"} strokeWidth="1" strokeDasharray="4,8" />
          </svg>
        </div>

        {/* Compass element */}
        <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 p-2 rounded-xl border border-slate-200 dark:border-slate-750 backdrop-blur-md flex items-center justify-center shadow">
          <Compass className="w-5 h-5 text-brand-600 animate-spin-slow" />
        </div>

        {/* Map Widgets Scale controls */}
        <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 text-[10px] font-mono shadow">
          Scale: {1000 / (zoomLevel - 9)} m | Lat: {mapCenter.lat.toFixed(4)}, Lng: {mapCenter.lng.toFixed(4)}
        </div>

        {/* Map Control Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
          <button 
            onClick={handleZoomIn}
            className="p-2 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md flex items-center justify-center"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-2 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md flex items-center justify-center"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* --- GEOMETRICAL MAP NODES --- */}

        {/* 1. Core Property Anchor Point Center */}
        <div 
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group transition-transform"
        >
          {/* Ripple pulse ring animation */}
          <span className="absolute inline-flex h-14 w-14 rounded-full bg-brand-500/30 animate-ping opacity-75"></span>
          
          <div className="bg-brand-600 text-white p-3 rounded-full shadow-lg border border-white relative">
            <MapPin className="w-5 h-5 fill-brand-400" />
          </div>
          <div className="bg-slate-900/90 text-white text-[11px] font-bold py-1 px-2.5 rounded-md mt-1.5 shadow max-w-[150px] truncate text-center backdrop-blur-sm border border-slate-700">
            {property.name}
          </div>
        </div>

        {/* 2. College Nodes */}
        {(activeFilter === 'all' || activeFilter === 'college') && 
          property.nearbyColleges.map((col, idx) => {
            const pos = getSimulatedCoordinates(idx, property.nearbyColleges.length, 120);
            return (
              <div 
                key={`col-${idx}`}
                className="absolute z-10 transition-all flex flex-col items-center text-center"
                style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
              >
                {/* SVG Line connecting back to center (50%, 50%) */}
                <svg className="absolute -top-[100px] -left-[100px] w-[200px] h-[200px] pointer-events-none opacity-30">
                  <line x1="100" y1="100" x2={100 + (pos.x - 50) * 2} y2={100 + (pos.y - 50) * 2} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3,3" />
                </svg>

                <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-md border border-white">
                  <School className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 p-1 rounded mt-1 text-[9px] font-semibold max-w-[110px] truncate card-shadow">
                  {col.name} <span className="text-blue-500 text-[8px]">({col.distance})</span>
                </div>
              </div>
            );
          })
        }

        {/* 3. Hospital Nodes */}
        {(activeFilter === 'all' || activeFilter === 'hospital') && 
          property.nearbyHospitals.map((hosp, idx) => {
            const pos = getSimulatedCoordinates(idx + 1.5, property.nearbyHospitals.length + 2, 110);
            return (
              <div 
                key={`hosp-${idx}`}
                className="absolute z-10 transition-all flex flex-col items-center text-center"
                style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
              >
                <div className="bg-rose-600 text-white p-1.5 rounded-lg shadow-md border border-white">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 p-1 rounded mt-1 text-[9px] font-semibold max-w-[110px] truncate card-shadow">
                  {hosp.name} <span className="text-rose-500 text-[8px]">({hosp.distance})</span>
                </div>
              </div>
            );
          })
        }

        {/* 4. Market Nodes */}
        {(activeFilter === 'all' || activeFilter === 'market') && 
          property.nearbyMarkets.map((mkt, idx) => {
            const pos = getSimulatedCoordinates(idx + 3.5, property.nearbyMarkets.length + 3, 130);
            return (
              <div 
                key={`mkt-${idx}`}
                className="absolute z-10 transition-all flex flex-col items-center text-center"
                style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
              >
                <div className="bg-amber-500 text-white p-1.5 rounded-lg shadow-md border border-white">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 p-1 rounded mt-1 text-[9px] font-semibold max-w-[110px] truncate card-shadow">
                  {mkt.name} <span className="text-amber-600 text-[8px]">({mkt.distance})</span>
                </div>
              </div>
            );
          })
        }

      </div>

      {/* Map Proximity Stats Sidebar Panel */}
      <div className={`w-full md:w-80 p-4 shrink-0 flex flex-col text-left ${
        darkMode ? 'bg-slate-850 border-t border-slate-750 md:border-t-0 md:border-l' : 'bg-white border-t border-slate-200 md:border-t-0 md:border-l'
      }`}>
        <h4 className="font-display font-bold text-sm tracking-wide uppercase text-slate-400 mb-3 flex items-center">
          <Navigation className="w-4 h-4 mr-1 text-brand-500" /> Proximity & Locality
        </h4>

        {/* Filters buttons */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`text-[10px] font-semibold py-1.5 px-2 rounded-md border text-center transition-all ${
              activeFilter === 'all' 
                ? 'bg-brand-600 border-brand-600 text-white font-bold' 
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Locations
          </button>
          <button 
            onClick={() => setActiveFilter('college')}
            className={`text-[10px] font-semibold py-1.5 px-2 rounded-md border text-center flex items-center justify-center gap-1 ${
              activeFilter === 'college' 
                ? 'bg-blue-600 border-blue-600 text-white font-bold' 
                : 'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-900/35 dark:text-blue-300'
            }`}
          >
            <School className="w-3 h-3" /> Colleges
          </button>
          <button 
            onClick={() => setActiveFilter('hospital')}
            className={`text-[10px] font-semibold py-1.5 px-2 rounded-md border text-center flex items-center justify-center gap-1 ${
              activeFilter === 'hospital' 
                ? 'bg-rose-600 border-rose-600 text-white font-bold' 
                : 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-900/35 dark:text-rose-300'
            }`}
          >
            <Activity className="w-3 h-3" /> Hospitals
          </button>
          <button 
            onClick={() => setActiveFilter('market')}
            className={`text-[10px] font-semibold py-1.5 px-2 rounded-md border text-center flex items-center justify-center gap-1 ${
              activeFilter === 'market' 
                ? 'bg-amber-500 border-amber-500 text-white font-bold' 
                : 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900/35 dark:text-amber-300'
            }`}
          >
            <ShoppingBag className="w-3 h-3" /> Markets
          </button>
        </div>

        {/* Landmarks checklist */}
        <div className="flex-grow overflow-y-auto space-y-2.5 max-h-[170px] pr-1">
          {/* Colleges lists */}
          {(activeFilter === 'all' || activeFilter === 'college') && property.nearbyColleges.map((col, idx) => (
            <div key={`side-col-${idx}`} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="flex items-center font-medium truncate pr-2">
                <School className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" />
                {col.name}
              </span>
              <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded shrink-0">
                {col.distance}
              </span>
            </div>
          ))}

          {/* Hospitals Lists */}
          {(activeFilter === 'all' || activeFilter === 'hospital') && property.nearbyHospitals.map((hosp, idx) => (
            <div key={`side-hosp-${idx}`} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="flex items-center font-medium truncate pr-2">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-rose-500 shrink-0" />
                {hosp.name}
              </span>
              <span className="text-[10px] font-mono bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded shrink-0">
                {hosp.distance}
              </span>
            </div>
          ))}

          {/* Markets lists */}
          {(activeFilter === 'all' || activeFilter === 'market') && property.nearbyMarkets.map((mkt, idx) => (
            <div key={`side-mkt-${idx}`} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="flex items-center font-medium truncate pr-2">
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0" />
                {mkt.name}
              </span>
              <span className="text-[10px] font-mono bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded shrink-0">
                {mkt.distance}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic distance marker highlight */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
          📍 Core micro-market: <strong className="text-slate-800 dark:text-slate-200">{property.area}, {property.city}</strong>. Transit links match primary bus depots within 5 mins walking interval.
        </div>

      </div>

    </div>
  );
}

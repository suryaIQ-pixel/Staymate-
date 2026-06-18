/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Building, Users, Calendar, Banknote, ClipboardCheck, Sparkles, Image as ImageIcon, Send, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { Property, Booking, OwnerLead, PropertyType, SharingType, FurnishedStatus, GenderPreference } from '../types';

interface OwnerDashboardProps {
  ownerProperties: Property[];
  ownerBookings: Booking[];
  onAddProperty: (newProp: Omit<Property, 'id' | 'rating' | 'reviewsCount'>) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  verifiedKYC: boolean;
  onOpenKYC: () => void;
  onPromoteProperty: (propertyId: string) => void;
}

export default function OwnerDashboard({
  ownerProperties,
  ownerBookings,
  onAddProperty,
  onUpdateBookingStatus,
  verifiedKYC,
  onOpenKYC,
  onPromoteProperty
}: OwnerDashboardProps) {
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings' | 'add'>('listings');
  
  // Add property form states
  const [name, setName] = useState('');
  const [type, setType] = useState<PropertyType>('PG');
  const [city, setCity] = useState('Bangalore');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('8000');
  const [sharing, setSharing] = useState<SharingType>('Double');
  const [ac, setAc] = useState(true);
  const [foodIncluded, setFoodIncluded] = useState(true);
  const [furnished, setFurnished] = useState<FurnishedStatus>('Fully-Furnished');
  const [genderEligibility, setGenderEligibility] = useState<GenderPreference>('Co-Living');
  const [vacancies, setVacancies] = useState('5');
  const [aboutMsg, setAboutMsg] = useState('');
  
  // Custom alert messages
  const [successMsg, setSuccessMsg] = useState('');

  // Total Revenue Calculation
  const totalRevenue = ownerBookings
    .filter(b => b.status === 'Confirmed')
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  // Active bookings count
  const activeBookingsCount = ownerBookings.filter(b => b.status === 'Confirmed').length;

  // Handle adding property
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedKYC) {
      alert('🔒 Please complete your government KYC before adding new stays!');
      return;
    }

    onAddProperty({
      name,
      type,
      city,
      area,
      price: Number(price),
      sharing,
      ac,
      foodIncluded,
      furnished,
      genderEligibility,
      vacancies: Number(vacancies),
      images: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80'
      ],
      amenities: ['High Speed WiFi', 'Daily Deep Cleaning', 'Geyser Enabled Washing', 'Pure Drinking Ro Water'],
      lat: city === 'Bangalore' ? 12.93 : city === 'Delhi' ? 28.69 : 19.12,
      lng: city === 'Bangalore' ? 77.62 : city === 'Delhi' ? 77.20 : 72.91,
      nearbyColleges: [{ name: 'Adjoining College campus cluster', distance: '1.2 km' }],
      nearbyHospitals: [{ name: 'Apollo Clinic', distance: '0.8 km' }],
      nearbyMarkets: [{ name: 'Super Bazaar D-Mart', distance: '0.5 km' }],
      ownerId: 'owner-anil',
      ownerName: 'Anil Kumar',
      ownerPhone: '+91 98765 43210',
      ownerEmail: 'anil.staymate@gmail.com',
      featured: false,
      sponsored: false
    });

    setName('');
    setArea('');
    setPrice('8000');
    setVacancies('5');
    setSuccessMsg('✨ Your accommodation listing has been submitted successfully!');
    setActiveTab('listings');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      
      {/* Alert Banner */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-semibold text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* KYC Alert Gate */}
      {!verifiedKYC && (
        <div className="mb-8 p-5 bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 text-red-700 dark:text-red-300 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-base flex items-center gap-1.5 text-red-600 dark:text-red-400">
              🔒 Action Required: Complete Verification
            </h3>
            <span className="text-xs text-slate-500 block">UIDAI specifications require biometric ID verification before allowing landlords to publish rental properties.</span>
          </div>
          <button 
            onClick={onOpenKYC}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors w-fit cursor-pointer"
          >
            Submit Aadhaar Verification Scan
          </button>
        </div>
      )}

      {/* Overview stats cards section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-750 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">My Active Stays</span>
            <Building className="w-5 h-5 text-indigo-500" />
          </div>
          <span className="text-3xl font-bold block">{ownerProperties.length}</span>
          <span className="text-[11px] text-slate-400">Live & welcoming leads</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-750 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Total Bookings</span>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-bold block">{ownerBookings.length}</span>
          <span className="text-[11px] text-emerald-500 font-medium">✨ {activeBookingsCount} confirmed stays</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-750 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Pending Requests</span>
            <ClipboardCheck className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-bold block">
            {ownerBookings.filter(b => b.status === 'Pending').length}
          </span>
          <span className="text-[11px] text-amber-500 font-medium">Awaiting landlord approval</span>
        </div>

        <div className="bg-gradient-to-br from-brand-600 to-indigo-850 p-5 rounded-3xl text-white card-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-brand-100 font-bold uppercase tracking-wide">Secure Settled Revenue</span>
            <Banknote className="w-5 h-5 text-brand-200" />
          </div>
          <span className="text-3xl font-display font-bold block">₹{totalRevenue.toLocaleString()}</span>
          <span className="text-[11px] text-emerald-200 font-medium">After platform margin (0%)</span>
        </div>
      </div>

      {/* --- DASHBOARD NAVIGATION --- */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 mb-8 overflow-x-auto gap-4">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-4 text-sm font-semibold transition-colors border-b-2 px-1 ${
            activeTab === 'listings' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400'
          }`}
        >
          My Listed Stays ({ownerProperties.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 text-sm font-semibold transition-colors border-b-2 px-1 ${
            activeTab === 'bookings' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400'
          }`}
        >
          Manage Booking Requests ({ownerBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`pb-4 text-sm font-semibold transition-colors border-b-2 px-1 flex items-center ${
            activeTab === 'add' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400'
          }`}
        >
          <Plus className="w-4 h-4 mr-1" /> Add New Accommodation
        </button>
      </div>

      {/* TAB CONTENTS - LISTINGS */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerProperties.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
              <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <span className="text-sm font-medium block mb-1">No accommodations published yet</span>
              <span className="text-xs text-slate-400 block mb-4">Complete your KYC verification and publish your PG/Room!</span>
              <button 
                onClick={() => setActiveTab('add')}
                className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                List Stay Now
              </button>
            </div>
          ) : (
            ownerProperties.map(prop => (
              <div key={prop.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden card-shadow">
                <img src={prop.images[0]} alt={prop.name} className="w-full h-44 object-cover" referrerPolicy="no-referrer" />
                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-800 dark:text-white truncate">{prop.name}</h4>
                    <span className="text-xs text-slate-400">{prop.area}, {prop.city}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Rent per month:</span>
                    <strong className="text-brand-600 dark:text-brand-400">₹{prop.price.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-50 dark:border-slate-700/50">
                    <span className="text-slate-500">Vacancies left:</span>
                    <strong className="text-slate-800 dark:text-white">{prop.vacancies} Rooms</strong>
                  </div>
                  
                  {/* Premium Featured booster */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    {prop.featured ? (
                      <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg flex items-center">
                        <Sparkles className="w-3.5 h-3.5 mr-1" /> Boosted Active
                      </span>
                    ) : (
                      <button
                        onClick={() => onPromoteProperty(prop.id)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold uppercase py-2 px-3 rounded-xl shadow-md cursor-pointer transition-colors text-center"
                      >
                        ⚡ Boost to Featured (Featured Placements)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENTS - BOOKINGS AND LEADS */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 card-shadow overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
            <h4 className="font-display font-bold text-sm uppercase tracking-wide text-slate-400">Incoming booking lead stream</h4>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {ownerBookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <span className="text-xs block">Awaiting student checkout deposits... Leads will load instantly here.</span>
              </div>
            ) : (
              ownerBookings.map(book => (
                <div key={book.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex gap-4">
                    <img src={book.propertyImage} alt={book.propertyName} className="w-14 h-14 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{book.propertyName}</span>
                      <h5 className="font-display font-bold text-sm text-slate-800 dark:text-white">{book.userName}</h5>
                      <span className="text-xs text-slate-500 block">
                        {(book.userEmail === 'suryakant11th@gmail.com' || book.userPhone?.includes('8862966355')) ? '******6355' : book.userPhone} • {book.userEmail}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1">Check-in goal: <strong>{book.checkInDate}</strong> • Type: {book.sharingOption}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full text-center tracking-wide block ${
                      book.status === 'Confirmed' 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                        : book.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {book.status}
                    </span>
                    <strong className="text-xs text-slate-700 dark:text-slate-300">Deposit: ₹{book.amountPaid.toLocaleString()}</strong>
                    
                    {book.status === 'Pending' && (
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => onUpdateBookingStatus(book.id, 'Confirmed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          Approve Stay
                        </button>
                        <button
                          onClick={() => onUpdateBookingStatus(book.id, 'Cancelled')}
                          className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENTS - ADD PROPERTY */}
      {activeTab === 'add' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 card-shadow max-w-2xl">
          <div className="mb-6">
            <h4 className="font-display font-bold text-lg text-slate-800 dark:text-white">Register Accommodation</h4>
            <span className="text-xs text-slate-400">Post details of your PG Hostels, Flat or Shared rooms. Verified instantly after government KYC check.</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Stay / PG Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Isthara Co-Living Koramangala"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Property Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="PG">PG (Paying Guest)</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Apartment">Apartment / Flats</option>
                  <option value="Room">Private Single Room</option>
                  <option value="Guest House">Guest House</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Hub Location (City)</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Micro Market Area (Locality)</label>
                <input 
                  type="text"
                  placeholder="e.g. Saket, North Campus, Koramangala, Powai"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Monthly Rent (₹)</label>
                <input 
                  type="number"
                  placeholder="9500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Sharing Plan</label>
                <select
                  value={sharing}
                  onChange={(e) => setSharing(e.target.value as SharingType)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                  <option value="Co-living">Co-living Layout</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Vacant Rooms</label>
                <input 
                  type="number"
                  placeholder="3"
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            {/* Checklist amenities options */}
            <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="ac"
                  checked={ac}
                  onChange={(e) => setAc(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 shrink-0"
                />
                <label htmlFor="ac" className="text-xs font-medium text-slate-700 dark:text-slate-300">Air Conditioning (AC) included</label>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="foodIncluded"
                  checked={foodIncluded}
                  onChange={(e) => setFoodIncluded(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 shrink-0"
                />
                <label htmlFor="foodIncluded" className="text-xs font-medium text-slate-700 dark:text-slate-300">Dynamic Meals Included (Veg/Non-Veg)</label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Furnished Status</label>
                <select
                  value={furnished}
                  onChange={(e) => setFurnished(e.target.value as FurnishedStatus)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Fully-Furnished">Fully-Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide mb-1.5">Gender Eligibility</label>
                <select
                  value={genderEligibility}
                  onChange={(e) => setGenderEligibility(e.target.value as GenderPreference)}
                  className="w-full text-xs p-3 border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Co-Living">Co-Living (Mixed)</option>
                  <option value="Boys">Boys-Only Stay</option>
                  <option value="Girls">Girls-Only Stay</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              id="btn-add-property-form"
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
            >
              Publish Stay Accommodation
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, SlidersHorizontal, MapPin, Grid, Layers, Sparkles, AlertCircle, ShoppingBag, 
  Trash2, FileText, CheckCircle2, UserCheck, ShieldCheck, Map, Star, BookOpen, Clock, Building
} from 'lucide-react';

import { Property, Booking, User, PaymentRecord, VerificationRequest, Review } from './types';
import { INITIAL_PROPERTIES, INITIAL_REVIEWS } from './mockData';

// Component Imports
import Navbar from './components/Navbar';
import ListingCard from './components/ListingCard';
import PropertyDetail from './components/PropertyDetail';
import CheckoutModal from './components/CheckoutModal';
import KYCModal from './components/KYCModal';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import AIChatRecommender from './components/AIChatRecommender';

export default function App() {
  
  // App-level global configurations
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeView, setView] = useState<'explore' | 'owner-dashboard' | 'admin-dashboard'>('explore');
  const [showMyBookings, setShowMyBookings] = useState<boolean>(false);
  
  // Current user simulator
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-suryakant',
    name: 'Suryakant Sharma',
    email: 'suryakant11th@gmail.com',
    phone: '+91 95550 11223',
    role: 'tenant',
    verifiedKYC: false
  });

  // State arrays fetched from full-stack JSON or fallbacks
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [kycRequests, setKycRequests] = useState<VerificationRequest[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Filtering variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<'All' | 'Bangalore' | 'Delhi' | 'Mumbai' | 'Pune'>('All');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Boys' | 'Girls' | 'Co-Living'>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSharing, setSelectedSharing] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [acFilter, setAcFilter] = useState<boolean>(false);
  const [mealsFilter, setMealsFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');

  // Modal dialog togglers
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookingTarget, setBookingTarget] = useState<Property | null>(null);
  const [isKYCOpen, setIsKYCOpen] = useState<boolean>(false);

  // Initial synchronization with full-stack endpoints
  useEffect(() => {
    syncAppWithBackend();
  }, []);

  const syncAppWithBackend = async () => {
    try {
      // Properties GET
      const propRes = await fetch('/api/properties');
      if (propRes.ok) {
        const propData = await propRes.json();
        setProperties(propData.length > 0 ? propData : INITIAL_PROPERTIES);
      } else {
        setProperties(INITIAL_PROPERTIES);
      }

      // Reviews GET
      const revRes = await fetch('/api/reviews');
      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(revData.length > 0 ? revData : INITIAL_REVIEWS);
      } else {
        setReviews(INITIAL_REVIEWS);
      }

      // Bookings GET
      const bookRes = await fetch('/api/bookings');
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        setBookings(bookData);
      }

      // KYC GET
      const kycRes = await fetch('/api/kyc');
      if (kycRes.ok) {
        const kycData = await kycRes.json();
        setKycRequests(kycData);
      }

      // Payments Ledger GET
      const payRes = await fetch('/api/payments');
      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData);
      }
    } catch (err) {
      console.warn("REST API is warming up. Seeding local models instead.", err);
      setProperties(INITIAL_PROPERTIES);
      setReviews(INITIAL_REVIEWS);
    }
  };

  // Add Dynamic Property listing on server
  const handleAddProperty = async (newProp: Omit<Property, 'id' | 'rating' | 'reviewsCount'>) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });
      if (res.ok) {
        await syncAppWithBackend();
      }
    } catch (e) {
      console.error("Save listing error:", e);
      // fallback
      const mockNew: Property = {
        ...newProp,
        id: `prop-${Math.floor(Math.random() * 100000)}`,
        rating: 4.5,
        reviewsCount: 1
      };
      setProperties(prev => [mockNew, ...prev]);
    }
  };

  // Premium boosting feature
  const handlePromoteProperty = async (propId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        return { ...p, featured: true };
      }
      return p;
    }));
    alert("⚡ Stay promoted! Placing premium featured tags and visual banners across listings.");
  };

  // Review submission
  const handleAddReview = async (propId: string, rating: number, comment: string) => {
    const newRev = {
      propertyId: propId,
      userName: currentUser.name,
      userPic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      rating,
      comment,
      date: 'Today',
      verified: true
    };

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev)
      });
      await syncAppWithBackend();
    } catch (e) {
      console.error(e);
      // local push fallback
      const seededRev: Review = {
        ...newRev,
        id: `rev-add-${Date.now()}`
      };
      setReviews(prev => [seededRev, ...prev]);
    }
  };

  // Handle KYC Document Completion
  const handleKYCVerification = async (aadhaarNum: string) => {
    try {
      await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: currentUser.id,
          ownerName: currentUser.name,
          ownerEmail: currentUser.email,
          documentType: 'Aadhaar Card',
          documentNumber: aadhaarNum
        })
      });

      // Update local state is immediate
      setCurrentUser(prev => ({ ...prev, verifiedKYC: true }));
      await syncAppWithBackend();
    } catch (e) {
      console.error(e);
      setCurrentUser(prev => ({ ...prev, verifiedKYC: true }));
    }
  };

  // KYC admin approvals
  const handleApproveKYCOwner = async (requestId: string, email: string) => {
    try {
      await fetch(`/api/kyc?id=${requestId}`, { method: 'PUT' });
      await syncAppWithBackend();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectKYCOwner = (requestId: string) => {
    setKycRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // Confirm Razorpay session success
  const handlePaymentSuccess = async (bookingId: string, transactionId: string) => {
    setBookingTarget(null);
    await syncAppWithBackend();
    setShowMyBookings(true);
  };

  // Cancel stay bookings
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking and request a deposit refund?")) return;
    try {
      await fetch(`/api/bookings?id=${bookingId}`, { method: 'DELETE' });
      await syncAppWithBackend();
    } catch (err) {
      console.error(err);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    }
  };

  // Update checkin status (Owner approved)
  const handleUpdateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status })
      });
      await syncAppWithBackend();
    } catch (err) {
      console.error(err);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    }
  };

  // Match landlord stays owned by current simulator model
  const ownerStays = properties.filter(p => p.ownerEmail === currentUser.email);
  const ownerBookingsFiltered = bookings.filter(b => 
    ownerStays.some(os => os.name === b.propertyName)
  );

  // Search and Advanced Filters matching Logic
  const filteredProperties = properties.filter(prop => {
    // City match
    if (selectedCity !== 'All' && prop.city !== selectedCity) return false;
    
    // Gender match
    if (selectedGender !== 'All' && prop.genderEligibility !== selectedGender) return false;

    // Type match
    if (selectedType !== 'All' && selectedType !== '' && prop.type !== selectedType) return false;

    // Sharing match
    if (selectedSharing !== 'All' && selectedSharing !== '' && prop.sharing !== selectedSharing) return false;

    // Price range
    if (prop.price > maxPrice) return false;

    // AC checklist
    if (acFilter && !prop.ac) return false;

    // Meals checklist
    if (mealsFilter && !prop.foodIncluded) return false;

    // Text search (matches City, Area, Nearby College name, or Property Name)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = prop.name.toLowerCase().includes(q);
      const matchCity = prop.city.toLowerCase().includes(q);
      const matchArea = prop.area.toLowerCase().includes(q);
      const matchCollege = prop.nearbyColleges.some(c => c.name.toLowerCase().includes(q));
      
      if (!matchName && !matchCity && !matchArea && !matchCollege) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return 0;
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
      darkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-[#fafbfc] text-slate-800'
    }`}>
      
      {/* Navbar Container */}
      <Navbar 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        showBookings={showMyBookings}
        setShowBookings={setShowMyBookings}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setView={setView}
        activeView={activeView}
      />

      {/* DYNAMIC SCREEN BRANCHING */}
      {showMyBookings ? (
        
        // TENANT'S MY BOOKINGS PANEL VIEW
        <div className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full text-left">
          
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="font-display font-bold text-2xl">My Stays & Bookings</h2>
              <span className="text-xs text-slate-400">View advance deposit receipts, transaction IDs, check-in schedules, and download invoices.</span>
            </div>
            
            <button
              onClick={() => setShowMyBookings(false)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              See Accommodations
            </button>
          </div>

          {bookings.filter(b => b.userEmail === currentUser.email).length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">No Stay reservations found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-4">Book a PG or Hostel accommodation instantly to see billing receipts here.</p>
              <button 
                onClick={() => setShowMyBookings(false)}
                className="bg-brand-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow cursor-pointer"
              >
                Browse Accommodations
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.filter(b => b.userEmail === currentUser.email).map(elem => (
                <div key={elem.id} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-3xl card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                  <div className="flex gap-4">
                    <img src={elem.propertyImage} alt={elem.propertyName} className="w-16 h-16 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">{elem.sharingOption} Sharing</span>
                      <h4 className="font-display font-extrabold text-base text-slate-805 dark:text-white leading-tight">{elem.propertyName}</h4>
                      <span className="text-xs text-slate-500 block">Check-in Goal: <strong>{elem.checkInDate}</strong></span>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold text-slate-500 uppercase">
                          ID: {elem.id}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                          elem.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {elem.status === 'Confirmed' ? '🟢 Confirmed Stay' : '⏳ Landlord Review'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Refundable deposit paid</span>
                      <span className="font-display font-extrabold text-lg text-brand-600 dark:text-brand-400">₹{elem.amountPaid.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        id={`invoice-${elem.id}`}
                        href={`/api/bookings/${elem.id}/invoice`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-3 bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" /> PDF Invoice
                      </a>
                      <button
                        onClick={() => handleCancelBooking(elem.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800 text-slate-400 shrink-0 cursor-pointer"
                        title="Cancel Stay & Refund Deposit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      ) : activeView === 'owner-dashboard' ? (
        
        // OWNER / LANDLORD SCREEN VIEW
        <OwnerDashboard 
          ownerProperties={ownerStays}
          ownerBookings={ownerBookingsFiltered}
          onAddProperty={handleAddProperty}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          verifiedKYC={currentUser.verifiedKYC}
          onOpenKYC={() => setIsKYCOpen(true)}
          onPromoteProperty={handlePromoteProperty}
        />

      ) : activeView === 'admin-dashboard' ? (
        
        // ADMIN PLATFORM MANAGEMENT VIEW
        <AdminDashboard 
          properties={properties}
          bookings={bookings}
          kycRequests={kycRequests}
          payments={payments}
          onApproveKYC={handleApproveKYCOwner}
          onRejectKYC={handleRejectKYCOwner}
        />

      ) : (
        
        // PRIMARY SEARCH EXPLORE ENGINE
        <div className="flex-grow flex flex-col">
          
          {/* Elegant Hero Intro */}
          <div className="bg-gradient-to-b from-blue-50/60 to-transparent dark:from-slate-900/30 dark:to-transparent py-12 text-left">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="max-w-3xl space-y-4 mb-8">
                <span className="bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full inline-block shadow-sm">
                  🚀 India's First KYC-Verified Accommodation Hub
                </span>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight text-slate-900 dark:text-white tracking-tight">
                  Find premium student <span className="text-brand-600 dark:text-brand-400">PGs, Hostels, and Rooms</span>.
                </h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl">
                  StayMate connects verified university campuses, business techparks, and premium shared lodgings with zero brokerages.
                </p>
              </div>

              {/* Advanced Big Search Bar Widget */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-3xl card-shadow max-w-4xl flex flex-col md:flex-row gap-3">
                <div className="flex-grow flex items-center px-2">
                  <Search className="w-5 h-5 text-slate-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search area, college campus (e.g. Koramangala, Christ University, Hansraj, Saket, IIT Bombay)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm bg-transparent border-none placeholder-slate-400 text-slate-700 dark:text-white focus:outline-none focus:ring-0"
                  />
                </div>

                {/* City select dropdown */}
                <div className="border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 px-3 py-2 flex items-center">
                  <MapPin className="w-4 h-4 text-brand-600 mr-1.5" />
                  <select
                    value={selectedCity}
                    onChange={(e) => { setSelectedCity(e.target.value as any); }}
                    className="text-xs bg-transparent font-semibold border-none cursor-pointer focus:outline-none pr-6 text-slate-600 dark:text-slate-200"
                  >
                    <option value="All">All Cities (India)</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 text-[11px] px-3.5 py-2 rounded-2xl flex items-center justify-between font-mono font-medium text-slate-400 shrink-0">
                  ⚡ Nearby listings auto-mapped
                </div>
              </div>

              {/* City Quick Navigation Badges */}
              <div className="flex gap-2.5 overflow-x-auto mt-4 pt-1 max-w-lg scrollbar-none">
                {['All', 'Bangalore', 'Delhi', 'Mumbai', 'Pune'].map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => setSelectedCity(cityName as any)}
                    className={`text-[10px] font-bold py-1.5 px-3 rounded-full border tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                      (selectedCity === cityName)
                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {cityName === 'All' ? '📌 India wide' : cityName}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* MAIN COLUMN SPLIT GATES */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow w-full flex flex-col lg:flex-row gap-8 pb-16">
            
            {/* Filter sidebar rail: Sticky styled */}
            <aside className="w-full lg:w-72 shrink-0 text-left space-y-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-3xl card-shadow space-y-5 sticky top-20">
                
                <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-750/50">
                  <span className="font-display font-extrabold text-sm uppercase text-slate-400 flex items-center gap-1">
                    <SlidersHorizontal className="w-4 h-4 text-brand-605" /> Filter Parameters
                  </span>
                  
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('All');
                      setSelectedGender('All');
                      setSelectedType('All');
                      setSelectedSharing('All');
                      setMaxPrice(20000);
                      setAcFilter(false);
                      setMealsFilter(false);
                    }}
                    className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>

                {/* Accommodations type select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Lodging Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  >
                    <option value="All">All Types (PG, Hostels, Flats)</option>
                    <option value="PG">Paying Guest (PG)</option>
                    <option value="Hostel">Hostel Accommodation</option>
                    <option value="Apartment">Apartment Flats</option>
                    <option value="Room">Private Single Rooms</option>
                  </select>
                </div>

                {/* Gender Eligibility Selector for Indian Hostels */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Gender Preference</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { key: 'All', label: 'All Eligibility' },
                      { key: 'Boys', label: 'Boys Only' },
                      { key: 'Girls', label: 'Girls Only' },
                      { key: 'Co-Living', label: 'Co-Living' }
                    ].map(g => (
                      <button
                        type="button"
                        key={g.key}
                        onClick={() => setSelectedGender(g.key as any)}
                        className={`text-[9px] font-extrabold py-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                          selectedGender === g.key 
                            ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-305'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sharing Preferences */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Room Sharing Tier</label>
                  <select
                    value={selectedSharing}
                    onChange={(e) => setSelectedSharing(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  >
                    <option value="All">All Sharing</option>
                    <option value="Single">Single Sharing bed</option>
                    <option value="Double">Double occupancy</option>
                    <option value="Triple">Triple shared rooms</option>
                    <option value="Co-living">Studio Co-living</option>
                  </select>
                </div>

                {/* Rent slider filter */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    <span>Monthly Rent Limit</span>
                    <strong className="text-brand-600 dark:text-brand-400 text-xs font-display">₹{maxPrice.toLocaleString()}</strong>
                  </div>
                  <input 
                    type="range"
                    min={5000}
                    max={25000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-805 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                    <span>₹5,000 / mo</span>
                    <span>₹25,000 / mo</span>
                  </div>
                </div>

                {/* Checkboxes parameters */}
                <div className="pt-3 border-t border-slate-50 dark:border-slate-800 space-y-2.5">
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="filter-ac"
                      checked={acFilter}
                      onChange={(e) => setAcFilter(e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 border-slate-300 dark:border-slate-800"
                    />
                    <label htmlFor="filter-ac" className="text-xs font-semibold text-slate-600 dark:text-slate-350 select-none">
                      ❄️ Air Conditioned (AC) only
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="filter-meals"
                      checked={mealsFilter}
                      onChange={(e) => setMealsFilter(e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4 border-slate-300 dark:border-slate-800"
                    />
                    <label htmlFor="filter-meals" className="text-xs font-semibold text-slate-600 dark:text-slate-350 select-none">
                      🍽️ Veg/Non Veg Meals Included
                    </label>
                  </div>

                </div>

              </div>

            </aside>

            {/* Results Listings Content Column */}
            <main className="flex-grow text-left space-y-6">
              
              {/* Filter summaries / sorting toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-3xl card-shadow">
                <div>
                  <span className="text-sm font-bold block">
                    {filteredProperties.length} Accommodations found
                  </span>
                  <span className="text-xs text-slate-400">Showing top ratings stays near universities</span>
                </div>

                {/* Sort selector */}
                <div className="flex items-center space-x-2.5 text-xs text-slate-500 font-semibold shrink-0">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="p-1.5 border border-slate-205 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-white"
                  >
                    <option value="rating">⭐️ Top Resident Reviews</option>
                    <option value="priceAsc">Rent: Low to High</option>
                    <option value="priceDesc">Rent: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Listings Grid */}
              {filteredProperties.length === 0 ? (
                <div className="py-24 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
                  <Building className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-display font-bold text-lg text-slate-700 dark:text-slate-350">No stay listings correspond</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Adjust limit parameters, deselect AC filters, or write another campus search query above to see matches.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map(prop => (
                    <div key={prop.id}>
                      <ListingCard 
                        property={prop}
                        onSelect={(p) => setSelectedProperty(p)}
                        onQuickBook={(p) => setBookingTarget(p)}
                      />
                    </div>
                  ))}
                </div>
              )}

            </main>

          </div>

        </div>
      )}

      {/* --- OVERLAY MODALS REGISTRY --- */}

      {/* 1. Property Details view */}
      {selectedProperty && (
        <PropertyDetail 
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onBookNow={(p) => { setSelectedProperty(null); setBookingTarget(p); }}
          darkMode={darkMode}
          onAddReview={handleAddReview}
          reviews={reviews}
        />
      )}

      {/* 2. Razorpay checkout gateway modal */}
      {bookingTarget && (
        <CheckoutModal 
          property={bookingTarget}
          onClose={() => setBookingTarget(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 3. National Aadhaar scanner KYC validation modal */}
      {isKYCOpen && (
        <KYCModal 
          onClose={() => setIsKYCOpen(false)}
          onVerificationComplete={handleKYCVerification}
          userName={currentUser.name}
        />
      )}

      {/* 4. Floating AI sidechat helper */}
      <AIChatRecommender 
        currentUserEmail={currentUser.email}
        properties={properties}
        onSelectProperty={(p) => { setSelectedProperty(p); }}
      />

    </div>
  );
}

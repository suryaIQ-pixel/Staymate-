/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'tenant' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  verifiedKYC: boolean;
  aadhaarNumber?: string;
  profilePic?: string;
  walletBalance: number;
}

export type PropertyType = 'PG' | 'Hostel' | 'Room' | 'Apartment' | 'Guest House';
export type SharingType = 'Single' | 'Double' | 'Triple' | 'Co-living';
export type GenderPreference = 'Boys' | 'Girls' | 'Co-Living';
export type FurnishedStatus = 'Unfurnished' | 'Semi-Furnished' | 'Fully-Furnished';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  rating: number;
  reviewsCount: number;
  city: string;
  area: string;
  price: number; // monthly rent in INR
  sharing: SharingType;
  ac: boolean;
  foodIncluded: boolean;
  furnished: FurnishedStatus;
  images: string[];
  amenities: string[];
  genderEligibility: GenderPreference;
  vacancies: number;
  lat: number;
  lng: number;
  nearbyColleges: { name: string; distance: string }[];
  nearbyHospitals: { name: string; distance: string }[];
  nearbyMarkets: { name: string; distance: string }[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  featured: boolean;
  sponsored: boolean;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  checkInDate: string;
  sharingOption: SharingType;
  status: BookingStatus;
  amountPaid: number;
  paymentId?: string;
  createdAt: string;
  invoiceUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: string; // email or 'AI'
  receiver: string; // email or 'AI'
  message: string;
  timestamp: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  userName: string;
  propertyName: string;
  amount: number;
  status: 'Success' | 'Failed';
  paymentMethod: string;
  transactionId: string;
  timestamp: string;
}

export interface OwnerLead {
  id: string;
  propertyId: string;
  propertyName: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  status: 'New' | 'Contacted' | 'Closed' | 'Spam';
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  documentType: 'Aadhaar' | 'GSTIN' | 'PAN';
  documentNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  userPic?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

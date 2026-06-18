/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, Review } from './types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Zolo Stay Elite PG',
    type: 'PG',
    rating: 4.8,
    reviewsCount: 124,
    city: 'Bangalore',
    area: 'Koramangala',
    price: 8500,
    sharing: 'Double',
    ac: true,
    foodIncluded: true,
    furnished: 'Fully-Furnished',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
    ],
    amenities: ['High Speed WiFi', 'Daily Professional Housekeeping', '24/7 Power Backup', 'Washing Machine', 'Smart TV Box', 'Gym Access'],
    genderEligibility: 'Co-Living',
    vacancies: 6,
    lat: 12.9352,
    lng: 77.6245,
    nearbyColleges: [
      { name: 'Christ University', distance: '0.8 km' },
      { name: 'Jyoti Nivas College', distance: '0.4 km' }
    ],
    nearbyHospitals: [
      { name: 'St. John\'s Medical College Hospital', distance: '1.2 km' }
    ],
    nearbyMarkets: [
      { name: 'Koramangala Forum Mall', distance: '0.5 km' },
      { name: '80 Feet Road Bazaar', distance: '0.2 km' }
    ],
    ownerId: 'owner-anil',
    ownerName: 'Anil Kumar',
    ownerPhone: '+91 98765 43210',
    ownerEmail: 'anil.staymate@gmail.com',
    featured: true,
    sponsored: false
  },
  {
    id: 'prop-2',
    name: 'Stanza Living Montreal House',
    type: 'Hostel',
    rating: 4.9,
    reviewsCount: 89,
    city: 'Delhi',
    area: 'North Campus',
    price: 12000,
    sharing: 'Single',
    ac: true,
    foodIncluded: true,
    furnished: 'Fully-Furnished',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
    ],
    amenities: ['Unlimited WiFi', 'Gourmet North-Indian Meals', 'Biometric Security Access', 'Laundromat', 'Gaming Lounge', 'Indoor Gym'],
    genderEligibility: 'Boys',
    vacancies: 3,
    lat: 28.6942,
    lng: 77.2090,
    nearbyColleges: [
      { name: 'Hansraj College', distance: '0.3 km' },
      { name: 'Kirori Mal College', distance: '0.5 km' },
      { name: 'Hindu College', distance: '0.6 km' }
    ],
    nearbyHospitals: [
      { name: 'G.B. Pant Hospital', distance: '3.4 km' },
      { name: 'Hindu Rao Hospital', distance: '1.8 km' }
    ],
    nearbyMarkets: [
      { name: 'Kamla Nagar Market', distance: '0.4 km' },
      { name: 'Hudson Lane Food Street', distance: '0.7 km' }
    ],
    ownerId: 'owner-stanza',
    ownerName: 'Sanjay Aggarwal (Stanza Manager)',
    ownerPhone: '+91 91234 56789',
    ownerEmail: 'sanjay.stanza@outlook.com',
    featured: true,
    sponsored: true
  },
  {
    id: 'prop-3',
    name: 'Nestaway Cozy 2BHK Flat',
    type: 'Apartment',
    rating: 4.5,
    reviewsCount: 42,
    city: 'Pune',
    area: 'Hinjewadi Phase 1',
    price: 18000,
    sharing: 'Co-living',
    ac: false,
    foodIncluded: false,
    furnished: 'Semi-Furnished',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
    ],
    amenities: ['High Speed Fibre Net', 'Modular Kitchen Setup', 'Gated Society Security', 'Clubhouse & Pool Access', 'Parking Slot'],
    genderEligibility: 'Co-Living',
    vacancies: 4,
    lat: 18.5913,
    lng: 73.7389,
    nearbyColleges: [
      { name: 'Symbiosis International University', distance: '1.5 km' },
      { name: 'Alard College of Engineering', distance: '2.1 km' }
    ],
    nearbyHospitals: [
      { name: 'Ruby Hall Clinic Hinjawadi', distance: '0.9 km' }
    ],
    nearbyMarkets: [
      { name: 'D-Mart Hinjewadi', distance: '0.6 km' },
      { name: 'Xion Mall Powai road', distance: '1.1 km' }
    ],
    ownerId: 'owner-rahul',
    ownerName: 'Rahul Deshmukh',
    ownerPhone: '+91 94455 66778',
    ownerEmail: 'rahul.deshmukh@nestaway.in',
    featured: false,
    sponsored: false
  },
  {
    id: 'prop-4',
    name: 'Adarsh Girls Luxury Hostel',
    type: 'Hostel',
    rating: 4.7,
    reviewsCount: 73,
    city: 'Mumbai',
    area: 'Powai',
    price: 9500,
    sharing: 'Triple',
    ac: true,
    foodIncluded: true,
    furnished: 'Fully-Furnished',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=600&q=80'
    ],
    amenities: ['High Speed WiFi', 'Pure Veg Homely Meals', '24/7 Female Warden Guard', 'CCTV Security Vigilance', 'Biometric Entry', 'Spacious Study Cabins'],
    genderEligibility: 'Girls',
    vacancies: 8,
    lat: 19.1254,
    lng: 72.9167,
    nearbyColleges: [
      { name: 'IIT Bombay', distance: '0.4 km' },
      { name: 'IBS Mumbai', distance: '1.2 km' }
    ],
    nearbyHospitals: [
      { name: 'Dr. L H Hiranandani Hospital', distance: '0.8 km' }
    ],
    nearbyMarkets: [
      { name: 'Galleria Powai Market', distance: '0.5 km' },
      { name: 'Supreme Business Park', distance: '1.0 km' }
    ],
    ownerId: 'owner-pratima',
    ownerName: 'Pratima Shenoy',
    ownerPhone: '+91 88990 12345',
    ownerEmail: 'pratima@girlsstayspowai.com',
    featured: false,
    sponsored: true
  },
  {
    id: 'prop-5',
    name: 'Heritage Palace Guest House',
    type: 'Guest House',
    rating: 4.6,
    reviewsCount: 51,
    city: 'Delhi',
    area: 'Saket',
    price: 15000,
    sharing: 'Single',
    ac: true,
    foodIncluded: false,
    furnished: 'Fully-Furnished',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'
    ],
    amenities: ['WiFi Internet Access', 'LED Smart TV', 'Attached Washroom', 'In-room Tea Maker', 'Daily Linen Change', 'Room Service'],
    genderEligibility: 'Co-Living',
    vacancies: 5,
    lat: 28.5244,
    lng: 77.2167,
    nearbyColleges: [
      { name: 'Amity University Saket Campus', distance: '1.3 km' },
      { name: 'Bhavan\'s College SAKET', distance: '1.8 km' }
    ],
    nearbyHospitals: [
      { name: 'Max Super Speciality Hospital Saket', distance: '0.5 km' }
    ],
    nearbyMarkets: [
      { name: 'Select CITYWALK Mall', distance: '0.6 km' },
      { name: 'Saket Community Centre', distance: '0.3 km' }
    ],
    ownerId: 'owner-vikram',
    ownerName: 'Vikram Singh Roy',
    ownerPhone: '+91 99911 22334',
    ownerEmail: 'vikram.roy@saketheritage.com',
    featured: false,
    sponsored: false
  },
  {
    id: 'prop-6',
    name: 'TechPark Co-living Premium Room',
    type: 'Room',
    rating: 4.7,
    reviewsCount: 38,
    city: 'Bangalore',
    area: 'Whitefield',
    price: 11000,
    sharing: 'Single',
    ac: true,
    foodIncluded: false,
    furnished: 'Fully-Furnished',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ],
    amenities: ['Ultra High Speed WiFi (300Mbps)', 'Executive Study Workdesk', 'Access to Terrace Garden', 'Regular Maid Service', 'Power Backup Unit'],
    genderEligibility: 'Co-Living',
    vacancies: 2,
    lat: 12.9698,
    lng: 77.7499,
    nearbyColleges: [
      { name: 'Vydehi Institute of Medical Sciences', distance: '1.1 km' },
      { name: 'MVJ College of Engineering', distance: '3.5 km' }
    ],
    nearbyHospitals: [
      { name: 'Columbia Asia Hospital Whitefield', distance: '1.4 km' }
    ],
    nearbyMarkets: [
      { name: 'Inorbit Mall Whitefield', distance: '0.8 km' },
      { name: 'Ascendas Park Square Mall', distance: '1.0 km' }
    ],
    ownerId: 'owner-anil',
    ownerName: 'Anil Kumar',
    ownerPhone: '+91 98765 43210',
    ownerEmail: 'anil.staymate@gmail.com',
    featured: false,
    sponsored: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    propertyId: 'prop-1',
    userName: 'Karan Sharma',
    userPic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
    rating: 5,
    comment: 'Staying here for 6 months. Clean, safe, excellent wifi, and the food is surprisingly good for a PG. Christ is super close!',
    date: '10 June 2026',
    verified: true
  },
  {
    id: 'rev-2',
    propertyId: 'prop-1',
    userName: 'Anjali Menon',
    userPic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
    rating: 4,
    comment: 'Great facilities. The dual sharing room has enough space and wardrobes. Housekeeping is very regular.',
    date: '28 May 2026',
    verified: true
  },
  {
    id: 'rev-3',
    propertyId: 'prop-2',
    userName: 'Rohan Gupta',
    userPic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
    rating: 5,
    comment: 'Best hostel in North Campus. Security is solid with biometrics. Very cool guys living here and standard food quality is delicious.',
    date: '14 May 2026',
    verified: true
  },
  {
    id: 'rev-4',
    propertyId: 'prop-3',
    userName: 'Priya Patel',
    userPic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
    rating: 4,
    comment: 'Spacious apartment and value for money in Hinjewadi. Good for IT professionals. Only thing is food is not included, but kitchen is fully accessible.',
    date: '02 June 2026',
    verified: true
  }
];

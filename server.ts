/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_PROPERTIES, INITIAL_REVIEWS } from './src/mockData.js';
import { Property, Booking, PaymentRecord, ChatMessage, VerificationRequest, Review } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent JSON file path inside the workspace
const DB_FILE = path.join(process.cwd(), 'staymate_db.json');

// Interface for server database
interface DB {
  properties: Property[];
  bookings: Booking[];
  payments: PaymentRecord[];
  chats: ChatMessage[];
  kycRequests: VerificationRequest[];
  reviews: Review[];
}

// Initial default DB state
const defaultDB: DB = {
  properties: INITIAL_PROPERTIES,
  bookings: [
    {
      id: 'book-1',
      propertyId: 'prop-1',
      propertyName: 'Zolo Stay Elite PG',
      propertyImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      userEmail: 'suryakant11th@gmail.com',
      userName: 'Suryakant Sharma',
      userPhone: '+91 95550 11223',
      checkInDate: '2026-07-01',
      sharingOption: 'Double',
      status: 'Confirmed',
      amountPaid: 8500,
      paymentId: 'pay_rzp_mock48291',
      createdAt: new Date().toISOString()
    }
  ],
  payments: [
    {
      id: 'pay-1',
      bookingId: 'book-1',
      userName: 'Suryakant Sharma',
      propertyName: 'Zolo Stay Elite PG',
      amount: 8500,
      status: 'Success',
      paymentMethod: 'UPI',
      transactionId: 'pay_rzp_mock48291',
      timestamp: new Date().toISOString()
    }
  ],
  chats: [
    {
      id: 'chat-1',
      sender: 'AI',
      receiver: 'suryakant11th@gmail.com',
      message: 'Hello Suryakant! Welcome to StayMate. I am your AI Stay Assistant. You can ask me to find PGs, hostels, or apartments matching your budget and preferences across India!',
      timestamp: new Date().toISOString()
    }
  ],
  kycRequests: [
    {
      id: 'kyc-1',
      ownerId: 'owner-anil',
      ownerName: 'Anil Kumar',
      ownerEmail: 'anil.staymate@gmail.com',
      documentType: 'Aadhaar',
      documentNumber: '5566-7788-9900',
      status: 'Approved',
      timestamp: new Date().toISOString()
    }
  ],
  reviews: INITIAL_REVIEWS
};

// Help helper to read database safely
function loadDB(): DB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error loading DB file, resetting default data:', error);
  }
  // If not exists or error, save and return default
  saveDB(defaultDB);
  return defaultDB;
}

// Helper to save database safely
function saveDB(data: DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save staymate_db.json:', error);
  }
}

// Initialize active database in progress
let dbStore = loadDB();

// LAZY Initialization of Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log('Gemini AI successfully initialized for StayMate');
    } else {
      console.warn('GEMINI_API_KEY is not set or placeholder. Falling back to rule-based fallback suggestions.');
    }
  }
  return aiClient;
}

// API Routes

// 1. Properties
app.get('/api/properties', (req, res) => {
  res.json(dbStore.properties);
});

app.post('/api/properties', (req, res) => {
  const newProp: Property = {
    id: `prop-${Date.now()}`,
    ...req.body,
    rating: 5.0,
    reviewsCount: 0
  };
  dbStore.properties.push(newProp);
  saveDB(dbStore);
  res.status(201).json(newProp);
});

app.put('/api/properties/:id', (req, res) => {
  const { id } = req.params;
  const index = dbStore.properties.findIndex(p => p.id === id);
  if (index !== -1) {
    dbStore.properties[index] = { ...dbStore.properties[index], ...req.body };
    saveDB(dbStore);
    res.json(dbStore.properties[index]);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

// 2. Bookings
app.get('/api/bookings', (req, res) => {
  const { email } = req.query;
  if (email) {
    const userBookings = dbStore.bookings.filter(b => b.userEmail === email);
    return res.json(userBookings);
  }
  res.json(dbStore.bookings);
});

app.post('/api/bookings', (req, res) => {
  const { propertyId, propertyName, propertyImage, userEmail, userName, userPhone, checkInDate, sharingOption, amountPaid } = req.body;
  const newBooking: Booking = {
    id: `book-${Date.now()}`,
    propertyId,
    propertyName,
    propertyImage,
    userEmail,
    userName,
    userPhone,
    checkInDate,
    sharingOption,
    status: 'Pending',
    amountPaid,
    createdAt: new Date().toISOString()
  };
  dbStore.bookings.push(newBooking);
  saveDB(dbStore);
  res.status(201).json(newBooking);
});

app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status, paymentId } = req.body;
  const index = dbStore.bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    dbStore.bookings[index].status = status;
    if (paymentId) {
      dbStore.bookings[index].paymentId = paymentId;
    }
    saveDB(dbStore);
    res.json(dbStore.bookings[index]);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// 3. Payments
app.get('/api/payments', (req, res) => {
  res.json(dbStore.payments);
});

app.post('/api/payments', (req, res) => {
  const { bookingId, userName, propertyName, amount, paymentMethod, transactionId } = req.body;
  
  // Create payment record
  const newPayment: PaymentRecord = {
    id: `pay-${Date.now()}`,
    bookingId,
    userName,
    propertyName,
    amount,
    status: 'Success',
    paymentMethod,
    transactionId,
    timestamp: new Date().toISOString()
  };
  dbStore.payments.push(newPayment);

  // Update corresponding booking status to Confirmed
  const bookingIndex = dbStore.bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    dbStore.bookings[bookingIndex].status = 'Confirmed';
    dbStore.bookings[bookingIndex].paymentId = transactionId;
    dbStore.bookings[bookingIndex].invoiceUrl = `/api/bookings/${bookingId}/invoice`;
  }

  saveDB(dbStore);
  res.status(201).json(newPayment);
});

// Mock Invoice Download PDF/HTML Representation
app.get('/api/bookings/:id/invoice', (req, res) => {
  const { id } = req.params;
  const booking = dbStore.bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).send('Invoice not found');
  }

  const html = `
    <html>
      <head>
        <title>StayMate Invoice - ${booking.id}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #333; }
          .header { border-bottom: 2px solid #5a67d8; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #5a67d8; }
          .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th, .table td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
          .table th { background-color: #f7fafc; }
          .total { font-weight: bold; font-size: 18px; text-align: right; }
          .footer { font-size: 11px; text-align: center; color: #718096; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">StayMate Accommodation Services</div>
          <div>Booking Invoice ID: ${booking.id}</div>
        </div>
        <div class="details">
          <div>
            <h3>From:</h3>
            <strong>StayMate HQ India</strong><br/>
            E-19, Koramangala Sector 4<br/>
            Bangalore, Karnataka, 560034<br/>
            Email: invoices@staymate.in
          </div>
          <div>
            <h3>To:</h3>
            <strong>${booking.userName}</strong><br/>
            Email: ${booking.userEmail}<br/>
            Phone: ${booking.userPhone}<br/>
            Date Issued: ${new Date(booking.createdAt).toLocaleDateString()}
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Accommodation Details</th>
              <th>Sharing Option</th>
              <th>Check-in Date</th>
              <th>Rent (Advance Deposit)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${booking.propertyName}</strong></td>
              <td>${booking.sharingOption}</td>
              <td>${booking.checkInDate}</td>
              <td>INR ${booking.amountPaid.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <div class="total">Total Paid Amount: INR ${booking.amountPaid.toLocaleString()}</div>
        <div style="margin-top: 20px; color: green; font-weight: bold;">✓ Securely Settled via Razorpay (UPI/Card ID: ${booking.paymentId})</div>
        <div class="footer">
          Thank you for choosing StayMate! For queries or cancellations, contact our support team or WhatsApp the property owner directly.
        </div>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// 4. KYC Requests
app.get('/api/kyc', (req, res) => {
  res.json(dbStore.kycRequests);
});

app.post('/api/kyc', (req, res) => {
  const { ownerId, ownerName, ownerEmail, documentType, documentNumber } = req.body;
  const newRequest: VerificationRequest = {
    id: `kyc-${Date.now()}`,
    ownerId,
    ownerName,
    ownerEmail,
    documentType,
    documentNumber,
    status: 'Pending',
    timestamp: new Date().toISOString()
  };
  dbStore.kycRequests.push(newRequest);
  saveDB(dbStore);
  res.status(201).json(newRequest);
});

app.put('/api/kyc/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = dbStore.kycRequests.findIndex(k => k.id === id);
  if (index !== -1) {
    dbStore.kycRequests[index].status = status;
    saveDB(dbStore);
    res.json(dbStore.kycRequests[index]);
  } else {
    res.status(404).json({ error: 'KYC request not found' });
  }
});

// 5. In-App Direct Chat
app.get('/api/chats', (req, res) => {
  const { user } = req.query;
  if (user) {
    const dialogs = dbStore.chats.filter(c => c.sender === user || c.receiver === user);
    return res.json(dialogs);
  }
  res.json(dbStore.chats);
});

app.post('/api/chats', async (req, res) => {
  const { sender, receiver, message } = req.body;
  const newMsg: ChatMessage = {
    id: `chat-${Date.now()}`,
    sender,
    receiver,
    message,
    timestamp: new Date().toISOString()
  };
  dbStore.chats.push(newMsg);
  saveDB(dbStore);

  // Auto AI replies if receiver is "AI"
  if (receiver === 'AI') {
    const aiResponseId = `chat-ai-${Date.now()}`;
    let aiResponseMsg = 'I am currently processing your accommodation search...';

    const ai = getGeminiClient();
    if (ai) {
      try {
        const queryPrompt = `
          You are the friendly AI Accommodation Expert on "StayMate" app. 
          The user says: "${message}". 
          
          Here are some of our outstanding active properties registered in the system:
          ${JSON.stringify(dbStore.properties.map(p => ({
            id: p.id,
            name: p.name,
            type: p.type,
            city: p.city,
            area: p.area,
            price: p.price,
            sharing: p.sharing,
            gender: p.genderEligibility,
            vacancies: p.vacancies
          })))}
          
          Help them find a stay, answer booking questions, security policies, Aadhaar KYC steps, or refund systems. Be polite, concise, and professional. List matching rooms if appropriate. Include pricing in INR. Use friendly formatting.
        `;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: queryPrompt
        });
        
        aiResponseMsg = geminiRes.text || 'I could not process the recommendation. Let me fetch standard listings instead.';
      } catch (e: any) {
        console.error('Gemini error during chat:', e);
        aiResponseMsg = `Hi! I received your message about: "${message}". What an excellent choice! Many properties in that area have premium AC, Wi-Fi, and neat food included. You can check Zolo Stay Elite, Stanza Living Montreal House, or Adarsh Girls Hostel directly on the cards left-side!`;
      }
    } else {
      // Fallback
      aiResponseMsg = `Hi there! Standard rule-based recommendation response for: "${message}". Based on our databases:
      - Zolo Stay Elite (Koramangala, Bangalore): Double sharing, AC, Food included, ₹8,500/mo. Perfect for Christ University.
      - Stanza Living Montreal (Delhi, North Campus): Single AC room, Gourmet food, ₹12,000/mo. Perfect for Hindu or Kirori Mal college.
      - Adarsh Girls Hostel (Powai, Mumbai): Girls-only, safe, clean, ₹9,500/mo. Near IIT Bombay.
      
      You can filter easily using the pricing and AC buttons at the top of the search bar!`;
    }

    const aiMsg: ChatMessage = {
      id: aiResponseId,
      sender: 'AI',
      receiver: sender,
      message: aiResponseMsg,
      timestamp: new Date().toISOString()
    };
    dbStore.chats.push(aiMsg);
    saveDB(dbStore);
  }

  res.status(201).json(newMsg);
});

// 6. AI Recommendations Endpoint (Bespoke Bento recommendations popup/card lists)
app.post('/api/ai/recommend', async (req, res) => {
  const { query, budget, city, type, sharing, gender } = req.body;
  
  const propertiesLog = dbStore.properties.map(p => ({
    id: p.id,
    name: p.name,
    type: p.type,
    city: p.city,
    area: p.area,
    price: p.price,
    genderEligibility: p.genderEligibility,
    sharing: p.sharing,
    ac: p.ac,
    foodIncluded: p.foodIncluded
  }));

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `
        As StayMate's Senior Algorithmic Matchmaker, analyze the user's requirements:
        Query: "${query || 'Any'}"
        City: "${city || 'Any'}"
        Budget Max: "${budget || 'Any'}"
        Stay Type: "${type || 'Any'}"
        Sharing: "${sharing || 'Any'}"
        Gender Pref: "${gender || 'Any'}"

        Registered Properties in StayMate:
        ${JSON.stringify(propertiesLog)}

        Select exactly 1, 2, or 3 property IDs from the list that fit best. Return a JSON array matching the exact schema definition below:
        {
          "recommendations": [
            {
              "propertyId": "id-from-registered-properties",
              "customRecommendationReason": "Bespoke reason why this fits their specific query and location"
            }
          ],
          "aiGeneralAdvice": "Short professional market summary of rentals in that city/area."
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    propertyId: { type: Type.STRING },
                    customRecommendationReason: { type: Type.STRING }
                  },
                  required: ['propertyId', 'customRecommendationReason']
                }
              },
              aiGeneralAdvice: { type: Type.STRING }
            },
            required: ['recommendations', 'aiGeneralAdvice']
          }
        }
      });

      const parsed = JSON.parse(response.text.trim());
      res.json(parsed);
    } catch (e: any) {
      console.error('Gemini recommending error:', e);
      // Fallback
      res.json(generateRulesFallback(budget, city, type));
    }
  } else {
    // Return custom rule-based dynamic matches if API Key doesn't exist
    res.json(generateRulesFallback(budget, city, type));
  }
});

// Fallback algorithm
function generateRulesFallback(budget?: number, city?: string, type?: string) {
  const matches = dbStore.properties.filter(p => {
    if (city && p.city.toLowerCase() !== city.toLowerCase()) return false;
    if (budget && p.price > budget) return false;
    if (type && p.type !== type) return false;
    return true;
  });

  const recommendations = matches.slice(0, 2).map(p => ({
    propertyId: p.id,
    customRecommendationReason: `Highly popular staying standard in ${p.area} ${p.city} styled for premium living. Budget matches perfectly, offering ${p.sharing} sharing with AC and daily wifi.`
  }));

  return {
    recommendations: recommendations.length > 0 ? recommendations : [
      {
        propertyId: 'prop-1',
        customRecommendationReason: 'Our top elite rating stay in Bangalore with co-living arrangements and high-speed Wi-Fi, which matches standard student priorities.'
      }
    ],
    aiGeneralAdvice: `Accommodations in popular student centers such as Koramangala or North Campus Delhi range from ₹8,000 to ₹15,000 depending on food inclusions and dual sharing AC layouts. StayMate recommends booking at least 3 weeks prior to academic start dates.`
  };
}

// 7. Reviews and Ratings
app.get('/api/reviews', (req, res) => {
  res.json(dbStore.reviews);
});

app.post('/api/reviews', (req, res) => {
  const { propertyId, userName, rating, comment } = req.body;
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    propertyId,
    userName,
    userPic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    rating,
    comment,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    verified: true
  };
  dbStore.reviews.push(newReview);

  // Recalculate property ratings average
  const propertyIndex = dbStore.properties.findIndex(p => p.id === propertyId);
  if (propertyIndex !== -1) {
    const propReviews = dbStore.reviews.filter(r => r.propertyId === propertyId);
    const sum = propReviews.reduce((acc, r) => acc + r.rating, 0);
    dbStore.properties[propertyIndex].rating = Number((sum / propReviews.length).toFixed(1));
    dbStore.properties[propertyIndex].reviewsCount = propReviews.length;
  }

  saveDB(dbStore);
  res.status(201).json(newReview);
});

// Setup Vite Dev Server / Static Asset Compilation
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted successfully');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StayMate full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();

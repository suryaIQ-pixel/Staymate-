import { 
  collection, doc, setDoc, addDoc, getDocs, 
  query, limit 
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Strictly catch and throw errors in the JSON format mandated by guidelines
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('[StayMate Firestore Sync Failure] Info: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auto-authenticate anonymously to make sure rules like isSignedIn() are satisfied
export async function ensureFirebaseAuth(): Promise<string | null> {
  try {
    if (!auth.currentUser) {
      const credential = await signInAnonymously(auth);
      console.log("Firebase Authenticated securely as anonymous user UID:", credential.user.uid);
      return credential.user.uid;
    }
    return auth.currentUser.uid;
  } catch (error) {
    console.warn("Firebase Auth fallback/warning:", error);
    return null;
  }
}

// Write Property to Live Firestore
export async function addFirestoreProperty(propertyData: any) {
  const path = 'properties';
  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, path, propertyData.id);
    await setDoc(docRef, propertyData);
    console.log("Property successfully synchronized with live Firestore document:", propertyData.id);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${propertyData.id}`);
  }
}

// Save Booking to Live Firestore
export async function addFirestoreBooking(bookingData: any) {
  const path = 'bookings';
  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, path, bookingData.id);
    await setDoc(docRef, bookingData);
    console.log("Booking successfully synchronized with live Firestore document:", bookingData.id);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${bookingData.id}`);
  }
}

// Save Review to Live Firestore
export async function addFirestoreReview(reviewId: string, reviewData: any) {
  const path = 'reviews';
  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, path, reviewId);
    await setDoc(docRef, { ...reviewData, id: reviewId });
    console.log("Review successfully synchronized with live firestore standard reviews.");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${reviewId}`);
  }
}

// Save ChatMessage to Live Firestore
export async function addFirestoreChatMessage(chatId: string, messageData: any) {
  const path = 'chats';
  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, path, chatId);
    await setDoc(docRef, { ...messageData, id: chatId });
    console.log("Chat text session synchronized with your live Firebase instance.");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${chatId}`);
  }
}

// Save KYC Validation Request to Live Firestore
export async function addFirestoreKYCRequest(kycId: string, kycData: any) {
  const path = 'kycRequests';
  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, path, kycId);
    await setDoc(docRef, { ...kycData, id: kycId });
    console.log("KYC Aadhaar token serialized to live Firestore reference:", kycId);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${kycId}`);
  }
}

// Save Payment Record to Live Firestore
export async function addFirestorePayment(paymentId: string, paymentData: any) {
  const path = 'payments';
  try {
    await ensureFirebaseAuth();
    const docRef = doc(db, path, paymentId);
    await setDoc(docRef, { ...paymentData, id: paymentId });
    console.log("UPI Razorpay deposit payment synchronized:", paymentId);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${paymentId}`);
  }
}

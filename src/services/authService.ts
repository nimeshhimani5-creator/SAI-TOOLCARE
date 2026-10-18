import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { UserProfile, UserRole } from '../types';

const LOCAL_AUTH_KEY = 'toolcare_current_user';
const authChannel = typeof window !== 'undefined' ? new BroadcastChannel('toolcare_auth_bus') : null;

// Demo accounts for fast testing
export const DEMO_ACCOUNTS = [
  {
    role: 'owner' as UserRole,
    name: 'Himani (Owner & Founder)',
    email: 'himani.owner@saitoolcare.com',
    password: 'password123',
    badge: 'Owner Access'
  },
  {
    role: 'technician' as UserRole,
    name: 'Sachin Patil (Senior Tech)',
    email: 'technician@saitoolcare.com',
    password: 'password123',
    badge: 'Technician Access'
  },
  {
    role: 'customer' as UserRole,
    name: 'Ramesh Contractor',
    email: 'ramesh@patilconstructions.com',
    password: 'password123',
    badge: 'Customer Account'
  }
];

export const authService = {
  // Listen for authentication changes in real-time
  onAuthStateChanged(callback: (user: UserProfile | null) => void) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (!firebaseUser) {
          callback(null);
          return;
        }

        // Fetch user profile from Firestore users collection
        let role: UserRole = 'customer';
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              role = userDoc.data().role || 'customer';
            }
          } catch (e) {
            console.warn('Could not read user role from Firestore, defaulting to customer.', e);
          }
        }

        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Customer',
          role
        };
        callback(profile);
      });
    }

    // Local persistent mode
    const loadCurrent = () => {
      const stored = localStorage.getItem(LOCAL_AUTH_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as UserProfile;
        } catch {
          return null;
        }
      }
      return null;
    };

    callback(loadCurrent());

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'AUTH_CHANGE') {
        callback(loadCurrent());
      }
    };

    authChannel?.addEventListener('message', handleMessage);
    return () => {
      authChannel?.removeEventListener('message', handleMessage);
    };
  },

  // Sign In with email & password
  async signIn(email: string, pass: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      let role: UserRole = 'customer';
      if (db) {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        if (userDoc.exists()) {
          role = userDoc.data().role || 'customer';
        }
      }
      return {
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || 'Customer',
        role
      };
    }

    // Local simulation: check demo accounts or match email
    const demo = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
    const role: UserRole = demo ? demo.role : (email.includes('owner') ? 'owner' : email.includes('tech') ? 'technician' : 'customer');
    const profile: UserProfile = {
      uid: `local-${Date.now()}`,
      email,
      displayName: demo ? demo.name : email.split('@')[0],
      role
    };

    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(profile));
    authChannel?.postMessage({ type: 'AUTH_CHANGE' });
    return profile;
  },

  // Register customer account
  async register(email: string, pass: string, displayName: string, phone: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName });
      
      const role: UserRole = 'customer';
      if (db) {
        await setDoc(doc(db, 'users', cred.user.uid), {
          displayName,
          email,
          phone,
          role,
          createdAt: new Date().toISOString()
        });
      }

      return {
        uid: cred.user.uid,
        email,
        displayName,
        phone,
        role
      };
    }

    // Local simulation
    const profile: UserProfile = {
      uid: `local-${Date.now()}`,
      email,
      displayName,
      phone,
      role: 'customer'
    };

    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(profile));
    authChannel?.postMessage({ type: 'AUTH_CHANGE' });
    return profile;
  },

  // Quick Sign In with staff demo account
  async signInAsStaff(role: UserRole): Promise<UserProfile> {
    const demo = DEMO_ACCOUNTS.find(a => a.role === role) || DEMO_ACCOUNTS[0];
    return await this.signIn(demo.email, demo.password);
  },

  // Sign Out
  async signOut(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
      return;
    }

    localStorage.removeItem(LOCAL_AUTH_KEY);
    authChannel?.postMessage({ type: 'AUTH_CHANGE' });
  }
};

import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';

const LOCAL_PRODUCTS_KEY = 'toolcare_products_v3';
const productsChannel = typeof window !== 'undefined' ? new BroadcastChannel('toolcare_products_bus') : null;

export const productsService = {
  // Subscribe to real-time products updates
  subscribeToProducts(callback: (products: Product[]) => void) {
    if (isFirebaseConfigured && db) {
      const colRef = collection(db, 'products');

      // Check if collection is empty and seed if needed
      getDocs(colRef).then((snapshot) => {
        if (snapshot.empty) {
          console.log('[ToolCare Cloud] Seeding initial inventory to Firestore...');
          const batch = writeBatch(db!);
          MOCK_PRODUCTS.forEach((prod) => {
            const docRef = doc(db!, 'products', prod.id);
            batch.set(docRef, prod);
          });
          batch.commit();
        }
      });

      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Product);
          });
          callback(list);
        } else {
          callback(MOCK_PRODUCTS);
        }
      }, (err) => {
        console.warn('Firestore snapshot error, falling back to local list:', err);
        callback(MOCK_PRODUCTS);
      });
    }

    // Local reactive storage mode with intelligent migration & price preservation
    const loadProducts = (): Product[] => {
      // Check v3 key first, then fallback to v2 or v1 to preserve any user-saved prices
      let stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      if (!stored) {
        const prevStored = localStorage.getItem('toolcare_products_v2') || localStorage.getItem('toolcare_products_v1');
        if (prevStored) {
          stored = prevStored;
        }
      }

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Build map of custom prices & stock adjustments made by owner
            const customMap = new Map<string, Partial<Product>>();
            parsed.forEach((p: Product) => {
              if (p && p.id) {
                customMap.set(p.id, {
                  price: p.price,
                  originalPrice: p.originalPrice,
                  stockCount: p.stockCount,
                  inStock: p.inStock
                });
              }
            });

            // Map all official MOCK_PRODUCTS, applying custom prices if set
            const merged = MOCK_PRODUCTS.map((prod) => {
              const custom = customMap.get(prod.id);
              if (custom) {
                return {
                  ...prod,
                  price: custom.price ?? prod.price,
                  originalPrice: custom.originalPrice ?? prod.originalPrice,
                  stockCount: custom.stockCount ?? prod.stockCount,
                  inStock: (custom.stockCount ?? prod.stockCount) > 0,
                  imageUrl: prod.imageUrl
                };
              }
              return prod;
            });

            // Store back to ensure full catalog is saved in v3
            localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(merged));
            return merged;
          }
        } catch {
          // If parse error, fallback to MOCK_PRODUCTS
        }
      }
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS));
      return MOCK_PRODUCTS;
    };

    callback(loadProducts());

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PRODUCTS_CHANGE') {
        callback(loadProducts());
      }
    };

    productsChannel?.addEventListener('message', handleMessage);
    return () => {
      productsChannel?.removeEventListener('message', handleMessage);
    };
  },

  // Decrement inventory stock on counter reservation
  async decrementStock(productId: string, quantity: number): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const prodRef = doc(db, 'products', productId);
        await updateDoc(prodRef, {
          stockCount: increment(-quantity)
        });
        return;
      } catch (err) {
        console.warn('Failed to update Firestore stock, updating locally:', err);
      }
    }

    // Local storage update
    const current = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    const list: Product[] = current ? JSON.parse(current) : [...MOCK_PRODUCTS];
    const updated = list.map((p) => {
      if (p.id === productId) {
        const newCount = Math.max(0, p.stockCount - quantity);
        return {
          ...p,
          stockCount: newCount,
          inStock: newCount > 0
        };
      }
      return p;
    });

    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    productsChannel?.postMessage({ type: 'PRODUCTS_CHANGE' });
  },

  // Increment stock (used when reservation is cancelled or expired)
  async incrementStock(productId: string, quantity: number): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const prodRef = doc(db, 'products', productId);
        await updateDoc(prodRef, {
          stockCount: increment(quantity),
          inStock: true
        });
        return;
      } catch (err) {
        console.warn('Failed to increment Firestore stock, updating locally:', err);
      }
    }

    const current = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    const list: Product[] = current ? JSON.parse(current) : [...MOCK_PRODUCTS];
    const updated = list.map((p) => {
      if (p.id === productId) {
        const newCount = p.stockCount + quantity;
        return {
          ...p,
          stockCount: newCount,
          inStock: newCount > 0
        };
      }
      return p;
    });

    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    productsChannel?.postMessage({ type: 'PRODUCTS_CHANGE' });
  },

  // Explicitly set stock count and optional price (for owner inventory management)
  async updateProductInventory(productId: string, newStock: number, newPrice?: number): Promise<void> {
    const updates: any = {
      stockCount: Math.max(0, newStock),
      inStock: newStock > 0
    };
    if (newPrice !== undefined && newPrice > 0) {
      updates.price = newPrice;
    }

    if (isFirebaseConfigured && db) {
      try {
        const prodRef = doc(db, 'products', productId);
        await updateDoc(prodRef, updates);
        return;
      } catch (err) {
        console.warn('Failed to update Firestore product, updating locally:', err);
      }
    }

    const current = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    const list: Product[] = current ? JSON.parse(current) : [...MOCK_PRODUCTS];
    const updated = list.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          ...updates
        };
      }
      return p;
    });

    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    productsChannel?.postMessage({ type: 'PRODUCTS_CHANGE' });
  }
};


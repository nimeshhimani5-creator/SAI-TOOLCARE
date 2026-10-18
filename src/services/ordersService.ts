import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { CounterOrder, CounterPaymentMethod } from '../types';
import { productsService } from './productsService';
import { SAMPLE_ORDERS } from '../data/mockData';

const LOCAL_ORDERS_KEY = 'toolcare_orders_v1';
const ordersChannel = typeof window !== 'undefined' ? new BroadcastChannel('toolcare_orders_bus') : null;

export const ordersService = {
  /**
   * Subscribe to real-time counter reservations
   */
  subscribeToOrders(callback: (orders: CounterOrder[]) => void) {
    if (isFirebaseConfigured && db) {
      const colRef = collection(db, 'orders');

      // Seed initial sample reservations if collection is empty
      getDocs(colRef).then((snapshot) => {
        if (snapshot.empty) {
          console.log('[ToolCare Cloud] Seeding initial sample orders to Firestore...');
          SAMPLE_ORDERS.forEach((order) => {
            setDoc(doc(db!, 'orders', order.orderRef), order);
          });
        }
      });

      return onSnapshot(colRef, (snapshot) => {
        const list: CounterOrder[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as CounterOrder);
        });
        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(list.length > 0 ? list : SAMPLE_ORDERS);
      }, (err) => {
        console.warn('Firestore orders subscription error, fallback to local:', err);
        callback(this.loadLocalOrders());
      });
    }

    // Local reactive storage mode
    const initialList = this.loadLocalOrders();
    callback(initialList);

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'ORDERS_CHANGE') {
        callback(this.loadLocalOrders());
      }
    };

    ordersChannel?.addEventListener('message', handleMessage);
    return () => {
      ordersChannel?.removeEventListener('message', handleMessage);
    };
  },

  loadLocalOrders(): CounterOrder[] {
    const current = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (current) {
      try {
        const parsed = JSON.parse(current);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallback to SAMPLE_ORDERS
      }
    }
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(SAMPLE_ORDERS));
    return SAMPLE_ORDERS;
  },

  /**
   * Create a new reservation order with 48h pickup window
   */
  async createReservationOrder(order: CounterOrder): Promise<void> {
    // 1. Decrement inventory stock in real-time
    for (const item of order.items) {
      await productsService.decrementStock(item.product.id, item.quantity);
    }

    // Calculate 48-hour expiration
    const createdAt = new Date(order.createdAt);
    const expiresAt = new Date(createdAt.getTime() + 48 * 60 * 60 * 1000).toISOString();
    const orderWithExpiry: CounterOrder = {
      ...order,
      expiresAt
    };

    // 2. Save order to Firestore or local storage
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', orderWithExpiry.orderRef), orderWithExpiry);
        return;
      } catch (err) {
        console.warn('Firestore failed to save order, saving locally:', err);
      }
    }

    const list = this.loadLocalOrders();
    list.unshift(orderWithExpiry);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(list));
    ordersChannel?.postMessage({ type: 'ORDERS_CHANGE' });
  },

  /**
   * Mark an order as collected and settled at the shop counter
   * Offline settlement: Cash or Shop UPI QR upon inspection
   */
  async markOrderCollected(
    orderRef: string, 
    paymentMethod: CounterPaymentMethod, 
    staffName: string
  ): Promise<void> {
    const collectedAt = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', orderRef), {
          status: 'collected',
          collectedAt,
          collectedBy: staffName,
          paymentMethod
        });
        return;
      } catch (err) {
        console.warn('Firestore failed to update order, updating locally:', err);
      }
    }

    const list = this.loadLocalOrders();
    const idx = list.findIndex((o) => o.orderRef === orderRef);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status: 'collected',
        collectedAt,
        collectedBy: staffName,
        paymentMethod
      };
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(list));
      ordersChannel?.postMessage({ type: 'ORDERS_CHANGE' });
    }
  },

  /**
   * Cancel an order and safely restore stock to inventory
   */
  async cancelOrder(orderRef: string, reason = 'Cancelled by staff/customer'): Promise<void> {
    const cancelledAt = new Date().toISOString();

    // 1. Find items to restore stock
    let targetOrder: CounterOrder | undefined;
    if (isFirebaseConfigured && db) {
      // In Firestore mode
      try {
        await updateDoc(doc(db, 'orders', orderRef), {
          status: 'cancelled',
          cancelledAt,
          cancelledReason: reason
        });
      } catch (err) {
        console.warn('Firestore failed to cancel order:', err);
      }
    }

    const list = this.loadLocalOrders();
    const idx = list.findIndex((o) => o.orderRef === orderRef);
    if (idx !== -1) {
      targetOrder = list[idx];
      list[idx] = {
        ...list[idx],
        status: 'cancelled',
        cancelledAt,
        cancelledReason: reason
      };
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(list));
      ordersChannel?.postMessage({ type: 'ORDERS_CHANGE' });
    }

    // 2. Restore stock
    if (targetOrder && Array.isArray(targetOrder.items)) {
      for (const item of targetOrder.items) {
        await productsService.incrementStock(item.product.id, item.quantity);
      }
    }
  },

  /**
   * Check and auto-expire pending reservations older than 48 hours
   * Restores inventory quantities
   */
  async checkAndExpireOldOrders(): Promise<number> {
    const now = Date.now();
    const list = this.loadLocalOrders();
    let expiredCount = 0;

    for (const order of list) {
      if (order.status === 'pending_collection') {
        const createdTime = new Date(order.createdAt).getTime();
        const diffHours = (now - createdTime) / (1000 * 60 * 60);

        if (diffHours >= 48) {
          await this.cancelOrder(order.orderRef, 'Expired: 48-Hour pickup window elapsed');
          expiredCount++;
        }
      }
    }

    return expiredCount;
  }
};

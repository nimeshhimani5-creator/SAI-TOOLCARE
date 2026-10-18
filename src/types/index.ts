export type ProductCategory = 'all' | 'power-tools' | 'spare-parts' | 'accessories';

export interface Product {
  id: string;
  name: string;
  brand: string;
  modelNumber: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  description: string;
  specifications: { [key: string]: string };
  badge?: string;
  imageIcon: string;
  imageUrl?: string;
  brandColor?: string;
  compatibility?: string;
}


export type RepairStatus = 
  | 'requested'
  | 'received_at_shop'
  | 'inspection'
  | 'awaiting_customer_approval'
  | 'approved'
  | 'in_progress'
  | 'ready_for_collection'
  | 'completed';

export interface RepairTimelineEvent {
  status: RepairStatus;
  label: string;
  timestamp: string;
  completed: boolean;
  notes?: string;
}

export interface RepairJob {
  referenceId: string;
  customerName: string;
  phone: string;
  toolType: string;
  brandModel: string;
  issueDescription: string;
  status: RepairStatus;
  statusLabel: string;
  submittedAt: string;
  estimatedCost?: number;
  technicianName?: string;
  imageUrl?: string;
  timeline: RepairTimelineEvent[];
  diagnosticFindings?: string;
  partsNeeded?: string[];
  completedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

/* User & Authentication Types */
export type UserRole = 'customer' | 'technician' | 'owner';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
}

/* Counter Reservation Order Types */
export type OrderStatus = 'pending_collection' | 'collected' | 'cancelled';
export type CounterPaymentMethod = 'cash' | 'upi_counter';

export interface CounterOrder {
  orderRef: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  phone: string;
  status: OrderStatus;
  createdAt: string;
  expiresAt?: string;
  collectedAt?: string;
  collectedBy?: string;
  paymentMethod?: CounterPaymentMethod;
  cancelledAt?: string;
  cancelledReason?: string;
}

/* Billing & Invoice Types */
export interface InvoiceItem {
  id?: string;
  description: string;
  brand?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderRef?: string;
  ticketId?: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number; // e.g. 18 for 18% GST, or 0
  taxAmount?: number;
  discount?: number;
  totalAmount: number;
  paymentMethod: string; // 'Cash on Counter' | 'UPI Counter' | 'Due at Collection'
  paymentStatus: 'PAID' | 'DUE' | 'RESERVED';
  billType: 'retail' | 'repair' | 'pos_quick';
  technicianName?: string;
  notes?: string;
}


import { ordersService } from './ordersService';
import { repairsService } from './repairsService';
import { productsService } from './productsService';
import { CounterOrder, CounterPaymentMethod, Product, RepairJob, RepairStatus } from '../types';

export interface WorkshopMetrics {
  totalRevenueCollected: number;
  pendingOrdersCount: number;
  pendingOrdersValue: number;
  activeRepairsCount: number;
  completedRepairsCount: number;
  lowStockItemsCount: number;
}

export const adminBackendService = {
  // Subscribe to all orders
  subscribeToOrders(callback: (orders: CounterOrder[]) => void) {
    return ordersService.subscribeToOrders(callback);
  },

  // Subscribe to all repair tickets
  subscribeToRepairs(callback: (repairs: { [key: string]: RepairJob }) => void) {
    return repairsService.subscribeToRepairs(callback);
  },

  // Subscribe to all products
  subscribeToProducts(callback: (products: Product[]) => void) {
    return productsService.subscribeToProducts(callback);
  },

  // Settle and mark counter order collected
  async settleCounterOrder(
    orderRef: string, 
    paymentMethod: CounterPaymentMethod, 
    staffName: string
  ): Promise<void> {
    await ordersService.markOrderCollected(orderRef, paymentMethod, staffName);
  },

  // Cancel order and restore stock
  async cancelReservation(orderRef: string, reason?: string): Promise<void> {
    await ordersService.cancelOrder(orderRef, reason);
  },

  // Auto-expire 48h old reservations
  async runExpirySweep(): Promise<number> {
    return await ordersService.checkAndExpireOldOrders();
  },

  // Assign technician to repair job
  async assignTechnicianToJob(referenceId: string, technicianName: string): Promise<void> {
    await repairsService.assignTechnician(referenceId, technicianName);
  },

  // Submit diagnostic findings and estimate
  async submitDiagnosticFindings(
    referenceId: string,
    diagnosticFindings: string,
    estimatedCost: number,
    partsNeeded?: string[]
  ): Promise<void> {
    await repairsService.submitDiagnosticEstimate(
      referenceId,
      diagnosticFindings,
      estimatedCost,
      partsNeeded
    );
  },

  // Advance or change repair job status
  async advanceRepairStatus(
    referenceId: string,
    newStatus: RepairStatus,
    notes?: string,
    technicianName?: string
  ): Promise<void> {
    await repairsService.updateRepairStatus(referenceId, newStatus, notes, technicianName);
  },

  // Update product inventory stock or price
  async updateInventory(productId: string, newStock: number, newPrice?: number): Promise<void> {
    await productsService.updateProductInventory(productId, newStock, newPrice);
  },

  // Calculate live workshop operational metrics
  calculateMetrics(
    orders: CounterOrder[], 
    repairs: { [key: string]: RepairJob }, 
    products: Product[]
  ): WorkshopMetrics {
    const totalRevenueCollected = orders
      .filter((o) => o.status === 'collected')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending_collection');
    const pendingOrdersCount = pendingOrders.length;
    const pendingOrdersValue = pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const repairList = Object.values(repairs);
    const activeRepairsCount = repairList.filter((r) => r.status !== 'completed').length;
    const completedRepairsCount = repairList.filter((r) => r.status === 'completed').length;

    const lowStockItemsCount = products.filter((p) => p.stockCount <= 5).length;

    return {
      totalRevenueCollected,
      pendingOrdersCount,
      pendingOrdersValue,
      activeRepairsCount,
      completedRepairsCount,
      lowStockItemsCount
    };
  }
};

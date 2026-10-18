import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Wrench, 
  Package, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  UserCheck, 
  ChevronRight, 
  Phone, 
  DollarSign, 
  QrCode, 
  ShieldAlert, 
  Plus, 
  Minus, 
  Edit3,
  X,
  Printer,
  Share2,
  FileText
} from 'lucide-react';
import { CounterOrder, CounterPaymentMethod, Product, RepairJob, RepairStatus, UserProfile, InvoiceData } from '../types';
import { adminBackendService } from '../services/adminBackendService';
import { whatsappService } from '../utils/whatsapp';
import { CounterUpiModal } from './CounterUpiModal';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  orders: CounterOrder[];
  repairs: { [key: string]: RepairJob };
  products: Product[];
  onShowToast: (msg: string) => void;
  onOpenInvoice?: (invoice?: InvoiceData, mode?: 'view' | 'create') => void;
}

const TECHNICIANS = [
  'Ramesh Sharma (Sr. Motor Technician)',
  'Suresh Patil (Rotary Tool Specialist)',
  'Dinesh Raut (Pneumatic & Demolition Tech)'
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  repairs,
  products,
  onShowToast,
  onOpenInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'repairs' | 'inventory'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending_collection' | 'collected' | 'cancelled'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  
  const [repairFilter, setRepairFilter] = useState<string>('all');
  const [repairSearch, setRepairSearch] = useState('');

  const [productSearch, setProductSearch] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Expiry sweep loading state
  const [isSweeping, setIsSweeping] = useState(false);

  // Counter UPI Modal State
  const [counterUpiModal, setCounterUpiModal] = useState<{
    isOpen: boolean;
    amount: number;
    orderOrTicketRef: string;
    customerName?: string;
  }>({
    isOpen: false,
    amount: 0,
    orderOrTicketRef: ''
  });

  // Compute live workshop metrics
  const metrics = useMemo(() => {
    return adminBackendService.calculateMetrics(orders, repairs, products);
  }, [orders, repairs, products]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
      const q = orderSearch.toLowerCase();
      const matchesSearch = !orderSearch || 
        o.orderRef.toLowerCase().includes(q) || 
        o.customerName.toLowerCase().includes(q) || 
        o.phone.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, orderFilter, orderSearch]);

  // Filtered repairs (with ticket ID, customer name, 10-digit phone number search)
  const filteredRepairs = useMemo(() => {
    const list = Object.values(repairs);
    return list.filter((r) => {
      const matchesFilter = repairFilter === 'all' || r.status === repairFilter;
      const q = repairSearch.toLowerCase().trim();
      const matchesSearch = !repairSearch || 
        r.referenceId.toLowerCase().includes(q) || 
        r.customerName.toLowerCase().includes(q) || 
        r.phone.toLowerCase().includes(q) || 
        r.toolType.toLowerCase().includes(q) || 
        r.brandModel.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [repairs, repairFilter, repairSearch]);

  const handlePrintSlip = (job: RepairJob) => {
    const printWindow = window.open('', '_blank', 'width=750,height=850');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Repair Job Slip - ${job.referenceId} - Om Sai Power Tools</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #111; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 12px; margin-bottom: 16px; }
            .shop-title { font-size: 20px; font-weight: 900; text-transform: uppercase; margin: 0; color: #131921; }
            .shop-sub { font-size: 11px; color: #444; margin-top: 3px; }
            .badge-row { margin: 10px 0; }
            .ticket-badge { display: inline-block; background: #ff9900; color: #111; font-weight: 900; font-size: 16px; padding: 4px 12px; border-radius: 4px; }
            .grid { display: table; width: 100%; margin-top: 14px; border-collapse: collapse; }
            .row { display: table-row; }
            .cell-label { display: table-cell; width: 35%; font-weight: 700; padding: 6px 4px; border-bottom: 1px solid #ddd; font-size: 13px; }
            .cell-val { display: table-cell; padding: 6px 4px; border-bottom: 1px solid #ddd; font-size: 13px; }
            .highlight-box { background: #f8f9fa; border: 1px solid #ccc; border-radius: 6px; padding: 10px; margin: 16px 0; font-size: 12px; }
            .sign-row { display: table; width: 100%; margin-top: 35px; }
            .sign-col { display: table-cell; width: 50%; text-align: center; font-size: 12px; border-top: 1px solid #333; padding-top: 6px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="shop-title">OM SAI POWER TOOLS AND REPAIRING CENTER</h1>
            <p class="shop-sub">Station Road Counter, Opp. ST Bus Depot, Main Market &bull; Mob: +91 80774 66755</p>
            <div class="badge-row">
              <span class="ticket-badge">JOB CARD # ${job.referenceId}</span>
            </div>
            <p style="font-size: 12px; margin: 2px 0;">Received Date: <strong>${job.submittedAt}</strong> &bull; Technician: <strong>${job.technicianName || 'Workshop Staff'}</strong></p>
          </div>

          <div class="grid">
            <div class="row"><div class="cell-label">Customer Name:</div><div class="cell-val"><strong>${job.customerName}</strong></div></div>
            <div class="row"><div class="cell-label">Mobile Number:</div><div class="cell-val"><strong>${job.phone}</strong></div></div>
            <div class="row"><div class="cell-label">Tool & Model:</div><div class="cell-val"><strong>${job.toolType}</strong> &bull; ${job.brandModel}</div></div>
            <div class="row"><div class="cell-label">Issue Reported:</div><div class="cell-val">${job.issueDescription}</div></div>
            <div class="row"><div class="cell-label">Estimated Cost:</div><div class="cell-val"><strong>${job.estimatedCost ? '₹' + job.estimatedCost : 'Inspection Pending'}</strong></div></div>
            <div class="row"><div class="cell-label">Current Status:</div><div class="cell-val">${job.statusLabel}</div></div>
          </div>

          <div class="highlight-box">
            <strong>Shop Counter Terms:</strong><br/>
            1. Present this slip or WhatsApp confirmation when collecting your tool.<br/>
            2. Test machine under full counter load before final payment.<br/>
            3. 100% genuine copper coil rewinding with 30-day testing guarantee.
          </div>

          <div class="sign-row">
            <div class="sign-col" style="padding-right: 15px;">Customer Signature</div>
            <div class="sign-col" style="padding-left: 15px;">Shop In-Charge / Mechanic (Om Sai Power Tools)</div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = productSearch.toLowerCase();
      return !productSearch || 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.modelNumber.toLowerCase().includes(q);
    });
  }, [products, productSearch]);

  if (!isOpen) return null;

  // Settle order handler
  const handleSettleOrder = async (orderRef: string, method: CounterPaymentMethod) => {
    try {
      await adminBackendService.settleCounterOrder(orderRef, method, currentUser.displayName);
      const label = method === 'cash' ? 'Cash at Counter' : 'Shop UPI QR';
      onShowToast(`Order ${orderRef} settled & collected via ${label}!`);
    } catch (err) {
      onShowToast(`Failed to settle order: ${err}`);
    }
  };

  // Cancel order handler
  const handleCancelOrder = async (orderRef: string) => {
    if (window.confirm(`Are you sure you want to cancel ${orderRef}? Reserved stock will be returned to inventory.`)) {
      try {
        await adminBackendService.cancelReservation(orderRef, `Cancelled by owner ${currentUser.displayName}`);
        onShowToast(`Order ${orderRef} cancelled and product inventory restored.`);
      } catch (err) {
        onShowToast(`Failed to cancel order: ${err}`);
      }
    }
  };

  // Manual 48-Hour Expiry Sweep
  const handleRunExpirySweep = async () => {
    setIsSweeping(true);
    try {
      const expiredCount = await adminBackendService.runExpirySweep();
      if (expiredCount > 0) {
        onShowToast(`Sweep complete: ${expiredCount} expired reservations cancelled & stock restored!`);
      } else {
        onShowToast('Sweep complete: All pending reservations are within the 48-hour pickup window.');
      }
    } finally {
      setIsSweeping(false);
    }
  };

  // Assign technician handler
  const handleAssignTechnician = async (repairId: string, techName: string) => {
    try {
      await adminBackendService.assignTechnicianToJob(repairId, techName);
      onShowToast(`Ticket ${repairId} assigned to ${techName}.`);
    } catch (err) {
      onShowToast(`Failed to assign technician: ${err}`);
    }
  };

  // Update repair status handler
  const handleUpdateRepairStatus = async (repairId: string, status: RepairStatus) => {
    try {
      await adminBackendService.advanceRepairStatus(repairId, status, undefined, undefined);
      onShowToast(`Ticket ${repairId} updated to ${status.replace(/_/g, ' ')}.`);
    } catch (err) {
      onShowToast(`Failed to update status: ${err}`);
    }
  };

  // Start editing product
  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setTempStock(p.stockCount);
    setTempPrice(p.price);
  };

  // Save product edit
  const saveProductEdit = async (productId: string) => {
    try {
      await adminBackendService.updateInventory(productId, tempStock, tempPrice);
      setEditingProductId(null);
      onShowToast(`Product stock and price updated successfully!`);
    } catch (err) {
      onShowToast(`Failed to update product: ${err}`);
    }
  };

  // Quick adjust stock
  const quickAdjustStock = async (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    await adminBackendService.updateInventory(productId, newStock);
    onShowToast(`Stock adjusted to ${newStock} units.`);
  };

  return (
    <div className="admin-portal-overlay">
      <div className="admin-portal-modal">
        {/* Header Bar */}
        <div className="admin-modal-header">
          <div className="admin-header-title">
            <div className="admin-badge-icon">
              <ShieldAlert size={22} className="text-amber-500" />
            </div>
            <div>
              <h2>Workshop Owner Management Portal</h2>
              <p className="admin-subtitle">
                Om Sai Power Tools &bull; Station Road &bull; Active Staff: <strong>{currentUser.displayName}</strong> ({currentUser.role})
              </p>
            </div>
          </div>
          <button className="admin-close-btn" onClick={onClose} aria-label="Close Admin Portal">
            <X size={22} />
          </button>
        </div>

        {/* Live Operational Metrics KPIs */}
        <div className="admin-metrics-grid">
          <div className="metric-card metric-revenue">
            <div className="metric-icon-wrap">
              <TrendingUp size={20} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Counter Cash/UPI Revenue</span>
              <span className="metric-value">₹{metrics.totalRevenueCollected.toLocaleString('en-IN')}</span>
              <span className="metric-subtext">Settled at shop counter</span>
            </div>
          </div>

          <div className="metric-card metric-pending">
            <div className="metric-icon-wrap">
              <Clock size={20} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Pending Counter Reservations</span>
              <span className="metric-value">{metrics.pendingOrdersCount}</span>
              <span className="metric-subtext">₹{metrics.pendingOrdersValue.toLocaleString('en-IN')} reserved (48h window)</span>
            </div>
          </div>

          <div className="metric-card metric-repairs">
            <div className="metric-icon-wrap">
              <Wrench size={20} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Active Bench Repairs</span>
              <span className="metric-value">{metrics.activeRepairsCount}</span>
              <span className="metric-subtext">{metrics.completedRepairsCount} collected & closed</span>
            </div>
          </div>

          <div className="metric-card metric-stock">
            <div className="metric-icon-wrap">
              <Package size={20} />
            </div>
            <div className="metric-data">
              <span className="metric-label">Low Stock Warnings</span>
              <span className="metric-value">{metrics.lowStockItemsCount} items</span>
              <span className="metric-subtext">Under 5 units remaining</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tab-nav">
          <button 
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={17} />
            <span>Counter Reservations ({orders.length})</span>
            {metrics.pendingOrdersCount > 0 && (
              <span className="tab-badge-count">{metrics.pendingOrdersCount}</span>
            )}
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'repairs' ? 'active' : ''}`}
            onClick={() => setActiveTab('repairs')}
          >
            <Wrench size={17} />
            <span>Repairs Queue ({Object.keys(repairs).length})</span>
            {metrics.activeRepairsCount > 0 && (
              <span className="tab-badge-count">{metrics.activeRepairsCount}</span>
            )}
          </button>

          <button 
            className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={17} />
            <span>Inventory & Stock ({products.length})</span>
            {metrics.lowStockItemsCount > 0 && (
              <span className="tab-badge-count warning">{metrics.lowStockItemsCount}</span>
            )}
          </button>
        </div>

        {/* TAB 1: COUNTER ORDERS */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="admin-controls-bar">
              <div className="admin-search-box">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search by Order Ref, Customer name, Phone..." 
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <div className="admin-filter-pills">
                <button 
                  className={`filter-pill ${orderFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('all')}
                >
                  All ({orders.length})
                </button>
                <button 
                  className={`filter-pill ${orderFilter === 'pending_collection' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('pending_collection')}
                >
                  Pending Collection ({orders.filter(o => o.status === 'pending_collection').length})
                </button>
                <button 
                  className={`filter-pill ${orderFilter === 'collected' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('collected')}
                >
                  Collected ({orders.filter(o => o.status === 'collected').length})
                </button>
                <button 
                  className={`filter-pill ${orderFilter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('cancelled')}
                >
                  Cancelled ({orders.filter(o => o.status === 'cancelled').length})
                </button>
              </div>

              <button 
                className="btn btn-outline btn-sm sweep-btn"
                onClick={handleRunExpirySweep}
                disabled={isSweeping}
                title="Cancel pending orders older than 48 hours and return quantities to stock"
              >
                <RefreshCw size={14} className={isSweeping ? 'spin' : ''} />
                <span>Run 48-Hr Auto-Cancel Sweep</span>
              </button>

              <button 
                className="btn btn-sm"
                style={{ background: '#ff9900', color: '#0f172a', fontWeight: 800, border: 'none', marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                onClick={() => onOpenInvoice?.(undefined, 'create')}
                title="Create a custom bill or cash memo for walk-in counter customer"
              >
                <FileText size={14} />
                <span>+ Counter POS Bill</span>
              </button>
            </div>

            <div className="admin-table-container">
              {filteredOrders.length === 0 ? (
                <div className="empty-state-card">
                  <p>No orders found matching your search or filter.</p>
                </div>
              ) : (
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Order Ref</th>
                      <th>Customer Info</th>
                      <th>Reserved Items</th>
                      <th>Total Amount</th>
                      <th>Status & Expiry</th>
                      <th style={{ textAlign: 'right' }}>Counter Settlement Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const isPending = order.status === 'pending_collection';
                      const isCollected = order.status === 'collected';
                      const isCancelled = order.status === 'cancelled';

                      return (
                        <tr key={order.orderRef} className={`order-row ${order.status}`}>
                          <td>
                            <strong className="order-ref-text">{order.orderRef}</strong>
                            <div className="text-muted text-xs">
                              {new Date(order.createdAt).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td>
                            <div className="customer-name-bold">{order.customerName}</div>
                            <div className="customer-phone-link">
                              <Phone size={12} />
                              <a href={`tel:${order.phone}`}>{order.phone}</a>
                            </div>
                          </td>
                          <td>
                            <div className="order-items-compact">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="item-line">
                                  <span className="item-qty">{item.quantity}x</span>
                                  <span className="item-title">{item.product.name}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="price-tag-bold">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                            <div className="text-muted text-xs">₹0 Online &bull; Counter Pay</div>
                          </td>
                          <td>
                            <span className={`status-badge status-${order.status}`}>
                              {order.status === 'pending_collection' && '⏳ Pending Pickup'}
                              {order.status === 'collected' && `✓ Paid & Collected (${order.paymentMethod === 'upi_counter' ? 'UPI' : 'Cash'})`}
                              {order.status === 'cancelled' && '✗ Cancelled'}
                            </span>
                            {isPending && order.expiresAt && (
                              <div className="expiry-hint text-xs">
                                Pick up within 48h
                              </div>
                            )}
                            {isCollected && order.collectedBy && (
                              <div className="collected-staff-note text-xs">
                                Handed over by {order.collectedBy}
                              </div>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="counter-action-group" style={{ justifyContent: 'flex-end', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <button
                                className="btn btn-sm btn-outline"
                                style={{ background: '#f8fafc', borderColor: '#cbd5e1', color: '#1e293b' }}
                                onClick={() => {
                                  onOpenInvoice?.({
                                    invoiceNumber: `INV-${order.orderRef.replace('ORD-', '')}`,
                                    orderRef: order.orderRef,
                                    date: new Date(order.createdAt).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }),
                                    customerName: order.customerName,
                                    customerPhone: order.phone,
                                    items: order.items.map((i) => ({
                                      description: i.product.name,
                                      brand: i.product.brand,
                                      quantity: i.quantity,
                                      unitPrice: i.product.price,
                                      total: i.product.price * i.quantity
                                    })),
                                    subtotal: order.totalAmount,
                                    totalAmount: order.totalAmount,
                                    paymentMethod: order.paymentMethod === 'cash' ? 'Cash on Counter' : 'UPI Counter',
                                    paymentStatus: order.status === 'collected' ? 'PAID' : 'RESERVED',
                                    billType: 'retail'
                                  }, 'view');
                                }}
                                title="View & Print Official Tax Invoice / Cash Bill"
                              >
                                <FileText size={13} />
                                <span>Bill</span>
                              </button>

                              {isPending && (
                                <>
                                  <button 
                                    className="btn btn-sm btn-outline"
                                    onClick={() => setCounterUpiModal({
                                      isOpen: true,
                                      amount: order.totalAmount,
                                      orderOrTicketRef: order.orderRef,
                                      customerName: order.customerName
                                    })}
                                    title="Show Shop Counter UPI QR Code on screen for customer to scan"
                                  >
                                    <QrCode size={13} />
                                    <span>QR</span>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-action-cash"
                                    onClick={() => handleSettleOrder(order.orderRef, 'cash')}
                                    title="Customer paid cash at shop counter"
                                  >
                                    <DollarSign size={13} />
                                    <span>Cash</span>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-action-upi"
                                    onClick={() => handleSettleOrder(order.orderRef, 'upi_counter')}
                                    title="Customer scanned shop UPI QR code"
                                  >
                                    <CheckCircle size={13} />
                                    <span>UPI</span>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-action-cancel"
                                    onClick={() => handleCancelOrder(order.orderRef)}
                                    title="Cancel reservation & return stock"
                                  >
                                    <XCircle size={13} />
                                  </button>
                                </>
                              )}
                              {isCollected && (
                                <span className="text-xs text-emerald-400 font-semibold" style={{ marginLeft: '4px' }}>
                                  Settled ✓
                                </span>
                              )}
                              {isCancelled && (
                                <span className="text-xs text-rose-400" style={{ marginLeft: '4px' }}>
                                  Stock Restored
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REPAIRS QUEUE */}
        {activeTab === 'repairs' && (
          <div className="admin-tab-content">
            <div className="admin-controls-bar">
              <div className="admin-search-box">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search Ticket, Customer, Tool or Model..." 
                  value={repairSearch}
                  onChange={(e) => setRepairSearch(e.target.value)}
                />
              </div>

              <div className="admin-filter-pills">
                <button 
                  className={`filter-pill ${repairFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setRepairFilter('all')}
                >
                  All ({Object.keys(repairs).length})
                </button>
                <button 
                  className={`filter-pill ${repairFilter === 'requested' ? 'active' : ''}`}
                  onClick={() => setRepairFilter('requested')}
                >
                  Requested ({Object.values(repairs).filter(r => r.status === 'requested').length})
                </button>
                <button 
                  className={`filter-pill ${repairFilter === 'inspection' ? 'active' : ''}`}
                  onClick={() => setRepairFilter('inspection')}
                >
                  Diagnostic ({Object.values(repairs).filter(r => r.status === 'inspection').length})
                </button>
                <button 
                  className={`filter-pill ${repairFilter === 'in_progress' ? 'active' : ''}`}
                  onClick={() => setRepairFilter('in_progress')}
                >
                  Repairing ({Object.values(repairs).filter(r => r.status === 'in_progress').length})
                </button>
                <button 
                  className={`filter-pill ${repairFilter === 'ready_for_collection' ? 'active' : ''}`}
                  onClick={() => setRepairFilter('ready_for_collection')}
                >
                  Ready for Pickup ({Object.values(repairs).filter(r => r.status === 'ready_for_collection').length})
                </button>
              </div>
            </div>

            <div className="admin-table-container">
              {filteredRepairs.length === 0 ? (
                <div className="empty-state-card">
                  <p>No repair tickets found matching this filter.</p>
                </div>
              ) : (
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Ticket #</th>
                      <th>Customer & Tool</th>
                      <th>Reported Symptom</th>
                      <th>Assigned Technician</th>
                      <th>Estimate & Status</th>
                      <th style={{ textAlign: 'right' }}>Owner Stage Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRepairs.map((job) => (
                      <tr key={job.referenceId} className={`repair-row ${job.status}`}>
                        <td>
                          <span className="ticket-ref-badge">{job.referenceId}</span>
                          <div className="text-muted text-xs">{job.submittedAt}</div>
                        </td>
                        <td>
                          <div className="customer-name-bold">{job.customerName}</div>
                          <div className="tool-name-info">
                            <strong>{job.toolType}</strong> &bull; {job.brandModel}
                          </div>
                          <div className="customer-phone-link">
                            <Phone size={11} />
                            <span>{job.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div className="symptom-text">{job.issueDescription}</div>
                          {job.diagnosticFindings && (
                            <div className="tech-findings-badge">
                              🛠️ Tech: {job.diagnosticFindings}
                            </div>
                          )}
                        </td>
                        <td>
                          <select 
                            className="admin-tech-select"
                            value={job.technicianName || ''}
                            onChange={(e) => handleAssignTechnician(job.referenceId, e.target.value)}
                          >
                            <option value="">-- Assign Technician --</option>
                            {TECHNICIANS.map((tech) => (
                              <option key={tech} value={tech}>{tech.split(' ')[0]} {tech.split(' ')[1]}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="repair-estimate-amount">
                            {job.estimatedCost ? `₹${job.estimatedCost}` : 'Estimate Pending'}
                          </div>
                          <span className={`status-badge status-${job.status}`}>
                            {job.statusLabel}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="stage-actions-group">
                            <button 
                              type="button"
                              className="btn btn-xs btn-outline"
                              onClick={() => handlePrintSlip(job)}
                              title="Print Physical Counter Intake Slip"
                            >
                              <Printer size={12} />
                              <span>Print Slip</span>
                            </button>

                            {job.status === 'requested' && (
                              <button 
                                className="btn btn-xs btn-outline"
                                onClick={() => handleUpdateRepairStatus(job.referenceId, 'received_at_shop')}
                              >
                                Mark Received
                              </button>
                            )}
                            {job.status === 'received_at_shop' && (
                              <button 
                                className="btn btn-xs btn-primary"
                                onClick={() => handleUpdateRepairStatus(job.referenceId, 'inspection')}
                              >
                                Send to Bench
                              </button>
                            )}
                            {job.status === 'awaiting_customer_approval' && (
                              <button 
                                className="btn btn-xs btn-primary"
                                onClick={() => handleUpdateRepairStatus(job.referenceId, 'approved')}
                              >
                                Cust. Approved
                              </button>
                            )}
                            {job.status === 'in_progress' && (
                              <button 
                                className="btn btn-xs btn-action-upi"
                                onClick={() => handleUpdateRepairStatus(job.referenceId, 'ready_for_collection')}
                              >
                                Ready at Counter
                              </button>
                            )}
                            {job.status === 'ready_for_collection' && (
                              <>
                                <a 
                                  href={whatsappService.getToolReadyAlertUrl(job)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-xs btn-whatsapp-alert"
                                  title="Send WhatsApp Alert: Tool Ready for Pickup"
                                >
                                  <Share2 size={12} />
                                  <span>WhatsApp</span>
                                </a>
                                <button 
                                  className="btn btn-xs btn-action-cash"
                                  onClick={() => handleUpdateRepairStatus(job.referenceId, 'completed')}
                                >
                                  Handed Over & Paid
                                </button>
                              </>
                            )}
                            {job.status === 'completed' && (
                              <span className="text-xs text-emerald-400 font-semibold">
                                Closed ✓
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY & STOCK */}
        {activeTab === 'inventory' && (
          <div className="admin-tab-content">
            <div className="admin-controls-bar">
              <div className="admin-search-box">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search tool, spare part, brand or model..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Product & Model</th>
                    <th>Category</th>
                    <th>Current Price</th>
                    <th>Live Stock Count</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Stock Control</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const isLow = p.stockCount <= 5;
                    const isEditing = editingProductId === p.id;

                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="product-item-row">
                            <strong className="product-title">{p.name}</strong>
                            <div className="text-muted text-xs">{p.brand} &bull; Model: {p.modelNumber}</div>
                          </div>
                        </td>
                        <td>
                          <span className="category-pill-tag">{p.category}</span>
                        </td>
                        <td>
                          {isEditing ? (
                            <input 
                              type="number" 
                              className="edit-inline-input"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                            />
                          ) : (
                            <strong className="price-tag-bold">₹{p.price}</strong>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input 
                              type="number" 
                              className="edit-inline-input"
                              value={tempStock}
                              onChange={(e) => setTempStock(Number(e.target.value))}
                            />
                          ) : (
                            <div className="stock-count-wrap">
                              <span className={`stock-number ${isLow ? 'low' : ''}`}>{p.stockCount}</span>
                              <span className="text-xs text-muted">units</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {isLow ? (
                            <span className="low-stock-alert-badge">
                              <AlertTriangle size={12} />
                              <span>Low Stock (&le;5)</span>
                            </span>
                          ) : (
                            <span className="in-stock-tag">
                              <CheckCircle size={12} />
                              <span>Available</span>
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {isEditing ? (
                            <div className="edit-actions-group">
                              <button 
                                className="btn btn-xs btn-primary"
                                onClick={() => saveProductEdit(p.id)}
                              >
                                Save
                              </button>
                              <button 
                                className="btn btn-xs btn-outline"
                                onClick={() => setEditingProductId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="stock-quick-buttons">
                              <button 
                                className="btn-qty-mini" 
                                onClick={() => quickAdjustStock(p.id, p.stockCount, -1)}
                                title="Reduce stock by 1"
                              >
                                <Minus size={12} />
                              </button>
                              <button 
                                className="btn-qty-mini" 
                                onClick={() => quickAdjustStock(p.id, p.stockCount, 1)}
                                title="Add 1 to stock"
                              >
                                <Plus size={12} />
                              </button>
                              <button 
                                className="btn-edit-mini"
                                onClick={() => startEditProduct(p)}
                                title="Edit exact stock and price"
                              >
                                <Edit3 size={13} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Shop Counter Physical UPI QR Modal */}
      <CounterUpiModal
        isOpen={counterUpiModal.isOpen}
        onClose={() => setCounterUpiModal(prev => ({ ...prev, isOpen: false }))}
        amount={counterUpiModal.amount}
        orderOrTicketRef={counterUpiModal.orderOrTicketRef}
        customerName={counterUpiModal.customerName}
        onPaymentConfirmed={() => {
          handleSettleOrder(counterUpiModal.orderOrTicketRef, 'upi_counter');
        }}
      />
    </div>
  );
};

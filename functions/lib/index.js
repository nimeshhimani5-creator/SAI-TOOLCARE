"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventoryStock = exports.submitDiagnosticEstimate = exports.assignTechnicianToRepair = exports.onRepairStatusChanged = exports.markOrderCollected = exports.expirePendingOrders = exports.onOrderCreated = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const https_1 = require("firebase-functions/v2/https");
// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
/**
 * 1. TRIGGER: onOrderCreated
 * Fires when a new counter reservation order is created.
 * Sets 48-hour expiration deadline, audits the reservation, and prepares collection slip.
 */
exports.onOrderCreated = (0, firestore_1.onDocumentCreated)('orders/{orderId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot)
        return;
    const orderData = snapshot.data();
    const orderId = event.params.orderId;
    // Calculate 48-hour pickup window
    const createdAt = orderData.createdAt ? new Date(orderData.createdAt) : new Date();
    const expiresAt = new Date(createdAt.getTime() + 48 * 60 * 60 * 1000);
    // Update order with backend server timestamps and expiry
    await snapshot.ref.update({
        serverRegisteredAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: expiresAt.toISOString(),
        status: orderData.status || 'pending_collection',
        shopPickupLocation: 'Om Sai Power Tools, Station Road Counter'
    });
    // Log notification event for customer (Simulated SMS / In-App)
    await db.collection('notifications').add({
        type: 'ORDER_RESERVED',
        recipientPhone: orderData.phone,
        orderRef: orderId,
        customerName: orderData.customerName,
        message: `Namaste ${orderData.customerName}! Your order ${orderId} (₹${orderData.totalAmount}) is reserved for 48 hours at Om Sai Power Tools, Station Road. Settle via Cash/UPI upon inspection.`,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`[Order Backend] Reservation ${orderId} registered with 48h expiry: ${expiresAt.toISOString()}`);
});
/**
 * 2. SCHEDULED CRON: expirePendingOrders
 * Runs every hour to cancel reservations older than 48 hours and safely restore inventory stock.
 */
exports.expirePendingOrders = (0, scheduler_1.onSchedule)('every 1 hours', async () => {
    const now = new Date();
    console.log(`[Order Backend] Running 48-hour reservation expiration sweep at ${now.toISOString()}`);
    const expiredSnapshot = await db.collection('orders')
        .where('status', '==', 'pending_collection')
        .where('expiresAt', '<=', now.toISOString())
        .get();
    if (expiredSnapshot.empty) {
        console.log('[Order Backend] No expired reservations found.');
        return;
    }
    console.log(`[Order Backend] Found ${expiredSnapshot.size} expired reservations. Restoring stock...`);
    for (const docSnapshot of expiredSnapshot.docs) {
        const order = docSnapshot.data();
        const batch = db.batch();
        // 1. Mark order as cancelled
        batch.update(docSnapshot.ref, {
            status: 'cancelled',
            cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
            cancelledReason: '48_hour_pickup_window_expired'
        });
        // 2. Restore stock for each item in the cancelled order
        if (Array.isArray(order.items)) {
            for (const item of order.items) {
                if (item?.product?.id && item?.quantity) {
                    const productRef = db.collection('products').doc(item.product.id);
                    batch.update(productRef, {
                        stockCount: admin.firestore.FieldValue.increment(item.quantity)
                    });
                }
            }
        }
        await batch.commit();
        console.log(`[Order Backend] Order ${docSnapshot.id} cancelled & stock restored.`);
    }
});
/**
 * 3. CALLABLE: markOrderCollected
 * Invoked by shop owner/technician when customer collects items and pays at the counter.
 * Offline settlement: ₹0 online, settled via Cash or shop UPI QR at Station Road counter.
 */
exports.markOrderCollected = (0, https_1.onCall)(async (request) => {
    // Verify authenticated staff
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be logged in as staff to confirm counter collections.');
    }
    const callerUid = request.auth.uid;
    const callerDoc = await db.collection('users').doc(callerUid).get();
    const callerRole = callerDoc.data()?.role;
    if (callerRole !== 'owner' && callerRole !== 'technician') {
        throw new https_1.HttpsError('permission-denied', 'Only workshop staff can confirm collection and payment.');
    }
    const { orderRef, paymentMethod, notes } = request.data;
    if (!orderRef) {
        throw new https_1.HttpsError('invalid-argument', 'Missing order reference.');
    }
    const orderRefDoc = db.collection('orders').doc(orderRef);
    const orderSnap = await orderRefDoc.get();
    if (!orderSnap.exists) {
        throw new https_1.HttpsError('not-found', `Order ${orderRef} not found.`);
    }
    const orderData = orderSnap.data();
    if (orderData.status === 'collected') {
        throw new https_1.HttpsError('already-exists', 'Order has already been collected and settled.');
    }
    await orderRefDoc.update({
        status: 'collected',
        collectedAt: admin.firestore.FieldValue.serverTimestamp(),
        collectedBy: callerUid,
        collectedByName: callerDoc.data()?.displayName || 'Workshop Staff',
        paymentMethod: paymentMethod || 'cash', // 'cash' | 'upi_counter'
        staffNotes: notes || 'Counter inspection completed, verified working, payment settled.'
    });
    return { success: true, message: `Order ${orderRef} successfully marked as collected & settled.` };
});
/**
 * 4. TRIGGER: onRepairStatusChanged
 * Fires whenever a repair document in `/repairs/{repairId}` is updated.
 * Automatically tracks timeline audit events and notifies customer when tool is ready.
 */
exports.onRepairStatusChanged = (0, firestore_1.onDocumentUpdated)('repairs/{repairId}', async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after)
        return;
    const repairId = event.params.repairId;
    // Detect status change
    if (before.status !== after.status) {
        console.log(`[Repairs Backend] Ticket ${repairId} changed status: ${before.status} -> ${after.status}`);
        // If ready for collection, generate instant customer pickup notification
        if (after.status === 'ready_for_collection') {
            await db.collection('notifications').add({
                type: 'REPAIR_READY',
                recipientPhone: after.phone,
                repairReference: repairId,
                customerName: after.customerName,
                toolType: after.toolType,
                message: `Tool Ready! Om Sai Power Tools: Your ${after.toolType} (${repairId}) has been repaired and bench-tested. Please collect at Station Road counter. Estimate: ₹${after.estimatedCost || 0}.`,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`[Repairs Backend] Customer pickup alert generated for ticket ${repairId}`);
        }
    }
});
/**
 * 5. CALLABLE: assignTechnicianToRepair
 * Invoked by shop owner to allocate a repair ticket to a certified technician.
 */
exports.assignTechnicianToRepair = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated.');
    }
    const callerDoc = await db.collection('users').doc(request.auth.uid).get();
    if (callerDoc.data()?.role !== 'owner') {
        throw new https_1.HttpsError('permission-denied', 'Only workshop owner can assign technicians.');
    }
    const { repairId, technicianName, technicianUid } = request.data;
    if (!repairId || !technicianName) {
        throw new https_1.HttpsError('invalid-argument', 'Missing repairId or technicianName.');
    }
    const repairRef = db.collection('repairs').doc(repairId);
    const snap = await repairRef.get();
    if (!snap.exists) {
        throw new https_1.HttpsError('not-found', 'Repair ticket not found.');
    }
    await repairRef.update({
        technicianName,
        technicianUid: technicianUid || null,
        status: snap.data()?.status === 'requested' ? 'received_at_shop' : snap.data()?.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true, message: `Ticket ${repairId} assigned to technician ${technicianName}.` };
});
/**
 * 6. CALLABLE: submitDiagnosticEstimate
 * Invoked by technician to record inspection diagnosis and submit cost quote.
 */
exports.submitDiagnosticEstimate = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated.');
    }
    const callerDoc = await db.collection('users').doc(request.auth.uid).get();
    const role = callerDoc.data()?.role;
    if (role !== 'owner' && role !== 'technician') {
        throw new https_1.HttpsError('permission-denied', 'Only workshop staff can submit diagnostic estimates.');
    }
    const { repairId, diagnosticFindings, estimatedCost, partsNeeded } = request.data;
    if (!repairId || estimatedCost === undefined) {
        throw new https_1.HttpsError('invalid-argument', 'Missing repairId or estimatedCost.');
    }
    const repairRef = db.collection('repairs').doc(repairId);
    await repairRef.update({
        status: 'awaiting_customer_approval',
        estimatedCost: Number(estimatedCost),
        diagnosticFindings: diagnosticFindings || 'Tool inspected by technician.',
        partsNeeded: partsNeeded || [],
        estimatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true, message: `Estimate submitted for repair ${repairId}.` };
});
/**
 * 7. CALLABLE: updateInventoryStock
 * Secure owner endpoint to update catalog stock or price.
 */
exports.updateInventoryStock = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated.');
    }
    const callerDoc = await db.collection('users').doc(request.auth.uid).get();
    if (callerDoc.data()?.role !== 'owner') {
        throw new https_1.HttpsError('permission-denied', 'Only workshop owner can update inventory stock.');
    }
    const { productId, newStock, newPrice } = request.data;
    if (!productId || newStock === undefined) {
        throw new https_1.HttpsError('invalid-argument', 'Missing productId or newStock.');
    }
    const updates = {
        stockCount: Number(newStock),
        inStock: Number(newStock) > 0,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    if (newPrice !== undefined) {
        updates.price = Number(newPrice);
    }
    await db.collection('products').doc(productId).update(updates);
    return { success: true, message: `Product ${productId} stock updated to ${newStock}.` };
});
//# sourceMappingURL=index.js.map
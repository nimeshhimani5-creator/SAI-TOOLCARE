import { SHOP_INFO } from '../data/mockData';

const SHOP_WHATSAPP_NUMBER = '918077466755';

// Clean helper to build wa.me URL
const buildWhatsAppUrl = (phone: string, text: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

export const whatsappService = {
  // Customer inquires / asks to hold item before visiting the shop
  getHoldItemUrl(productName: string, modelNumber: string, price: number): string {
    const message = 
`Hello Himani (Om Sai Power Tools, Station Road),
I am planning to visit your counter today.
I need this machine / spare part:
📌 Product: ${productName}
📌 Model: ${modelNumber}
📌 Counter Price: ₹${price.toLocaleString('en-IN')}

Is this currently available in stock at your counter? Please hold 1 unit for me until I arrive.`;

    return buildWhatsAppUrl(SHOP_WHATSAPP_NUMBER, message);
  },

  // Customer or Staff sends Repair Booking Confirmation
  getRepairBookingSlipUrl(
    ticketId: string, 
    customerName: string, 
    toolType: string, 
    brandModel: string, 
    phone: string
  ): string {
    const message = 
`🔧 *OM SAI POWER TOOLS AND REPAIRING CENTER*
📍 Station Road, Opp. Bus Depot • Contact: +91 80774 66755

*Repair Booking Confirmation*
━━━━━━━━━━━━━━━━━━━━
• Ticket ID: *#${ticketId}*
• Customer: ${customerName}
• Tool: ${toolType} (${brandModel})
• Online Advance: *₹0 (Zero)*

📋 *Next Step:*
Please bring your tool to our Station Road counter. Our technicians will inspect it on the bench and share the diagnostic estimate.

🌐 Live Tracking:
https://saitoolcare.web.app/?ticket=${ticketId}`;

    const targetPhone = phone.replace(/[^0-9]/g, '') || SHOP_WHATSAPP_NUMBER;
    return buildWhatsAppUrl(targetPhone.length >= 10 ? targetPhone : SHOP_WHATSAPP_NUMBER, message);
  },

  // Technician / Owner sends "Machine Ready for Collection" alert to customer
  getToolReadyAlertUrl(
    ticketOrJob: string | { referenceId: string; customerName: string; toolType: string; brandModel: string; estimatedCost?: number; phone: string },
    customerName?: string,
    toolType?: string,
    brandModel?: string,
    amount?: number,
    phone?: string
  ): string {
    let tId = '';
    let cName = '';
    let tType = '';
    let bModel = '';
    let amt = 0;
    let ph = '';

    if (typeof ticketOrJob === 'object' && ticketOrJob !== null) {
      tId = ticketOrJob.referenceId;
      cName = ticketOrJob.customerName;
      tType = ticketOrJob.toolType;
      bModel = ticketOrJob.brandModel;
      amt = ticketOrJob.estimatedCost || 0;
      ph = ticketOrJob.phone;
    } else {
      tId = ticketOrJob;
      cName = customerName || '';
      tType = toolType || '';
      bModel = brandModel || '';
      amt = amount || 0;
      ph = phone || '';
    }

    const message = 
`✅ *Your Tool is Bench Load-Tested & Ready for Pickup!*
*Om Sai Power Tools and Repairing Center, Station Road*

Hello ${cName},
Your tool has been serviced, rebuilt, and load-tested on our test bench. It is now ready for collection at our counter.

📌 Ticket #: *#${tId}*
📌 Machine: ${tType} - ${bModel}
📌 Repair Bill: *₹${amt.toLocaleString('en-IN')}*

Please visit our counter to test run your machine and complete settlement via Cash or Shop UPI QR.

⏰ Working Hours: Mon-Sat 9:00 AM – 8:30 PM
📍 Address: Shop No 4, Sai Complex, Station Road, Opp. Bus Depot.`;

    return buildWhatsAppUrl(ph || SHOP_WHATSAPP_NUMBER, message);
  },

  // Send Counter Reservation Slip to customer's WhatsApp
  getOrderReservationSlipUrl(
    orderRef: string,
    customerName: string,
    itemCount: number,
    totalAmount: number,
    phone: string
  ): string {
    const message = 
`📦 *Counter Reservation Slip*
*Om Sai Power Tools and Repairing Center*

Hello ${customerName},
Your counter order has been reserved for 48 hours.

• Order Reference: *#${orderRef}*
• Total Items: ${itemCount} units
• Total Amount: *₹${totalAmount.toLocaleString('en-IN')}* (Pay at counter after inspecting)
• Online Advance: *₹0*

📍 Counter Address:
Shop No 4, Sai Complex, Station Road, Opp. Bus Depot.`;

    return buildWhatsAppUrl(phone || SHOP_WHATSAPP_NUMBER, message);
  }
};

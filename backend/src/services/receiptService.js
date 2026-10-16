/** CHECK FOR UPDATES ----------------------- */

import { PDFDocument, StandardFonts } from "pdf-lib";

export async function createReceiptPdf(order) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const draw = (text, x, y, options = {}) => {
    page.drawText(String(text), {
      x,
      y,
      size: options.size || 11,
      font: options.bold ? bold : font,
    });
  };

  draw("NILUS KITCHEN", 50, 790, { size: 22, bold: true });
  draw("Order Receipt", 50, 760, { size: 15, bold: true });

  draw(`Order ID: ${order.orderId}`, 50, 730);
  draw(`Customer ID: ${order.customerId}`, 50, 712);
  draw(`Customer: ${order.customerName}`, 50, 694);
  draw(`Phone: ${order.customerPhone}`, 50, 676);
  draw(`Delivery address: ${order.deliveryAddress}`, 50, 658);

  draw("Item", 50, 620, { bold: true });
  draw("Qty", 300, 620, { bold: true });
  draw("Price", 360, 620, { bold: true });
  draw("Amount", 450, 620, { bold: true });

  let y = 598;

  for (const item of order.items) {
    draw(item.name, 50, y);
    draw(`${item.quantity} ${item.unit}`, 300, y);
    draw(item.unitPrice.toFixed(2), 360, y);
    draw(item.lineTotal.toFixed(2), 450, y);
    y -= 22;
  }

  y -= 15;

  draw(`Subtotal: BDT ${order.subtotal.toFixed(2)}`, 350, y);
  y -= 20;

  draw(`Delivery: BDT ${order.deliveryCharge.toFixed(2)}`, 350, y);
  y -= 25;

  draw(`Total: BDT ${order.total.toFixed(2)}`, 350, y, {
    size: 14,
    bold: true,
  });

  y -= 30;
  draw(`Payment method: ${order.paymentMethod}`, 50, y);
  y -= 20;
  draw(`Payment status: ${order.paymentStatus}`, 50, y);
  y -= 35;
  draw("Thank you for ordering from Nilus Kitchen!", 50, y);

  return pdf.save();
}
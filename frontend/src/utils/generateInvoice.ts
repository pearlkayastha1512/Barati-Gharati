import jsPDF from "jspdf";

import { Booking } from "@/types/booking";

export function generateInvoice(
  booking: Booking
) {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(225, 29, 72);
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Wedding Planner", 14, 16);

  doc.setFontSize(10);
  doc.text("Booking Invoice", 150, 16);

  doc.setTextColor(0, 0, 0);

  let y = 38;

  const line = (
    label: string,
    value: string
  ) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 15, y);

    doc.setFont("helvetica", "normal");
    doc.text(value, 75, y);

    y += 9;
  };

  line(
    "Invoice No",
    `INV-${booking.bookingNumber}`
  );

  line(
    "Booking No",
    booking.bookingNumber
  );

  line(
    "Customer",
    booking.customerName
  );

  line(
    "Vendor",
    booking.vendorName
  );

  line(
    "Category",
    booking.category
  );

  line(
    "Package",
    booking.packageName
  );

  line(
    "Wedding Date",
    booking.eventDate
  );

  line(
    "Wedding Time",
    booking.eventTime || "--"
  );

  line(
    "Venue",
    booking.venue || "--"
  );

  line(
    "City",
    booking.city
  );

  line(
    "Guests",
    booking.guests.toString()
  );

  y += 8;

  doc.setDrawColor(220);
  doc.line(15, y, 195, y);

  y += 12;

  line(
    "Total Amount",
    `₹${booking.amount.toLocaleString(
      "en-IN"
    )}`
  );

  line(
    "Advance Paid",
    `₹${booking.advancePaid.toLocaleString(
      "en-IN"
    )}`
  );

  line(
    "Remaining",
    `₹${booking.remainingAmount.toLocaleString(
      "en-IN"
    )}`
  );

  line(
    "Payment Status",
    booking.paymentStatus.toUpperCase()
  );

  line(
    "Booking Status",
    booking.bookingStatus.toUpperCase()
  );

  y += 15;

  doc.setFontSize(11);

  doc.text(
    "Thank you for choosing Wedding Planner.",
    15,
    y
  );

  y += 8;

  doc.text(
    "We wish you a wonderful wedding celebration!",
    15,
    y
  );

  doc.save(
    `${booking.bookingNumber}.pdf`
  );
}
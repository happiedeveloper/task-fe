import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  altPhone?: string;
  destination: string;
  age: number;
  checkin: string | string[];
  checkout: string | string[];
  guests: number;
  status: string;
  utrNumber?: string;
  totalAmount: number;
  paymentScreenshot?: string;
  guestDetails: {
    name: string;
    age: number;
    bloodGroup: string;
    diabetes: boolean;
  }[];
}

export const generateBookingPDF = (booking: Booking) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Booking Details", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Field", "Value"]],
    body: [
      ["Id", booking._id],
      ["Name", booking.name],
      ["Email", booking.email],
      ["Mobile", booking.phone],
      ["Alternate Mobile", booking.altPhone || "-"],
      ["Age", booking.age.toString()],
      ["Destination", booking.destination],
      ["Check-In", (Array.isArray(booking.checkin) ? booking.checkin[0] : booking.checkin).split("T")[0]],
      ["Check-Out", (Array.isArray(booking.checkout) ? booking.checkout[0] : booking.checkout).split("T")[0]],
      ["Guests", booking.guests.toString()],
      ["Total Amount", booking.totalAmount.toString()],
      ["Status", booking.status],
      ["UTR", booking.utrNumber || "-"],
      ["Payment Screenshot", booking.paymentScreenshot ? "Available in the administrator dashboard" : "Not Available"],
      ["Guest Details", booking.guestDetails.map(g => `NAME : ${g.name}, Age: ${g.age}, Blood Group: ${g.bloodGroup}, Diabetic: ${g.diabetes ? "Yes" : "No"}`).join("\n")],
    ],
  });

  doc.save(`booking_${booking.name}.pdf`);
};


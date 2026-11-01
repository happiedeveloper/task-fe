import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, IndianRupee, TrendingUp, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Link } from "react-router-dom";
import { generateBookingPDF } from "../components/generateBookingPDF";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { API_BASE_URL } from "@/lib/api";
const stats = [
  { icon: Users, label: "Total Bookings", value: "156", change: "+12%" },
  { icon: Calendar, label: "This Month", value: "24", change: "+8%" },
  { icon: IndianRupee, label: "Revenue", value: "₹4.2L", change: "+18%" },
  { icon: TrendingUp, label: "Occupancy", value: "78%", change: "+5%" },
];

const statusColor: Record<string, string> = {
  confirmed: "bg-primary/15 text-primary border-primary/30",
  paid: "bg-primary/15 text-primary border-primary/30",
  pending: "bg-warm-gold/15 text-warm-gold border-warm-gold/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  "Waiting...": "bg-blue-500/15 text-blue-600 border-blue-500/30",
};

type BookingRow = {
  _id: string; name: string; email: string; phone: string; altPhone?: string; destination: string; age: number;
  checkin: string[]; checkout: string[]; guests: number; totalAmount: number; status: string; paymentScreenshot?: string;
  utrNumber?: string; guestDetails: Array<{ name: string; age: number; bloodGroup: string; diabetes: boolean }>;
};

async function patchBooking(id: string, status: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Administrator session expired");
  const url = `${API_BASE_URL}/api/admin/booking/${id}`;
  await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if(status === "paid"){
    await sendEmail(id, token);
  }
}

async function sendEmail(booking: string, token: string) {
   try{
          const emailResp = await fetch(`${API_BASE_URL}/api/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ bookingId: booking }),
          })
        }catch (err){
          console.error("Error sending email:", err);
        }

}


const Admin = () => {
  const [status, setStatus] = useState<keyof typeof statusColor>("pending");
  const [mockBookings, setMockBookings] = useState<BookingRow[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  useEffect(() => {
    async function fetchBookings() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
      });
      if (!response.ok) return;
      const bookings = await response.json();
      setMockBookings(bookings);
      const screenshots = await Promise.all(bookings.filter((b) => b.paymentScreenshot).map(async (b) => {
        const image = await fetch(`${API_BASE_URL}/api/admin/upload/${encodeURIComponent(b.paymentScreenshot)}`, {
          headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
        });
        return image.ok ? [b.paymentScreenshot, URL.createObjectURL(await image.blob())] as const : null;
      }));
      setImageUrls(Object.fromEntries(screenshots.filter((item): item is NonNullable<typeof item> => item !== null)));
    }
    fetchBookings();
  }, [])

  const [search, setSearch] = useState("");
  const filtered = mockBookings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-secondary-foreground/70 hover:text-primary gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <h1 className="font-display text-2xl font-bold text-secondary-foreground">Admin Dashboard</h1>
          </div>
          <Badge className="bg-primary/15 text-primary border-primary/30">Admin Booking Data</Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition hover:shadow-md md:p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <s.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary font-body">{s.change}</span>
              </div>
              <div className="font-display text-2xl font-bold text-card-foreground">{s.value}</div>
              <div className="text-muted-foreground text-sm font-body mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center md:p-7">
            <h2 className="font-display text-xl font-semibold text-card-foreground">Recent Bookings</h2>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">Name</TableHead>
                  <TableHead className="font-body">Destination</TableHead>
                  <TableHead className="font-body">Check-in</TableHead>
                  {/* <TableHead className="font-body">Check-out</TableHead> */}
                  <TableHead className="font-body">Guests Info</TableHead>
                  <TableHead className="font-body">Amount</TableHead>
                  <TableHead className="font-body">Alternative Mobile</TableHead>
                  <TableHead className="font-body">Status</TableHead>
                  <TableHead className="font-body">Payment Proof</TableHead>
                  <TableHead className="font-body">Download</TableHead>
                </TableRow>
              </TableHeader>
        <TableBody>
                {filtered.map((b) => (
                  <React.Fragment key={b._id}>
                    <TableRow>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-card-foreground">{b.name}</div>
                          <div className="text-xs text-muted-foreground">{b.email}</div>
                          <div className="text-xs text-muted-foreground">{b.phone}</div>
                        </div>
                      </TableCell>
                      {/* <TableCell className="font-body">{b.destination}</TableCell> */}
                      <TableCell className="font-body">{b.destination}</TableCell>
                      <TableCell className="font-body">{b.checkin[0].split("T")[0]}</TableCell>
                      {/* <TableCell className="font-body">{b.checkout[0].split("T")[0]}</TableCell> */}
                      <TableCell className="font-body">{b.guests} {"  "}
                        <button
                          onClick={() =>
                            setExpandedRow(expandedRow === b._id ? null : b._id.toString())
                          }
                          className="text-primary underline text-sm"
                        >
                          {expandedRow === b._id ? "Hide" : "View"}
                        </button>
                      </TableCell>
                      <TableCell className="font-semibold">{b.totalAmount}</TableCell>
                      <TableCell className="font-semibold">{b.altPhone}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor[b.status]}`}>
                          {b.status} <select value={status} onChange={(e) => { setStatus(e.target.value as keyof typeof statusColor); b.status = e.target.value; patchBooking(b._id, e.target.value); }} className="ml-2 px-2 py-1"> {Object.keys(statusColor).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>))}
                          </select>
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {b.paymentScreenshot && <div className="font-semibold text-card-foreground">
                          <img
                            src={imageUrls[b.paymentScreenshot]}
                            alt="Payment Proof"
                            style={{ width: "100px" }}
                            onClick={() =>
                              setPreviewImage(
                                imageUrls[b.paymentScreenshot]
                              )
                            }
                          />
                        </div>}
                        <div className="font-semibold text-card-foreground">UTR : {b.utrNumber}</div>
                      </TableCell>
                      <TableCell>
                        <Button onClick={async () =>await generateBookingPDF(b)} > PDF </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRow === b._id.toString() && (
                      <TableRow>
                        <TableCell colSpan={9} className="py-4">
                          <div className="space-y-3">
                            {b.guestDetails && b.guestDetails.length > 0 ? (
                              b.guestDetails.map((guest, index: number) => (
                                <div
                                  key={index}
                                  className="rounded-md border bg-secondary/80 px-4 py-3 text-sm"
                                >
                                  <div className="flex flex-wrap md:flex-nowrap md:justify-start gap-20 text-white text-lg">
                                    <div>
                                      <span>NAME:</span>{"  "}
                                      {guest.name.toUpperCase()}
                                    </div>

                                    <div>
                                      <span >AGE:</span>{"  "}
                                      {guest.age}
                                    </div>

                                    <div>
                                      <span >BLOOD:</span>{"  "}
                                      {guest.bloodGroup.toUpperCase()}
                                    </div>

                                    <div>
                                      <span >DIABETIC:</span>{"  "}
                                      {guest.diabetes ? "Yes" : "No"}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-muted-foreground text-sm">
                                No guest details available.
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>

          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground font-body">
              No bookings found matching your search.
            </div>
          )}
          {previewImage && (
            <div
              onClick={() => setPreviewImage(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                cursor: "zoom-out",
              }}
            >
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default Admin;


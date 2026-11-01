import { useState, useEffect } from "react";
import { useLanguage } from "@/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";

export default function Payment() {
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [booking, setBooking] = useState({});
  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const upiId = "8310506750@ybl";
  const name = "Developers Bank";

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    name
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent("Booking Payment")}`;

  const bookingId = localStorage.getItem("bookingId");
  useEffect(() => {

    async function fetchBooking() {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/booking/${bookingId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("bookingAccessToken") || ""}`,
          },
        });

        if (resp.ok) {
          const data = await resp.json();
          setAmount(data.booking.totalAmount);
          setBooking(data.booking);
        } else {
          console.error("Failed to fetch booking details");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    }

    if (bookingId) {
      fetchBooking();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utr && !screenshot) {
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("utr", utr);
    if (screenshot) {
      formData.append("screenshot", screenshot);
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/booking/${bookingId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("bookingAccessToken") || ""}` },
        body: formData,
      });

      if (resp.ok) {
        toast.success("Payment proof submitted successfully!");
        navigate("/gettingTouch");
      } else {
        toast.error("Failed to submit payment proof.");
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const showErrorBorder = error && !utr && !screenshot;

  return (
    <div className="page-shell">
      <Navbar />

      <div className="pt-24">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 font-body"
          >
            <ArrowLeft className="h-4 w-4" /> {t("BacktoHome")}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {lang === "en" ? `Make Payment by scanning our QR Code and add UTR details or upload
          screenshot for ₹ ` : `ನಮ್ಮ QR ಕೋಡ್ ಅನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಮೂಲಕ ಪಾವತಿ ಮಾಡಿ ಮತ್ತು UTR ವಿವರಗಳನ್ನು ಸೇರಿಸಿ ಅಥವಾ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ₹ `}
          <span className="font-bold text-4xl ">{amount}</span>
        </h2>

        <form
          onSubmit={handleSubmit}
          className="form-panel mx-auto mt-8 max-w-lg space-y-6"
        >
          <QRCodeSVG
            value={upiUrl}
            size={256}
            className="mx-auto"
          />

          <Input
            type="text"
            placeholder="Enter UTR Number"
            value={utr}
            onChange={(e) => {
              setUtr(e.target.value);
              setError(false);
            }}
            className={`bg-background ${showErrorBorder
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
              }`}
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setScreenshot(e.target.files?.[0] || null);
              setError(false);
            }}
            className={`bg-background ${showErrorBorder
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
              }`}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              Please enter UTR number or upload screenshot.
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Payment Proof"}
          </Button>
        </form>
      </div>
    </div>
  );
}


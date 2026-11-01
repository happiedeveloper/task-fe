import { useEffect, useState } from "react";
import { motion, noop } from "framer-motion";
import { Calendar, Users, MapPin, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "../LanguageContext";
import { totalmem } from "os";
import { set, setDate } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { API_BASE_URL } from "@/lib/api";

const destinations = [
  { value: "Adventure Sports", label: "Adventure Sports — ₹4,500", },
  { value: "Trekking", label: "Trekking — ₹6,000", },
  { value: "Scuba Diving", label: "Scuba Diving — ₹3,800", },
  { value: "Environmental Study", label: "Environmental Study — ₹5,200", },
  { value: "Cycling", label: "Cycling — ₹3,800", },
  { value: "Cultural Activities", label: "Cultural Activities — ₹6,000", },
  { value: "Nature tours", label: "Nature tours — ₹9,000", },
  { value: "Water Sports", label: "Water Sports — ₹1,000", },
  { value: "Cinema", label: "Cinema — ₹2,000", },
];
const Booking = () => {
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    altPhone: "",
    destination: "",
    checkin: "",
    checkout: "",
    guests: "",
    noOfDays: 0,
    hiText: "",
    guestDetails: [],
  });
  const destinationsValues = {
    "Adventure Sports": 4500,
    "Trekking": 6000,
    "Scuba Diving": 3800,
    "Environmental Study": 5200,
    "Cycling": 3800,
    "Cultural Activities": 6000,
    "Nature tours": 9000,
    "Water Sports": 1000,
    "Cinema": 2000,
  };
  const validation = (target, value) => {
    if (isNaN(Number(value)) || Number(value) <= 0) {
      target.classList.add("border-red-500", "focus-visible:ring-red-500");
      target.classList.remove("border-input", "focus-visible:ring-ring");
      toast.warning(`Please enter a valid number in ${target.name} field.`);
      return false;
    }
    target.classList.remove("border-red-500", "focus-visible:ring-red-500");
    target.classList.add("border-input", "focus-visible:ring-ring");
    return true;
  };
  const value = async () => {
    try {
      setIsLoading(true);
      const diff = 1;
      // if (new Date(formData.checkout).getTime() === new Date(formData.checkin).getTime()) {
      //   diff = 1;
      // } else {
      //   diff = Math.floor((new Date(formData.checkout).getTime() - new Date(formData.checkin).getTime()) / (1000 * 3600 * 24));
      // }

      const payload = {
        ...formData,
        guests: Number(formData.guests),
        age: Number(formData.age),
        noOfDays: diff,
        totalAmount:
          diff *
          destinationsValues[formData.destination] *
          Number(formData.guests),
        guestDetails: formData.guestDetails.map((g) => ({
          name: g.name,
          age: Number(g.age),
          bloodGroup: g.bloodGroup,
          diabetes: g.diabetes,
        })),
      };

      const val = await fetch(`${API_BASE_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalAmount: diff * destinationsValues[formData.destination] * parseInt(formData.guests),
        }),
      });
      const data = await val.json();
      if (val.ok) {
        setTimeout(() => {
          localStorage.setItem("bookingId", data.booking._id);
          localStorage.setItem("bookingAccessToken", data.accessToken);
          navigate("/terms&conditions");
        }, 100);
      } else {
        setIsLoading(false);
        toast.error("Booking failed. Please try again.");
      }
    } catch (e) {
      setIsLoading(false);
      toast.error("An error occurred. Please try again.");
    }

  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    value();
  };

  const updateGuest = (index, field, value) => {
    const updated = [...formData.guestDetails];
    updated[index][field] = value;
    setFormData({ ...formData, guestDetails: updated });
  };

  return (
    <div className="page-shell">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <div className="flex flex-col items-center gap-4 text-white">
            {/* <Loader2 className="h-12 w-12 animate-spin" /> */}
            <img src={logo} alt="logo" style={{ height: 350, width: 350, borderRadius: "50%" }} />
            <p className="text-lg font-semibold">
              Processing your booking...
            </p>
          </div>
        </div>
      )}
      <Navbar />
      <div className="pt-24 pb-24">
        <div className="container mx-auto max-w-3xl px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 font-body">
            <ArrowLeft className="h-4 w-4" /> {t("BacktoHome")}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`font-display text-4xl ${lang === "kn" ? "md:text-3xl" : "md:text-5xl"} font-bold text-foreground mb-1`}>
              {t("bookYourAdventure")}
            </h1>
            <p className={`text-muted-foreground font-body ${lang === "kn" ? "text-sm" : "text-lg"} mb-3`}>
              {t("fillindetails")}
            </p>

            <form onSubmit={handleSubmit} className="form-panel space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground font-body mb-1 block">{t("FullName")}</label>
                  <Input
                    required
                    placeholder="John Doe"
                    type="text"
                    className="bg-background"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground font-body mb-1 block">{t("Email")}</label>
                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="bg-background"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground font-body mb-1 block">{t("PhoneNumber")}</label>
                  <Input
                    required
                    placeholder="+91 98xxx xxxxx"
                    className="bg-background"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      validation(e.target, e.target.value)
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground font-body mb-1 block">{t("AltPhoneNumber")}</label>
                  <Input
                    placeholder="+91 9xxxx xxxxx"
                    className="bg-background"
                    type="tel"
                    value={formData.altPhone}
                    onChange={(e) => {
                      setFormData({ ...formData, altPhone: e.target.value });
                      validation(e.target, e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground font-body mb-1 block flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> {t("Destination")}
                  </label>
                  <Select onValueChange={(v) => setFormData({ ...formData, destination: v })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Choose a destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground font-body mb-1 block flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> {t("checkin")}
                  </label>
                  <Input
                    required
                    type="date"
                    className="bg-background"
                    value={formData.checkin}
                    onChange={(e) => setFormData({ ...formData, checkin: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground font-body mb-1 block">{t("Health")}</label>
                <Textarea
                  required
                  placeholder="Describe your health information like Past medical conditions, current medications, allergies, physical limitations, etc. If none, write 'None'."
                  className="bg-background"
                  value={formData.hiText}
                  onChange={(e) => setFormData({ ...formData, hiText: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground font-body mb-1 block flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> {t("numberofGuests")}
                </label>
                <Select
                  onValueChange={(v) => {
                    const count = parseInt(v);

                    setFormData((prev) => ({
                      ...prev,
                      guests: v,
                      guestDetails: Array.from({ length: count }, (_, i) =>
                        prev.guestDetails[i] || {
                          name: i === 0 ? prev.name : "",
                          age: "",
                          bloodGroup: "",
                          diabetes: false,
                        }
                      ),
                    }));
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6,].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <br />
                {formData.guestDetails.length > 0 && (
                  <div className="space-y-6">
                    {formData.guestDetails.map((guest, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-xl p-5 bg-background space-y-4"
                      >
                        <h3 className="font-semibold text-lg">
                          Person {index + 1} Details
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            required
                            placeholder="Name"
                            value={guest.name}
                            onChange={(e) =>
                              updateGuest(index, "name", e.target.value)
                            }
                          />

                          <Input
                            required
                            type="tel"
                            placeholder="Age"
                            value={guest.age}
                            onChange={(e) =>
                              updateGuest(index, "age", e.target.value)
                            }
                          />
                        </div>

                        <Input
                          required
                          placeholder="Blood Group (Eg: O+)"
                          value={guest.bloodGroup}
                          onChange={(e) =>
                            updateGuest(index, "bloodGroup", e.target.value)
                          }
                        />

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={guest.diabetes}
                            onChange={(e) =>
                              updateGuest(index, "diabetes", e.target.checked)
                            }
                          />
                          <label>Diabetes</label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-olive-light font-semibold py-6 text-lg gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    {t("proceedTopayment")}
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;


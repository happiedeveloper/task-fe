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
import { API_BASE_URL } from "@/lib/api";

export default function GettingTouch() {
    const { t, toggleLang, lang } = useLanguage();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [altNumber, setAltNumber] = useState("");
    const navigate = useNavigate();
    const bookingId = localStorage.getItem("bookingId");

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/booking/${bookingId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("bookingAccessToken") || ""}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setName(data.booking.name);
                setEmail(data.booking.email);
                setNumber(data.booking.phone);
                setAltNumber(data.booking.altPhone);
            })
            .catch((err) => {
                toast.error("Error fetching booking details:", err);
            });
    }, []);

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

            <div className="page-content py-16 md:py-24">
                <h2 className="surface-card mx-auto mb-8 max-w-3xl p-7 text-2xl leading-relaxed md:p-12">
                    {lang === "kn" ? (
                        <>
                            ನಮಸ್ತೆ <strong>{name}</strong> ಅವರೆ <br />
                            ನಾವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ! ಇಮೇಲ್{" "}
                            <strong>{email}</strong> ಅಥವಾ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ{" "}
                            <strong>{number}</strong>
                            {altNumber && (
                                <>
                                    {" "}ಅಥವಾ ಪರ್ಯಾಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ <strong>{altNumber}</strong> ಮೂಲಕ. <br />
                                </>
                            )}
                            ನಮ್ಮನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!
                        </>
                    ) : (
                        <>
                            Hey <strong>{name}</strong>, <br />
                            We will get in touch with you soon! With the email{" "}
                            <strong>{email}</strong> or registered mobile number{" "}
                            <strong>{number}</strong>
                            {altNumber && (
                                <>
                                    {" "}or alternate mobile number <strong>{altNumber}</strong>
                                </>
                            )} <br />
                            Thank you for choosing us!
                        </>
                    )}
                </h2>
            </div>
            <Button onClick={() => navigate("/")} className="mx-auto block">
                {t("BacktoHome")}
            </Button>
            <Footer />
            localStorage.removeItem("bookingId");
            localStorage.removeItem("bookingAccessToken");
        </div>
    )

}


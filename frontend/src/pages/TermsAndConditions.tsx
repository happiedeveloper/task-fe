import { useState } from "react";
import { useLanguage } from "@/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
  const { t, lang, toggleLang } = useLanguage();
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();


  return (
    <div className="page-shell">
      <Navbar />
      <div className="pt-24">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 font-body">
            <ArrowLeft className="h-4 w-4" /> {t("BacktoHome")}
          </Link>
        </div>
      </div>
      <div>
        <div className="form-panel space-y-6">
          <h2 className="text-lg font-semibold">{lang === "en" ? "Terms And Conditions" : "ಬಳಕೆಯ ನಿಯಮಗಳು"}</h2>

          {/* Terms text */}
          <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
            <p>
              {lang === "en" ? "By participating in this community activity, you confirm that your involvement is voluntary and based on your own decision." : "ಈ ಸಮುದಾಯ ಚಟುವಟಿಕೆಯಲ್ಲಿ ಭಾಗವಹಿಸುವ ಮೂಲಕ, ನಿಮ್ಮ ಭಾಗವಹಿಸುವಿಕೆ ಸಂಪೂರ್ಣವಾಗಿ ಸ್ವಯಂಪ್ರೇರಿತವಾಗಿದ್ದು ನಿಮ್ಮ ಸ್ವಂತ ನಿರ್ಧಾರದ ಮೇಲೆ ಆಧಾರಿತವಾಗಿದೆ ಎಂದು ನೀವು ದೃಢಪಡಿಸುತ್ತೀರಿ."}
            </p>

            <p>
              {lang === "en" ? "You agree to take full responsibility for your personal actions, behavior, health condition, and safety during the activity." : "ಈ ಚಟುವಟಿಕೆಯ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ನಡೆನುಡಿ, ವರ್ತನೆ, ಆರೋಗ್ಯ ಸ್ಥಿತಿ ಮತ್ತು ಭದ್ರತೆಗೆ ನೀವು ಸಂಪೂರ್ಣ ಹೊಣೆಗಾರಿಕೆಯನ್ನು ಒಪ್ಪಿಕೊಳ್ಳುತ್ತೀರಿ."}
            </p>

            <p>
              {lang === "en" ? "Any consequences resulting from your actions, negligence, or failure to follow community guidelines will be your sole responsibility and will not be attributed to the organizers, coordinators, or hosting community." : "ನಿಮ್ಮ ನಿರ್ಲಕ್ಷ್ಯ ಅಥವಾ ಸಮುದಾಯ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಅನುಸರಿಸಲು ವಿಫಲವಾದ ಕಾರಣ ಉಂಟಾಗುವ ಯಾವುದೇ ಪರಿಣಾಮಗಳಿಗೆ ನೀವು ಮಾತ್ರ ಜವಾಬ್ದಾರರಾಗಿರುತ್ತೀರಿ ಮತ್ತು ಅದನ್ನು ಸಂಘಟಕರು, ಸಂಯೋಜಕರು ಅಥವಾ ಆತಿಥೇಯ ಸಮುದಾಯದ ಮೇಲೆ ಹೊರಿಸಲಾಗುವುದಿಲ್ಲ."}
            </p>

            <p>
              {lang === "en" ? "You agree to respect other participants, follow safety instructions, and comply with all applicable community rules and local regulations." : "ನೀವು ಇತರ ಭಾಗವಹಿಸುವವರನ್ನು ಗೌರವಿಸುವುದು, ಸುರಕ್ಷತಾ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸುವುದು ಮತ್ತು ಅನ್ವಯಿಸುವ ಎಲ್ಲಾ ಸಮುದಾಯ ನಿಯಮಗಳು ಹಾಗೂ ಸ್ಥಳೀಯ ಕಾನೂನುಗಳನ್ನು ಅನುಸರಿಸುವುದಾಗಿ ಒಪ್ಪುತ್ತೀರಿ."}
            </p>

            <p>
              {lang === "en" ? "Failure to follow these rules may result in removal from the activity without refund or further participation rights." : "ಈ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸದಿದ್ದರೆ, ಯಾವುದೇ ಹಣ ಮರುಪಾವತಿ ಅಥವಾ ಮುಂದಿನ ಭಾಗವಹಿಸುವ ಹಕ್ಕಿಲ್ಲದೆ ಚಟುವಟಿಕೆಯಿಂದ ನಿಮ್ಮನ್ನು ತೆಗೆದುಹಾಕಲಾಗಬಹುದು."}
            </p>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
            />
            <span>
              {lang === "en" ? "I have read, understood, and agree to the Terms & Conditions and take full personal responsibility for my participation." : "ನಾನು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಓದಿ, ಅರ್ಥಮಾಡಿಕೊಂಡು, ಈ ಚಟುವಟಿಕೆಯಲ್ಲಿ ನನ್ನ ಭಾಗವಹಿಸುವಿಕೆಗೆ ಸಂಪೂರ್ಣ ವೈಯಕ್ತಿಕ ಹೊಣೆಗಾರಿಕೆಯನ್ನು ಒಪ್ಪುತ್ತೇನೆ."}
            </span>
          </label>

          {/* Example submit button */}
          <button
            disabled={!accepted}
            className={`px-4 py-2 rounded-md text-white ${accepted ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={()=>{
                navigate("/scanPayment")
              }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

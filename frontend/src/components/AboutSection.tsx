import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";
import Navbar from "./Navbar";
import {ArrowLeft,} from "lucide-react";
import { Link } from "react-router-dom";
import person2 from "@/assets/person1.jpg";
import person3 from "@/assets/person2.jpg";
import person1 from "@/assets/person3.jpg";
import person4 from "@/assets/person4.jpg";
import person5 from "@/assets/person5.jpg";
import person6 from "@/assets/person6.jpg";
import person7 from "@/assets/person7.jpg";
import person8 from "@/assets/person8.jpg";

const trustedPeople = [
  {
    name: "Youth Hostels Association of India (YHAI)",
    role: "Associated Partner",
    image: person1,
  },
  {
    name: "Dr. Lekhanaraj",
    role: "President",
    image: person3,
  },
  {
    name: "Radha himantaraju",
    role: "Secretary",
    image: person5,
  },
  {
    name: "Himantaraju G",
    role: "Trusty",
    image: person2,
  },
  {
    name : "Bharathraju S B",
    role : "Trusty",
    image : person4,

  },
  {
    name : "Dr. Girish L P",
    role : "Trusty",
    image : person6,

  },
  {
    name : "Akshaya kumari N",
    role : "Trusty",
    image : person7,

  },
  {
    name : "Santosh R",
    role : "Trusty",
    image : person8,

  }
];

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
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
    <section id="about" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="eyebrow">
            {t("whyus")}
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold text-foreground md:text-6xl">
            {t("trst")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("collab")}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustedPeople.map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-3xl border border-border/70 bg-card text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={person.image}
                alt={person.name}
                className={`h-64 w-full bg-muted object-cover transition duration-500 group-hover:scale-[1.03] ${person.role === "Associated Partner" ? "object-contain p-8" : "object-cover"}`}
                
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground">
                  {person.name}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {person.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
    </div>
  );
};

export default AboutSection;
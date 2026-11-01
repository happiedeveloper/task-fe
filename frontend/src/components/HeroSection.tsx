import { motion } from "framer-motion";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/LanguageContext";
import heroVideo from "@/assets/heroVid.mp4";

const HeroSection = () => {
  const { t, lang, toggleLang } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden mb-16">
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 via-secondary/30 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 pt-24">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="inline-flex items-center gap-1 bg-primary/100 px-4 py-1.5 rounded-full text-sm font-semibold">
              <Star className="h-4 w-4" fill="currentColor" /> {t("topRated")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`font-display text-2xl md:text-5xl font-bold text-secondary-foreground leading-tight mb-6`}
          >
            {t("discover")}{" "}
            <span className="text-secondary-foreground" >{t("luxuryCamping")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-secondary-foreground/70 text-lg md:text-xl mb-8 max-w-lg font-body"
          >
            {t("explore")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/booking">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-olive-light font-semibold text-lg px-8 py-6 gap-2">
                {t("bookAdventure")} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button asChild size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 text-lg px-8 py-6">
              <a href="#destinations">{t("exploreDestinations")}</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-6 mt-12"
          >
            <div className="flex items-center gap-2 text-secondary-foreground/60">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-body">{t("exclusive")}</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-foreground/60">
              <Star className="h-5 w-5 text-warm-gold" fill="currentColor" />
              <span className="font-body">4.9 Rating</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

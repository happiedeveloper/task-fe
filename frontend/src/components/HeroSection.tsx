import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/LanguageContext";
import heroVideo from "@/assets/heroVid.mp4";

const HeroSection = () => {
  const { t, lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-secondary text-secondary-foreground">
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/75 to-secondary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/55 via-transparent to-secondary/20" />
      </div>

      <div className="container mx-auto max-w-7xl px-6 pb-24 pt-32 md:pb-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-black/10 backdrop-blur-md">
            <Star className="h-4 w-4 text-primary" fill="currentColor" aria-hidden="true" />
            {t("topRated")}
          </div>

          <h1 className={"max-w-5xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-8xl " + (lang === "kn" ? "lg:text-7xl" : "")}>
            {t("discover")}{" "}
            <span className="text-primary">{t("luxuryCamping")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
            {t("explore")}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-xl shadow-black/20 transition-transform hover:-translate-y-0.5 hover:bg-olive-light sm:text-lg"
            >
              <Link to="/booking">
                {t("bookAdventure")}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-white/30 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white sm:text-lg"
            >
              <a href="#destinations">{t("exploreDestinations")}</a>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>{t("exclusive")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" fill="currentColor" aria-hidden="true" />
              <span>4.9 Rating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

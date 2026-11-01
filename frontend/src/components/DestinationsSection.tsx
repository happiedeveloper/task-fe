import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/LanguageContext";

import destLake from "@/assets/Adv sports.jpg";
import documentriess from "@/assets/documentriess.jpg";
import publications from "@/assets/publications.jpg";

const destinations = [
  { title: "Adventure Sports", rating: 4.9, image: destLake },
  { title: "Publications", rating: 4.8, image: publications },
  { title: "Documentaries", rating: 4.8, image: documentriess },
];

const DestinationsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="destinations" className="scroll-mt-24 bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-olive">
              <span className="h-px w-7 bg-primary" aria-hidden="true" />
              {t("ourDestinations")}
            </span>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t("findEscape")}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("handpicked")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest, index) => (
            <motion.article
              key={dest.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-secondary shadow-lg shadow-secondary/10"
            >
              <img
                src={dest.image}
                alt={dest.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
              <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-secondary/35 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
                <Star className="h-4 w-4 text-primary" fill="currentColor" aria-hidden="true" />
                {dest.rating}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {dest.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;

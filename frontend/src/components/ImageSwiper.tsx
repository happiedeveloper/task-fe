import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/LanguageContext";
import SwiperComponent from "@/components/ui/Swiper";
import image1 from "@/Gallery/image1.jpg";
import image2 from "@/Gallery/video2.mp4";
import image3 from "@/Gallery/video3.mp4";
import image4 from "@/Gallery/video4.mp4";
import image5 from "@/Gallery/image5.jpg";
import image6 from "@/Gallery/video6.mp4";
import image7 from "@/Gallery/video7.mp4";
import image8 from "@/Gallery/image8.jpg";
// import image9 from "@/Gallery/9.mp4";
// import image10 from "@/Gallery/10.mp4";


const docs = [
  {url : image1, type: "image", title: "Image"},
  {url : image2, type: "video", title: "Video"},
  {url : image3, type: "video", title: "Video"},
  {url : image4, type: "video", title: "Video"},
  {url : image5, type: "image", title: "Image"},
  {url : image6, type: "video", title: "Video"},
  {url : image7, type: "video", title: "Video"},
  {url : image8, type: "image", title: "Image"},
  // {url : image9, type: "video", title: "Video"},
  // {url : image10, type: "video", title: "Video"},
]

const ImageSwiper = () => {
  const { t, toggleLang, lang } = useLanguage();
  return (
    <section id="gallery" className="mb-16 bg-background py-10 md:mb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className="font-display text-4xl font-bold text-foreground md:text-6xl">
            {t("ourGallery")}
          </h2>
        </motion.div>

        <div className="gallery">
          <SwiperComponent docs={docs} />
        </div>
      </div>
    </section>
  );
};

export default ImageSwiper;

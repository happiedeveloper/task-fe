import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg"
import { useLanguage } from "../LanguageContext";


const Navbar = () => {
  const { t, toggleLang, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("home"), path: "/" },
    { label: t("destinations"), path: "/#destinations" },
    { label: t("contact"), path: "/#contact" },
  ];

  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${location.pathname.includes("booking") || location.pathname.includes("admin") || location.pathname.includes("terms&conditions") ? "bg-secondary/95 backdrop-blur-md border-b border-secondary" : scrolled ? "bg-secondary/95 backdrop-blur-md border-b border-secondary" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-12 w-12 text-primary" style={{ borderRadius: 8, }} />
          <div className="flex flex-col -mt-1">
            <div>
            <span className={`font-display sm:text-lg md:text-lg font-bold text-secondary-foreground`} style={{paddingBottom : 0}}>{t("title")}</span>  
            <span className="font-display sm:text-lg md:text-lg font-bold" style={{color: "orange",}}>®</span> <br />
            </div>
            <span   className={`font-display font-bold 
  bg-gradient-to-r from-lime-200 via-green-300 to-emerald-300 
  bg-clip-text text-transparent ${lang === "en" ? "pl-[50px]" : "pl-[50px]"} md:pl-[70px]`}
  style={{fontSize : 12, paddingTop : 0, marginTop : -3}}
>
{t("subtitle")}</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className="text-secondary-foreground/80 hover:text-primary transition-colors font-medium text-sm tracking-wide uppercase"
            >
              {link.label}
            </a>

          ))}
          <Link to="/about" className="text-secondary-foreground/80 hover:text-primary transition-colors font-medium text-sm tracking-wide uppercase"
            >
            {t("about")}
          </Link>
          <Link to="/admin" className="text-secondary-foreground/80 hover:text-primary transition-colors font-medium text-sm tracking-wide uppercase">
            {t("admin")}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" onClick={toggleLang}>
            {lang === "en" ? "ಕನ್ನಡ" : "English"}
          </Button>
        </div>

        <button className="md:hidden text-secondary-foreground  bg-gradient-to-r from-lime-500 via-green-500 to-emerald-400 p-1" style={{borderRadius : 8}} onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-secondary border-t border-secondary px-4 pb-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              className="block py-3 text-secondary-foreground/80 hover:text-primary font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/about" className="block py-3 text-secondary-foreground/80 hover:text-primary font-medium">
            {t("about")}
          </Link>
          <Link to="/admin" className="block py-3 text-secondary-foreground/80 hover:text-primary font-medium" onClick={() => setOpen(false)}>
            {t("admin")}
          </Link>
          <Button variant="outline" className="w-full mt-2" onClick={() => { toggleLang(); setOpen(false); }}>
            {lang === "en" ? "ಕನ್ನಡ" : "English"}
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

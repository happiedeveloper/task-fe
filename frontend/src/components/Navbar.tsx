import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";
import { useLanguage } from "../LanguageContext";

const Navbar = () => {
  const { t, toggleLang, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const surface = isHome && !scrolled
    ? "bg-secondary/25 backdrop-blur-sm"
    : "border-b border-white/10 bg-secondary/85 shadow-lg shadow-black/5 backdrop-blur-xl";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("home"), path: "/" },
    { label: t("destinations"), path: "/#destinations" },
    { label: t("contact"), path: "/#contact" },
  ];

  const linkClass = "rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <nav aria-label="Primary navigation" className={"fixed inset-x-0 top-0 z-50 transition-all duration-300 " + surface}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label={t("title") + " home"}>
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-white/20"
          />
          <span className="min-w-0">
            <span className="flex items-center gap-1 font-sans text-lg font-bold tracking-[0.12em] text-white">
              {t("title")}
              <span className="text-sm text-primary">®</span>
            </span>
            <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
              {t("subtitle")}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a key={link.path} href={link.path} className={linkClass}>
              {link.label}
            </a>
          ))}
          <Link to="/about" className={linkClass}>
            {t("about")}
          </Link>
          <Link
            to="/admin"
            className="ml-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-primary/70 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("admin")}
          </Link>
        </div>

        <div className="hidden md:block">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLang}
            className="rounded-full border-white/20 bg-white/5 px-4 text-white hover:bg-white/10 hover:text-white"
          >
            {lang === "en" ? "ಕನ್ನಡ" : "English"}
          </Button>
        </div>

        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" className="border-t border-white/10 bg-secondary/95 px-5 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="rounded-xl px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/about"
              className="rounded-xl px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              to="/admin"
              className="rounded-xl px-3 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {t("admin")}
            </Link>
            <Button
              variant="outline"
              className="mt-2 w-full rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                toggleLang();
                setOpen(false);
              }}
            >
              {lang === "en" ? "ಕನ್ನಡ" : "English"}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

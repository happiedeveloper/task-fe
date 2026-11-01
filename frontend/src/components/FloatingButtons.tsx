import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const FloatingButtons = () => {
  const [showTop, setShowTop] = useState(false);

  // Show arrow only after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      <a
        href="https://wa.me/9483757077"  
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-6 h-6 fill-white"
        >
          <path d="M16 .4C7.2.4 0 7.6 0 16.4c0 2.9.8 5.7 2.3 8.1L0 32l7.7-2.3c2.3 1.3 4.9 2 7.6 2 8.8 0 16-7.2 16-16S24.8.4 16 .4zM16 29c-2.4 0-4.8-.6-6.8-1.8l-.5-.3-4.6 1.4 1.5-4.5-.3-.5C3.8 21.2 3 18.8 3 16.4 3 9.8 9.4 3.4 16 3.4s13 6.4 13 13S22.6 29 16 29zm7.4-9.9c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2s-1 1.2-1.2 1.5c-.2.2-.4.3-.8.1-2.3-1.2-3.9-2.1-5.4-4.8-.4-.6.4-.6 1.2-2 .1-.2.1-.4 0-.6s-.9-2.3-1.2-3.1c-.3-.8-.6-.7-.9-.7h-.8c-.3 0-.7.1-1 .5s-1.4 1.3-1.4 3.1 1.4 3.5 1.6 3.8c.2.3 2.8 4.3 6.9 6 .9.4 1.6.6 2.1.8.9.3 1.8.3 2.4.2.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5z"/>
        </svg>
      </a>

      {showTop && (
        <button
          onClick={scrollToTop}
          className="bg-primary hover:bg-primary/80 text-white p-3 rounded-full shadow-lg transition"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
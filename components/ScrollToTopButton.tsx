import { useState, useEffect } from "react";

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      <button
        onClick={scrollToTop}
        className={`scroll-to-top-button ${isVisible ? "visible" : ""}`}
      >
        ↑
      </button>
      <style jsx>{`
        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
        }
        .scroll-to-top-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 20px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.1s ease-in-out, visibility 0.5s ease-in-out;
        }
        .scroll-to-top-button.visible {
          opacity: 1;
          visibility: visible;
        }
        .scroll-to-top-button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

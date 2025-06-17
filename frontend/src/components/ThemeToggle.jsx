import React, { useState, useEffect } from "react";
import "./ThemeToggle.scss";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-theme");
    } else {
      root.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  return (
    <button
      className={`theme-toggle ${isDarkMode ? "dark" : "light"}`}
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb"></div>
        <svg
          className="theme-toggle-icon sun"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 1V3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 21V23"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.22 4.22L5.64 5.64"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.36 18.36L19.78 19.78"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 12H3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 12H23"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.22 19.78L5.64 18.36"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.36 5.64L19.78 4.22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className="theme-toggle-icon moon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.7433 21.1181 10.0748 20.7461C8.40627 20.3741 6.87256 19.5345 5.64818 18.3201C4.42381 17.1057 3.57331 15.5787 3.1891 13.9136C2.8049 12.2485 2.90207 10.503 3.46932 8.89239C4.03658 7.28173 5.04979 5.86652 6.39297 4.81379C7.73615 3.76106 9.35454 3.11386 11.054 3C9.53169 4.99707 9.0383 7.55085 9.74804 9.89828C10.4578 12.2457 12.2951 14.0823 14.642 14.7916C16.9889 15.5009 19.5424 15.0071 21.54 13.484"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggle;

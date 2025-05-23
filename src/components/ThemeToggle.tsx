"use client";

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    // On component mount, check if theme preference exists or default to dark
    const isDarkMode = localStorage.getItem('theme') === 'light' ? false : 
      (localStorage.getItem('theme') === 'dark' ? true :
      (window.matchMedia('(prefers-color-scheme: dark)').matches || true));
    
    setDarkMode(isDarkMode);
    
    // Apply the theme class to html
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      
      // Store preference
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      // Toggle class
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newMode;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
      title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
    >
      {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
    </button>
  );
} 
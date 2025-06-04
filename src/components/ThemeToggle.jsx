import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label={t('theme.toggle')}
        title={t('theme.toggle')}
      >
        {theme === 'light' ? (
          <span className="theme-icon">🌙 {t('theme.dark')}</span>
        ) : (
          <span className="theme-icon">☀️ {t('theme.light')}</span>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
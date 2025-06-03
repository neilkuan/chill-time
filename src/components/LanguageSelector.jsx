import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSelector.css';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Store the language preference in localStorage
    localStorage.setItem('i18nextLng', lng);
    // Update the HTML lang attribute
    document.documentElement.setAttribute('lang', lng);
  };

  return (
    <div className="language-selector">
      <div className="language-selector-container">
        <span className="language-label">{t('language.selector')}:</span>
        <div className="language-buttons">
          <button
            className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            {t('language.en')}
          </button>
          <button
            className={`language-btn ${i18n.language === 'ja' ? 'active' : ''}`}
            onClick={() => changeLanguage('ja')}
          >
            {t('language.ja')}
          </button>
          <button
            className={`language-btn ${i18n.language === 'zh-TW' ? 'active' : ''}`}
            onClick={() => changeLanguage('zh-TW')}
          >
            {t('language.zh-TW')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
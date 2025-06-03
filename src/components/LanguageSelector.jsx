import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (event) => {
    const lng = event.target.value;
    i18n.changeLanguage(lng);
    // Store the language preference in localStorage
    localStorage.setItem('i18nextLng', lng);
    // Update the HTML lang attribute
    document.documentElement.setAttribute('lang', lng);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select">{t('language.selector')}:</label>
      <select 
        id="language-select"
        value={i18n.language} 
        onChange={changeLanguage}
      >
        <option value="en">{t('language.en')}</option>
        <option value="ja">{t('language.ja')}</option>
        <option value="zh-TW">{t('language.zh-TW')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
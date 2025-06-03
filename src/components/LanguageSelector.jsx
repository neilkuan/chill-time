import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  
  // Change language handler
  const changeLanguage = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    // Store the selected language in localStorage
    localStorage.setItem('i18nextLng', newLanguage);
  };

  // Apply the selected language to HTML lang attribute
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return (
    <div className="language-selector">
      <label htmlFor="language-select">{t('language.selector')}: </label>
      <select 
        id="language-select" 
        onChange={changeLanguage} 
        value={i18n.language}
      >
        <option value="en">{t('language.en')}</option>
        <option value="ja">{t('language.ja')}</option>
        <option value="zh-TW">{t('language.zh-TW')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
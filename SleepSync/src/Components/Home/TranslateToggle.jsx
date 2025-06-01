import React, { useEffect } from 'react';

const TranslateToggle = () => {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      const container = document.getElementById('google_translate_element');
      if (!container || container.children.length > 0) return; 
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,zh-CN',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div className="translate-toggle">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default TranslateToggle;

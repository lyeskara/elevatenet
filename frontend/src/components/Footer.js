import React, { useEffect } from 'react';

function Footer() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <footer>
      
      <div id="google_translate_element"></div>
    </footer>
  );
}

export default Footer;

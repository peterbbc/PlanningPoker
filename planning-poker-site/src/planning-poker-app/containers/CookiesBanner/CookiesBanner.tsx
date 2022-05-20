import { Button } from '../../../packages/react-base';
import React, { useEffect, useState } from 'react';

import styles from './CookiesBanner.module.scss';

export const CookiesBanner = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isAutomated = navigator?.webdriver;

    if (!isAutomated && window.localStorage) {
      if (!window.localStorage.getItem('cookies-banner-disabled')) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleBannerDismiss = () => {
    window.localStorage.setItem('cookies-banner-disabled', 'true');
    setIsOpen(false);
  };

  const className = styles.banner;

  if (!isOpen) return null;

  return (
    <div className={className}>
      <p>
        We use cookies to improve user experience, personalized content, and
        analyze website traffic. For these reasons, we may share your site usage
        data with our analytics partners. By clicking “Accept Cookies”, you
        consent to store on your device all the technologies described in our{' '}
        <a href="/cookie-policy" target="_blank">
          Cookie Policy
        </a>
        . Please read our{' '}
        <a href="/legal-notice" target="_blank">
          Legal notice
        </a>{' '}
        and{' '}
        <a href="/privacy-policy" target="_blank">
          Privacy Policy
        </a>{' '}
        for full details.
      </p>
      <Button
        onClick={handleBannerDismiss}
        className="notranslate"
        translate="no"
      >
        Accept Cookies
      </Button>
    </div>
  );
};

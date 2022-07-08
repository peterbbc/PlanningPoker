import React, { useEffect, useState } from 'react';

import { throttle } from 'lodash';
import styles from './BackToTopButton.module.scss';

export const BackToTopButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      setIsScrolled(
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20,
      );
    }, 50);

    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  const handleClick = () => {
    window.scroll({ top: 0 });
  };

  if (!isScrolled) return null;

  return (
    <button className={styles.backToTopButton} onClick={handleClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.80352 12.0347C6.39713 11.6362 6.39909 10.9811 6.80785 10.585L11.0851 6.44028C11.1301 6.39665 11.1782 6.35802 11.2286 6.3244C11.4114 6.12501 11.6741 6 11.9659 6C12.2577 6 12.5204 6.12501 12.7032 6.32441C12.7536 6.35802 12.8016 6.39665 12.8467 6.44028L17.1239 10.585C17.5327 10.9811 17.5346 11.6362 17.1283 12.0347C16.7363 12.4191 16.1093 12.421 15.7151 12.0389L12.9659 9.37495V21C12.9659 21.5523 12.5182 22 11.9659 22C11.4136 22 10.9659 21.5523 10.9659 21V9.37495L8.21672 12.0389C7.82245 12.421 7.19551 12.4191 6.80352 12.0347Z"
          fill="white"
        />
        <rect x="5" y="2" width="14" height="2" rx="1" fill="white" />
      </svg>
    </button>
  );
};

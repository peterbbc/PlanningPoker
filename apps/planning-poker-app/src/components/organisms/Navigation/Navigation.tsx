import React from 'react';

import { Header } from '../Header/Header';

interface NavigationProps {
  title?: React.ReactNode;
  isHome?: boolean;
  isMinimal?: boolean;
  isShowShadowOnScrolled?: boolean;
}

export const Navigation = ({
  title,
  isHome,
  isMinimal,
  isShowShadowOnScrolled,
}: NavigationProps) => {
  return (
    <Header
      title={title}
      isHome={isHome}
      isMinimal={isMinimal}
      isShowShadowOnScrolled={isShowShadowOnScrolled || isHome}
    />
  );
};

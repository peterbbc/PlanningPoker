import React, { ReactNode } from 'react';

import './Layout.scss';
import { AppWrapper } from '../../../spaces/app/AppWrapper';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <AppWrapper>{children}</AppWrapper>;
};

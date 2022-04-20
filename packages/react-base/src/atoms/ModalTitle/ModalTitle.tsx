import React from 'react';
import { VerticalSpacing } from '../spacings/VerticalSpacing/VerticalSpacing';
import { Header4 } from '../text/Header4/Header4';

interface ModalTitleProps {
  children: React.ReactNode;
}

export const ModalTitle = ({ children }: ModalTitleProps) => {
  return (
    <>
      <Header4>{children}</Header4>
      <VerticalSpacing spacing="spacing-xxl" />
    </>
  );
};

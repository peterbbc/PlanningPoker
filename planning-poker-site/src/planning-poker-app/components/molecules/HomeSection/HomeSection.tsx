import React, { ReactNode } from 'react';
import cx from 'classnames';

import styles from './HomeSection.module.scss';

import {
  Header3,
  Paragraph,
  VerticalSpacing,
  HoritzontalSpacing,
  Container,
} from '../../../../packages/react-base';

interface HomeSectionProps {
  textPosition: 'left' | 'right';
  isIphone?: boolean;
  title: string;
  text: ReactNode;
  mockupSrc: string;
  mockupSrcFallback: string;
  mockupAspectRatio: string;
}

export const HomeSection = ({
  textPosition,
  title,
  text,
  mockupSrc,
  mockupSrcFallback,
  mockupAspectRatio,
  isIphone,
}: HomeSectionProps) => {
  return (
    <Container
      className={cx(
        styles['home-section'],
        styles[`home-section--${textPosition}`],
        isIphone && styles[`home-section--iphone`],
      )}
    >
      <div className={styles['text']}>
        <Header3>{title}</Header3>
        <VerticalSpacing spacing="spacing-l" spacingXL="spacing-s" />
        <Paragraph color="grey600">{text}</Paragraph>
      </div>
      <HoritzontalSpacing
        spacing="spacing-xxl-2"
        className={styles['spacer']}
      />
      <div className={styles['mockup']}>
        <picture title={title} style={{ aspectRatio: mockupAspectRatio }}>
          <source id="s1" srcSet={mockupSrc} type="image/webp" />
          <source id="s2" srcSet={mockupSrcFallback} type="image/jpg" />
          <img
            style={{ aspectRatio: mockupAspectRatio }}
            src={mockupSrcFallback}
            alt={title}
          />
        </picture>
      </div>
    </Container>
  );
};

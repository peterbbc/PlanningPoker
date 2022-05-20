import {
  ButtonLink,
  Header4,
  Paragraph,
  VerticalSpacing,
} from '../../../../packages/react-base';
import React from 'react';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import { Link } from '../../atoms/Link/Link';
import { LogoWay } from '../../atoms/LogoWay/LogoWay';
import { Wave } from '../../atoms/Wave/Wave';

import styles from './Footer.module.scss';

export const Footer = () => {
  const { pricingModal, contactModal } = useAppContext();
  return (
    <footer className={styles['footer']}>
      <Wave color="black" className={styles['wave']} />
      <div className={styles['content']}>
        <div>
          <LogoWay isLight />
        </div>
        <div className={styles['sections']}>
          <div>
            <Header4 color="white">Product</Header4>
            <VerticalSpacing spacing="spacing-l" />
            <Link to="/new-game">
              <ButtonLink fontWeight="normal" buttonColor="grey500">
                Start new game
              </ButtonLink>
            </Link>
            <VerticalSpacing spacing="spacing-m" />
            <Link to="/faqs">
              <ButtonLink fontWeight="normal" buttonColor="grey500">
                FAQs
              </ButtonLink>
            </Link>
            <VerticalSpacing spacing="spacing-m" />
            <ButtonLink
              onClick={() => pricingModal[1](true)}
              fontWeight="normal"
              buttonColor="grey500"
            >
              Pricing
            </ButtonLink>
            <VerticalSpacing spacing="spacing-m" />
            <a
              href="https://planningpokeronline.com/terms-and-conditions"
              target="_blank"
            >
              <ButtonLink fontWeight="normal" buttonColor="grey500">
                Terms
              </ButtonLink>
            </a>
          </div>
          <div>
            <Header4 color="white">Connect</Header4>
            <VerticalSpacing spacing="spacing-l" />
            <ButtonLink
              onClick={() => contactModal[1](true)}
              fontWeight="normal"
              buttonColor="grey500"
            >
              Contact us
            </ButtonLink>
            <VerticalSpacing spacing="spacing-m" />
            <a
              href="https://www.linkedin.com/company/planning-poker-online-scrum"
              target="_blank"
            >
              <ButtonLink fontWeight="normal" buttonColor="grey500">
                LinkedIn
              </ButtonLink>
            </a>
          </div>
          <div>
            <Header4 color="white">Legal</Header4>
            <VerticalSpacing spacing="spacing-l" />
            <a
              href="https://planningpokeronline.com/legal-notice/"
              target="_blank"
            >
              <ButtonLink fontWeight="normal" buttonColor="grey500">
                Legal notice
              </ButtonLink>
            </a>
            <VerticalSpacing spacing="spacing-l" />
            <a
              href="https://planningpokeronline.com/cookie-policy/"
              target="_blank"
            >
              <ButtonLink fontWeight="normal" buttonColor="grey500">
                Cookie policy
              </ButtonLink>
            </a>
            <VerticalSpacing spacing="spacing-l" />
            <a
              href="https://planningpokeronline.com/privacy-policy/"
              target="_blank"
            >
              <ButtonLink fontWeight="normal" buttonColor="grey500">
                Privacy policy
              </ButtonLink>
            </a>
          </div>
        </div>
      </div>
      <VerticalSpacing spacing="spacing-xxl-4" />
      <Paragraph align="center" color="grey500" size="small">
        We Agile You ®
      </Paragraph>
      <VerticalSpacing spacing="spacing-xxl-4" />
      <VerticalSpacing spacing="spacing-xxl-4" />
    </footer>
  );
};

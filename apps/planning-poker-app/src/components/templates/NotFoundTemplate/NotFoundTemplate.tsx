import {
  Button,
  Container,
  Header2,
  HoritzontalSpacing,
  Paragraph,
  VerticalSpacing,
  FlexBox,
} from '@we-agile-you/react-base';
import React from 'react';
import { Link } from '../../atoms/Link/Link';
import { RobotImage } from '../../atoms/RobotImage/RobotImage';
import { Navigation } from '../../organisms/Navigation/Navigation';

import titleImage from './title.svg';
import styles from './NotFoundTemplate.module.scss';

export const NotFoundTemplate = () => {
  return (
    <>
      <Navigation title="Planning Poker Online" isMinimal />

      <Container>
        <VerticalSpacing spacing="spacing-xxl-4" />
        <VerticalSpacing spacing="spacing-xxl-4" />
        <FlexBox justifyContent="center" wrapElements>
          <div className={styles['text-block']}>
            <img src={titleImage} alt="404" />
            <VerticalSpacing spacing="spacing-xxl" />
            <Header2>Page Not Found</Header2>
            <VerticalSpacing spacing="spacing-s" />
            <Paragraph>
              Sorry, we can’t find what you are looking for.
            </Paragraph>
            <VerticalSpacing spacing="spacing-xxl" />
            <Link to="/">
              <Button isBlock>Go Back</Button>
            </Link>
          </div>
          <HoritzontalSpacing spacing="spacing-xxl-4" />
          <HoritzontalSpacing spacing="spacing-xxl-4" />
          <RobotImage image="404" className={styles['robot-image']} />
        </FlexBox>
      </Container>
    </>
  );
};

import {
  FREEMIUM_ISSUES_VOTED_LIMIT,
  FREEMIUM_VOTING_LIMIT,
} from '@we-agile-you/constants-planning-poker';
import { Paragraph, Span } from '@we-agile-you/react-base';
import React from 'react';

import styles from './Features.module.scss';
import { FeatureItem } from './FeaturItem/FeatureItem';

export const BasicFeatures = () => {
  return (
    <div className={styles.label}>
      <FeatureItem>
        <Paragraph color="grey600" fontWeight="bold">
          Unlimited players
        </Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">
          <Span spanStyle="bold" color="grey600">
            {FREEMIUM_VOTING_LIMIT}
          </Span>{' '}
          Votings per game
        </Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">
          <Span spanStyle="bold" color="grey600">
            {FREEMIUM_ISSUES_VOTED_LIMIT}
          </Span>{' '}
          Issues voted per game
        </Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">JIRA integration</Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">Import issues from CSV</Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">
          Unlimited games for{' '}
          <Span tooltip="After 6 weeks of active playing, games will start to get blocked. At that time you can start a free trial of 15 days more to ensure our premium version suits you before purchasing.">
            6 weeks
          </Span>
        </Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">Permanent game urls</Paragraph>
      </FeatureItem>
    </div>
  );
};

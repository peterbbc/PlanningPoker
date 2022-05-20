import { Paragraph, Span } from '../../../../../packages/react-base';
import React from 'react';
import { FeatureItem } from './FeaturItem/FeatureItem';

export const PremiumFeatures = () => {
  return (
    <div>
      <FeatureItem>
        <Paragraph color="grey600">
          <Span spanStyle="bold" color="grey600">
            Unlimited
          </Span>{' '}
          Votings per game
        </Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">
          <Span spanStyle="bold" color="grey600">
            Unlimited
          </Span>{' '}
          Issues voted per game
        </Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">
          Access your created games and history. Resume games at any time.
        </Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">
          Add or remove facilitators at any time
        </Paragraph>
      </FeatureItem>
      <FeatureItem>
        <Paragraph color="grey600">Cancel at any time</Paragraph>
      </FeatureItem>
    </div>
  );
};

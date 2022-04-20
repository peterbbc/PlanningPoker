import React from 'react';
import { Span } from '@we-agile-you/react-base';

interface CrownProps {
  type: 'user' | 'game';
}

export const Crown = ({ type }: CrownProps) => {
  return (
    <Span
      hideUnderline
      tooltip={type === 'game' ? 'Premium game' : 'Premium user'}
    >
      <span role="img" aria-label="crown">
        👑
      </span>
    </Span>
  );
};

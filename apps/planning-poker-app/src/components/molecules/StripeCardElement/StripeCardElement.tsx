import { CardElement, CardElementProps } from '@stripe/react-stripe-js';
import React from 'react';
import cx from 'classnames';

import styles from './StripeCardElement.module.scss';

interface StripeCardElementProps extends CardElementProps {
  isError?: boolean;
}

export const StripeCardElement = ({
  onChange,
  options,
  isError,
}: StripeCardElementProps) => {
  return (
    <div className={cx(styles.wrapper, isError && styles['wrapper--error'])}>
      <CardElement
        onChange={onChange}
        options={{
          style: {
            base: {
              fontSize: '16px',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              color: '#1a2935',
              '::placeholder': {
                color: '#a8aeb2',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
          hidePostalCode: true,
          ...options,
        }}
      />
    </div>
  );
};

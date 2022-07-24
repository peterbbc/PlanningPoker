import React from 'react';
import cx from 'classnames';

import styles from './InlineAlert.module.scss';
import { Paragraph } from '../../atoms/text/Paragraph/Paragraph';
import { HoritzontalSpacing } from '../../atoms/spacings/HoritzontalSpacing/HoritzontalSpacing';
import { VerticalSpacing } from '../../atoms/spacings/VerticalSpacing/VerticalSpacing';
import { FlexBox } from '../../atoms/FlexBox/FlexBox';
import { Icon } from '../../atoms/Icon/Icon';

interface InlineAlertProps {
  title?: React.ReactNode;
  onClick?: () => void;
  content: React.ReactNode;
  style?: 'danger' | 'info' | 'success';
  size?: 'body' | 'small';
}

export const InlineAlert = ({
  title,
  content,
  onClick,
  ...props
}: InlineAlertProps) => {
  const style = props.style || 'danger';
  const size = props.size || 'body';

  return (
    <FlexBox
      className={cx(
        styles['inline-alert'],
        styles[`inline-alert--${style}`],
        !!onClick && styles[`inline-alert--clickable`],
      )}
      alignItems="start"
      onClick={onClick}
    >
      <div>
        <Paragraph color={style}>
          <Icon icon="alert" />
        </Paragraph>
      </div>
      <HoritzontalSpacing spacing="spacing-m" />
      <div>
        {title && (
          <>
            <Paragraph color={style} fontWeight="bold" size={size}>
              {title}
            </Paragraph>
            <VerticalSpacing spacing="spacing-xxs" />
          </>
        )}
        <Paragraph color={style} size={size}>
          {content}
        </Paragraph>
      </div>
      <HoritzontalSpacing spacing="spacing-m" />
    </FlexBox>
  );
};

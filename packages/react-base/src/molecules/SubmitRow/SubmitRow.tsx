import { Button } from '@we-agile-you/react-base';
import cx from 'classnames';
import React, { ReactNode } from 'react';
import { HoritzontalSpacing } from '../../atoms/spacings/HoritzontalSpacing/HoritzontalSpacing';

import styles from './SubmitRow.module.scss';

interface SubmitRowProps {
  isDanger?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onConfirm?: () => void;
  form?: string;
  onCancel?: () => void;
  align?: 'strech' | 'block' | 'center' | 'right';
  cancelButtonRef?: React.Ref<HTMLButtonElement>;
}
export const SubmitRow = ({
  isDanger,
  isLoading,
  isDisabled,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  cancelButtonRef,
  form,
  ...props
}: SubmitRowProps) => {
  const align = props.align || 'block';

  return (
    <div className={cx(styles['submit-row'], styles[`submit-row--${align}`])}>
      <div className={styles['cancel']}>
        {!isLoading && cancelLabel && (
          <Button
            buttonStyle="tertiary"
            onClick={onCancel}
            ref={cancelButtonRef}
            isBlock={props.align === 'strech'}
          >
            {cancelLabel}
          </Button>
        )}
      </div>
      <div className={styles['spacer']}>
        <HoritzontalSpacing spacing="spacing-m" />
      </div>
      <div className={styles['confirm']}>
        {confirmLabel && (
          <Button
            buttonType="submit"
            buttonColor={isDanger ? 'danger' : 'primary'}
            isLoading={isLoading}
            isDisabled={isDisabled}
            onClick={onConfirm}
            form={form}
            isBlock={props.align === 'strech'}
          >
            {confirmLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

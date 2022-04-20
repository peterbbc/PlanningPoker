import React from 'react';
import cx from 'classnames';

import { Span } from '../../atoms/text/Span/Span';
import styles from './Stepper.module.scss';

type Step = { value: string; label: string; isClickable?: boolean };
interface StepperProps {
  steps: Step[];
  activeStep: string;
  onClickStep: (value: string) => void;
}

export const Stepper = ({ steps, activeStep, onClickStep }: StepperProps) => {
  const activeStepIndex = steps.findIndex((step) => step.value === activeStep);

  return (
    <div className={styles['stepper']}>
      {steps.map((step, i) => {
        const isClickable = activeStepIndex !== i && step.isClickable;
        return (
          <div
            key={step.value}
            className={cx(
              styles['step'],
              isClickable && styles['step--is-clickable'],
            )}
            onClick={isClickable ? () => onClickStep(step.value) : undefined}
          >
            <div className={styles['ball-line']}>
              <div
                className={cx(
                  styles['line'],
                  i <= activeStepIndex && styles['line--active'],
                  i === 0 && styles['line--transparent'],
                )}
              />
              <div
                className={cx(
                  styles['ball'],
                  i <= activeStepIndex && styles['ball--active'],
                )}
              >
                {i + 1}
              </div>
              <div
                className={cx(
                  styles['line'],
                  i <= activeStepIndex && styles['line--active'],
                  i === steps.length - 1 && styles['line--transparent'],
                )}
              />
            </div>
            <Span
              size="micro"
              spanStyle={activeStepIndex === i ? 'bold' : 'regular'}
              color={i <= activeStepIndex ? 'black' : 'grey500'}
            >
              {step.label}
            </Span>
          </div>
        );
      })}
    </div>
  );
};

import { Paragraph, VerticalSpacing } from '@we-agile-you/react-base';
import React from 'react';

import styles from './FormatedElement.module.scss';
import { FormatedElementType, FormatedTextMode } from './FormatedTextContainer';

type FormatedElementProps = {
  i: number;
  element: FormatedElementType;
  mode: FormatedTextMode;
};

export const FormatedElement = ({ i, element, mode }: FormatedElementProps) => {
  switch (element.type) {
    case 'paragraph':
      return (
        <>
          <Paragraph key={i.toString()}>
            {element.paragraphElements &&
              element.paragraphElements.map((element, j) => (
                <FormatedElement i={j} element={element} mode={mode} />
              ))}
          </Paragraph>
          <VerticalSpacing spacing="spacing-m" />
        </>
      );

    case 'text':
      return <span key={i.toString()}>{element.text}</span>;
    case 'url':
      if (
        mode === 'issue-card' ||
        mode === 'summary-header' ||
        mode === 'url'
      ) {
        return (
          <>
            <a
              onClick={(event) => event.stopPropagation()}
              href={element.url}
              className={styles['link']}
              target="_blank"
              rel="noopener noreferrer"
              key={i.toString()}
            >
              {element.url}
            </a>
          </>
        );
      }
      return <span key={i.toString()}>{element.url}</span>;
  }
};

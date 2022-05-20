import React from 'react';

import { FormatedElement } from './FormatedElement';

export type FormatedTextMode =
  | 'key'
  | 'summary'
  | 'url'
  | 'description'
  | 'issue-card'
  | 'summary-header';

interface FormatedTextContainerProps {
  text: string;
  mode: FormatedTextMode;
}

export type FormatedElementType = {
  type: 'text' | 'url' | 'paragraph';
  url?: string;
  text?: string;
  paragraphElements?: FormatedElementType[];
};

export const FormatedTextContainer = ({
  text,
  mode,
}: FormatedTextContainerProps) => {
  let formatedElements: FormatedElementType[] = [];

  if (!text) return null;

  switch (mode) {
    case 'summary':
    case 'summary-header':
    case 'issue-card':
    case 'url':
    case 'key':
      formatedElements = [...getElementsFromParagraph(text)];
      break;
    case 'description':
      formatedElements = text.split(/\r?\n/).map((paragraph) => {
        return {
          type: 'paragraph',
          paragraphElements: getElementsFromParagraph(paragraph),
        };
      });
      break;
  }

  if (mode === 'summary-header') {
    return (
      <>
        {formatedElements.map((element, i) => (
          <FormatedElement key={i} element={element} i={i} mode={mode} />
        ))}
      </>
    );
  }

  return (
    <div>
      {formatedElements.map((element, i) => (
        <FormatedElement key={i} element={element} i={i} mode={mode} />
      ))}
    </div>
  );
};

const urlPattern = new RegExp(/https?:\/\/\S*/);

const getElementsFromParagraph = (
  paragraphText: string,
): FormatedElementType[] => {
  const urls: string[] = [];
  const formatedElements: FormatedElementType[] = [];
  let remainingText = paragraphText;

  // Get all urls in text
  paragraphText.replace(urlPattern, function (url) {
    urls.push(url);

    return ''; // ts shut up!
  });

  for (const url of urls) {
    const previousText = remainingText.substring(0, remainingText.indexOf(url));
    formatedElements.push({
      type: 'text',
      text: previousText,
    });
    formatedElements.push({
      type: 'url',
      url,
    });
    remainingText = remainingText.replace(previousText, '');
    remainingText = remainingText.replace(url, '');
  }

  formatedElements.push({
    type: 'text',
    text: remainingText,
  });

  return formatedElements;
};

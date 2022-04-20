import { RefObject, useEffect } from 'react';

export const useHandleClickOuside = (
  containerRefs: RefObject<HTMLElement>[],
  cb: () => void,
) => {
  useEffect(() => {
    const handleDocumentClick = (event: Event) => {
      if (
        containerRefs.every(
          (element) =>
            element.current && !element.current.contains(event.target as Node),
        )
      ) {
        cb();
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [cb, containerRefs]);
};

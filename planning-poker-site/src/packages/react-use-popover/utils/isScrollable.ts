export const isScrollable = (element: HTMLElement | Document): boolean => {
  if (!element || element === window.document) return false;
  // Compare the height to see if the element has scrollable content
  element = element as HTMLElement;
  const hasScrollableContent = element.scrollHeight > element.clientHeight;

  // It's not enough because the element's `overflow-y` style can be set as
  // * `hidden`
  // * `hidden !important`
  // In those cases, the scrollbar isn't shown
  const overflowYStyle = window.getComputedStyle(element).overflowY;
  const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1;

  return hasScrollableContent && !isOverflowHidden;
};

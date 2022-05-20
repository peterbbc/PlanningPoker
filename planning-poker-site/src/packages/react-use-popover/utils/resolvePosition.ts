import { POPOVER_MARGIN_FROM_ANCHOR, PRIORITIES } from "../constants";
import { Position, ResolvedPosition } from "../types";

const itFitsAtPosition = (
  position: ResolvedPosition,
  anchorElement: HTMLElement,
  dropdownElement: HTMLElement
): boolean => {
  const anchorClientRect = anchorElement.getBoundingClientRect();
  const dropdownClientRect = dropdownElement.getBoundingClientRect();

  let freeYSpace = 0;

  // Y Coordinate
  switch (position) {
    case "bottom":
    case "bottom-left":
    case "bottom-right":
    case "bottom-window-center":
      freeYSpace =
        window.innerHeight -
        anchorClientRect.top -
        anchorClientRect.height -
        POPOVER_MARGIN_FROM_ANCHOR;
      break;
    case "top":
    case "top-left":
    case "top-right":
      freeYSpace = anchorClientRect.top - POPOVER_MARGIN_FROM_ANCHOR;
      break;
    case "left-top":
    case "right-top":
      freeYSpace = anchorClientRect.top + anchorClientRect.height;
      break;
    case "left-bottom":
    case "right-bottom":
      freeYSpace = window.innerHeight - anchorClientRect.top;
      break;
    case "left":
    case "right":
      const midHeight = anchorClientRect.top + anchorClientRect.height / 2;
      freeYSpace = 2 * Math.min(midHeight, window.innerHeight - midHeight);
      break;
  }

  if (freeYSpace < dropdownClientRect.height) {
    return false;
  }

  let freeXSpace = 0;

  // X Coordinate
  switch (position) {
    case "left":
    case "left-bottom":
    case "left-top":
      freeXSpace = anchorClientRect.left - POPOVER_MARGIN_FROM_ANCHOR;
      break;
    case "right":
    case "right-bottom":
    case "right-top":
      freeXSpace =
        window.innerWidth -
        anchorClientRect.left -
        anchorClientRect.width -
        POPOVER_MARGIN_FROM_ANCHOR;
      break;
    case "top-left":
    case "bottom-left":
      freeXSpace = anchorClientRect.left + anchorClientRect.width;
      break;
    case "top-right":
    case "bottom-right":
      freeXSpace = window.innerWidth - anchorClientRect.left;
      break;
    case "top":
    case "bottom":
      const midWidth = anchorClientRect.left + anchorClientRect.width / 2;
      freeXSpace = 2 * Math.min(midWidth, window.innerWidth - midWidth);
      break;
    case "bottom-window-center":
      freeXSpace = window.innerWidth;
      break;
  }

  return freeXSpace >= dropdownClientRect.width;
};

export const resolvePosition = (
  position: Position,
  anchorElement: HTMLElement,
  dropdownElement: HTMLElement
): ResolvedPosition => {
  for (const priorityPosition of PRIORITIES[position]) {
    if (itFitsAtPosition(priorityPosition, anchorElement, dropdownElement)) {
      return priorityPosition;
    }
  }
  return position;
};

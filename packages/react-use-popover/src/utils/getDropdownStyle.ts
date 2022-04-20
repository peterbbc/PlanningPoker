import { POPOVER_MARGIN_FROM_ANCHOR } from "../constants";
import { ResolvedPosition } from "../types";

export const getDropdownStyle = (
  position: ResolvedPosition,
  anchorElement: HTMLElement,
  marginFromAnchor?: number
): React.CSSProperties => {
  const anchorElementClientRect = anchorElement.getBoundingClientRect();
  const dropdownStyle: React.CSSProperties = {
    position: "fixed",
  };

  const marginFromAcnhorResolved =
    typeof marginFromAnchor === "number"
      ? marginFromAnchor
      : POPOVER_MARGIN_FROM_ANCHOR;

  switch (position) {
    case "bottom":
      dropdownStyle.top =
        anchorElementClientRect.top +
        anchorElementClientRect.height +
        marginFromAcnhorResolved;
      dropdownStyle.left =
        anchorElementClientRect.left + anchorElementClientRect.width / 2;
      dropdownStyle.transform = "translateX(-50%)";
      break;
    case "bottom-left":
      dropdownStyle.top =
        anchorElementClientRect.top +
        anchorElementClientRect.height +
        marginFromAcnhorResolved;
      dropdownStyle.right =
        window.innerWidth -
        anchorElementClientRect.left -
        anchorElementClientRect.width;
      break;
    case "bottom-right":
      dropdownStyle.top =
        anchorElementClientRect.top +
        anchorElementClientRect.height +
        marginFromAcnhorResolved;
      dropdownStyle.left = anchorElementClientRect.left;
      break;
    case "top":
      dropdownStyle.bottom =
        window.innerHeight -
        anchorElementClientRect.top +
        marginFromAcnhorResolved;
      dropdownStyle.left =
        anchorElementClientRect.left + anchorElementClientRect.width / 2;
      dropdownStyle.transform = "translateX(-50%)";
      break;
    case "top-left":
      dropdownStyle.bottom =
        window.innerHeight -
        anchorElementClientRect.top +
        marginFromAcnhorResolved;
      dropdownStyle.right =
        window.innerWidth -
        anchorElementClientRect.left -
        anchorElementClientRect.width;
      break;
    case "top-right":
      dropdownStyle.bottom =
        window.innerHeight -
        anchorElementClientRect.top +
        marginFromAcnhorResolved;
      dropdownStyle.left = anchorElementClientRect.left;
      break;
    case "left":
      dropdownStyle.top =
        anchorElementClientRect.top + anchorElementClientRect.height / 2;
      dropdownStyle.right =
        window.innerWidth -
        anchorElementClientRect.left +
        marginFromAcnhorResolved;
      dropdownStyle.transform = "translateY(-50%)";
      break;
    case "right":
      dropdownStyle.top =
        anchorElementClientRect.top + anchorElementClientRect.height / 2;
      dropdownStyle.left =
        anchorElementClientRect.left +
        anchorElementClientRect.width +
        marginFromAcnhorResolved;
      dropdownStyle.transform = "translateY(-50%)";
      break;
    case "left-bottom":
      dropdownStyle.top = anchorElementClientRect.top;
      dropdownStyle.right =
        window.innerWidth -
        anchorElementClientRect.left +
        marginFromAcnhorResolved;
      break;
    case "left-top":
      dropdownStyle.bottom =
        window.innerHeight -
        anchorElementClientRect.top -
        anchorElementClientRect.height;
      dropdownStyle.right =
        window.innerWidth -
        anchorElementClientRect.left +
        marginFromAcnhorResolved;
      break;
    case "right-bottom":
      dropdownStyle.top = anchorElementClientRect.top;
      dropdownStyle.left =
        anchorElementClientRect.left +
        anchorElementClientRect.width +
        marginFromAcnhorResolved;
      break;
    case "right-top":
      dropdownStyle.bottom =
        window.innerHeight -
        anchorElementClientRect.top -
        anchorElementClientRect.height;
      dropdownStyle.left =
        anchorElementClientRect.left +
        anchorElementClientRect.width +
        marginFromAcnhorResolved;
      break;
    case "bottom-window-center":
      dropdownStyle.top =
        anchorElementClientRect.top +
        anchorElementClientRect.height +
        marginFromAcnhorResolved;
      dropdownStyle.left = window.innerWidth / 2;
      dropdownStyle.transform = "translateX(-50%)";
      break;
  }

  return dropdownStyle;
};

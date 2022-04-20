import { getDropdownStyle } from "./utils/getDropdownStyle";
import { isScrollable } from "./utils/isScrollable";
import { resolvePosition } from "./utils/resolvePosition";
import { Position } from "./types";

import React, { useState, useCallback, useEffect } from "react";

interface useDropdownProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  position?: Position;
  dropdownElement?: HTMLElement | null;
  moveOnScroll?: boolean;
  marginFromAnchor?: number;
}

export const usePopover = ({
  anchorRef,
  dropdownElement,
  moveOnScroll,
  marginFromAnchor,
  ...props
}: useDropdownProps) => {
  const position = props.position || "bottom";
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({
    position: "fixed",
  });

  const updateDropdownPosition = useCallback(() => {
    const anchorElement = anchorRef?.current;
    if (!anchorElement || !dropdownElement) return;

    const resolvedPosition = resolvePosition(
      position,
      anchorElement,
      dropdownElement
    );
    const newDropdownStyle = getDropdownStyle(
      resolvedPosition,
      anchorElement,
      marginFromAnchor
    );

    setDropdownStyle(newDropdownStyle);
  }, [anchorRef, dropdownElement, position]);

  useEffect(() => {
    updateDropdownPosition();
  }, [dropdownElement, position]);

  /* Handle window resize */
  useEffect(() => {
    const handleResize = () => {
      updateDropdownPosition();
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [updateDropdownPosition]);

  /* Handle scrolling at parents  */
  useEffect(() => {
    if (!anchorRef?.current || !moveOnScroll) return;

    let element: HTMLElement = anchorRef.current.parentNode as HTMLElement;
    const scrollableParents: (HTMLElement | Window)[] = [window];

    while (element) {
      if (isScrollable(element)) {
        scrollableParents.push(element);
      }
      element = element.parentNode as HTMLElement;
    }

    for (const element of scrollableParents) {
      element.addEventListener("scroll", updateDropdownPosition);
    }

    return () => {
      for (const element of scrollableParents) {
        element.removeEventListener("scroll", updateDropdownPosition);
      }
    };
  }, [updateDropdownPosition, moveOnScroll]);

  return {
    updateDropdownPosition,
    dropdownStyle,
  };
};

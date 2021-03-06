import { Position, ResolvedPosition } from "./types";

export const POPOVER_MARGIN_FROM_ANCHOR = 8;

type Priorities = { [priority in Position]: ResolvedPosition[] };

export const PRIORITIES: Priorities = {
  "bottom": [
    "bottom",
    "bottom-left",
    "bottom-right",
    "bottom-window-center",
    "top",
    "top-left",
    "top-right",
    "left",
    "left-bottom",
    "left-top",
    "right",
    "right-bottom",
    "right-top",
  ],
  "bottom-left": [
    "bottom-left",
    "bottom",
    "bottom-right",
    "bottom-window-center",
    "top-left",
    "top",
    "top-right",
    "left",
    "left-bottom",
    "left-top",
    "right",
    "right-bottom",
    "right-top",
  ],
  "bottom-right": [
    "bottom-right",
    "bottom",
    "bottom-left",
    "bottom-window-center",
    "top-right",
    "top",
    "top-left",
    "left",
    "left-bottom",
    "left-top",
    "right",
    "right-bottom",
    "right-top",
  ],
  "left": [
    "left",
    "left-bottom",
    "left-top",
    "right",
    "right-bottom",
    "right-top",
    "bottom-right",
    "bottom",
    "bottom-left",
    "bottom-window-center",
    "top",
    "top-left",
    "top-right",
  ],
  "left-top": [
    "left-top",
    "left",
    "left-bottom",
    "right-top",
    "right",
    "right-bottom",
    "bottom-right",
    "bottom",
    "bottom-left",
    "bottom-window-center",
    "top",
    "top-left",
    "top-right",
  ],
  "left-bottom": [
    "left-bottom",
    "left",
    "left-top",
    "right-bottom",
    "right",
    "right-top",
    "bottom-right",
    "bottom",
    "bottom-left",
    "bottom-window-center",
    "top",
    "top-left",
    "top-right",
  ],
  "top": [
    "top",
    "top-left",
    "top-right",
    "bottom",
    "bottom-right",
    "bottom-left",
    "bottom-window-center",
    "left",
    "left-bottom",
    "left-top",
    "right",
    "right-bottom",
    "right-top",
  ],
  "top-left": [
    "top-left",
    "top",
    "top-right",
    "bottom-left",
    "bottom",
    "bottom-right",
    "bottom-window-center",
    "left",
    "left-bottom",
    "left-top",
    "right",
    "right-bottom",
    "right-top",
  ],
  "top-right": [
    "top-right",
    "top",
    "top-left",
    "bottom-right",
    "bottom",
    "bottom-left",
    "bottom-window-center",
    "left",
    "left-bottom",
    "left-top",
    "right",
    "right-bottom",
    "right-top",
  ],
  "right": [
    "right",
    "right-bottom",
    "right-top",
    "left",
    "left-bottom",
    "left-top",
    "bottom-right",
    "bottom",
    "bottom-left",
    "bottom-window-center",
    "top",
    "top-left",
    "top-right",
  ],
  "right-top": [
    "right-top",
    "right",
    "right-bottom",
    "left-top",
    "left",
    "left-bottom",
    "bottom-right",
    "bottom",
    "bottom-left",
    "bottom-window-center",
    "top",
    "top-left",
    "top-right",
  ],
  "right-bottom": [
    "right-bottom",
    "right",
    "right-top",
    "left-bottom",
    "left",
    "left-top",
    "bottom-right",
    "bottom",
    "bottom-left",
    "bottom-window-center",
    "top",
    "top-left",
    "top-right",
  ],
};

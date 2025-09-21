import { Instance } from 'tippy.js';

export interface EventListenerConfig {
  element: HTMLElement;
  type: string;
  listener: EventListener;
}

export interface TooltipState {
  instance: Instance | null;
  resizeObserver: ResizeObserver | null;
  resizeTimeout: ReturnType<typeof setTimeout> | null;
  showTooltipTimeout: ReturnType<typeof setTimeout> | null;
  boundEventListeners: EventListenerConfig[];
}

export const TOOLTIP_CONSTANTS = {
  RESIZE_DEBOUNCE_MS: 150,
  SHOW_TOOLTIP_DELAY_MS: 200,
  HIDE_TOOLTIP_DELAY_MS: 100,
} as const;

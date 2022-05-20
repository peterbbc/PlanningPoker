import { WAYEvent } from '../events';

export const sendGoogleAnalyticsEvent = (event: WAYEvent) => {
  const { id, ...eventProps } = event;
  try {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'custom-event',
        eventId: id,
        ...eventProps,
      });
    }
  } catch (e) {
    console.error(e);
  }
}

declare global {
  interface Window {
    dataLayer: any;
  }
}

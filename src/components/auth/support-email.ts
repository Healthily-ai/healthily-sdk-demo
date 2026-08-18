/** Partner support inbox users contact when they can't find the login details we emailed them. */
export const SUPPORT_EMAIL = 'partners@healthily.ai';

const SUPPORT_SUBJECT = 'Healthily demo — login help';

/** Pre-addressed mailto URL shared by the native and web link implementations. */
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  SUPPORT_SUBJECT,
)}`;

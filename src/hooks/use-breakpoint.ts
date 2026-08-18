import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/** Width thresholds (px). Anything below `tablet` is treated as mobile. */
export const BREAKPOINTS = { tablet: 768, desktop: 1200 } as const;

/**
 * Width-driven breakpoint. Backed by `useWindowDimensions`, so it recomputes on
 * web window resize and on device rotation. An uncertain/zero width (e.g. the
 * first static-web paint) falls through to `mobile`, the safest default.
 */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

export interface HomeLayout {
  bp: Breakpoint;
  paddingLeft: number;
  paddingRight: number;
  contentMaxWidth: number;
  /** Title font size; line height is derived from it via `DISPLAY_LINE_HEIGHT`. */
  titleSize: number;
  logoHeight: number;
  /** Buttons sit in a row (tablet/desktop) vs stacked full-width (mobile). */
  buttonRow: boolean;
  centerVertically: boolean;
  /** Extra top padding. On mobile this drops the content below the blob cluster. */
  topGap: number;
}

/** Fixed width of the centered login form column (full-width on narrower phones). */
export const FORM_MAX_WIDTH = 560;

export interface LoginLayout {
  bp: Breakpoint;
  /** Title font size; line height is derived from it via `DISPLAY_LINE_HEIGHT`. */
  titleSize: number;
  /** Space above the back button (added to the safe-area top inset). */
  topGap: number;
  /** Left inset for the bottom-pinned footer links (the page margin). */
  footerPaddingLeft: number;
  /** The "About" footer link is dropped on mobile. */
  showAboutLink: boolean;
}

/** Maps the active breakpoint to the responsive values the Login screen needs. */
export function useLoginLayout(): LoginLayout {
  const bp = useBreakpoint();
  switch (bp) {
    // Title is 32px across breakpoints — it fits one line within the centered column
    // on tablet/desktop and wraps to two lines on the narrower mobile width.
    case 'desktop':
      return { bp, titleSize: 32, topGap: 56, footerPaddingLeft: 185, showAboutLink: true };
    case 'tablet':
      return { bp, titleSize: 32, topGap: 56, footerPaddingLeft: 78, showAboutLink: true };
    default:
      return { bp, titleSize: 32, topGap: 16, footerPaddingLeft: 24, showAboutLink: false };
  }
}

/** Maps the active breakpoint to every responsive value the Home screen needs. */
export function useHomeLayout(): HomeLayout {
  const bp = useBreakpoint();
  switch (bp) {
    case 'desktop':
      return {
        bp,
        paddingLeft: 185,
        paddingRight: 24,
        // Wide enough for the 56px title to sit on one line (it measures ~560px).
        contentMaxWidth: 580,
        titleSize: 56,
        logoHeight: 44,
        buttonRow: true,
        centerVertically: false,
        // Figma logo top position for desktop.
        topGap: 171,
      };
    case 'tablet':
      return {
        bp,
        paddingLeft: 78,
        paddingRight: 24,
        // Tablet title is 48px (~480px wide) so it fits one line within 520.
        contentMaxWidth: 520,
        titleSize: 48,
        logoHeight: 40,
        buttonRow: true,
        centerVertically: false,
        // Figma logo top position for tablet.
        topGap: 259,
      };
    default:
      return {
        bp,
        paddingLeft: 24,
        paddingRight: 24,
        contentMaxWidth: 520,
        titleSize: 48,
        logoHeight: 36,
        buttonRow: false,
        centerVertically: false,
        // Figma logo top position for mobile.
        topGap: 180,
      };
  }
}

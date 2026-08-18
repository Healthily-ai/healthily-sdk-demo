/**
 * Font-family names registered via `useFonts` in the root layout. The display
 * family (Biennale) is used for the title and button labels; the body family
 * (Libre Franklin) for everything else. Files live in `assets/fonts/`.
 */
export const Display = {
  semibold: 'Biennale-SemiBold',
  regular: 'Biennale-Regular',
} as const;

export const Body = {
  regular: 'LibreFranklin-Regular',
  bold: 'LibreFranklin-Bold',
} as const;

/**
 * Leading for Biennale headings, as a multiple of the font size.
 *
 * iOS clamps a line's usable ascent to `lineHeight - descent`, so a heading is
 * clipped along its top edge unless the line height clears the tallest glyph.
 * Biennale needs 1.126em for that (0.781em from baseline to the dot of the `i`,
 * plus 0.345em of descent); 1.2 leaves a little headroom on top.
 */
export const DISPLAY_LINE_HEIGHT = 1.2;

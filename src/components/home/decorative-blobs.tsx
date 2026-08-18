import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { Breakpoint } from '@/hooks/use-breakpoint';

/**
 * The decorative graphic anchored to the top-right corner (orange / pink / blue
 * shapes). This is the exact Figma vector (node 9934:31098), rendered via
 * react-native-svg and clipped to its 160×380 viewBox. It is scaled per
 * breakpoint and anchored top-right; the parent's `overflow: 'hidden'` clips the
 * portion that bleeds off-screen.
 */

/** Native graphic size from Figma is 160×380 (width:height ratio 8:19). */
const RATIO = 380 / 160;

/** Rendered width per breakpoint (matched to the Figma frames); height keeps ratio. */
const WIDTH: Record<Breakpoint, number> = {
  mobile: 160,
  tablet: 240,
  desktop: 385,
};

export function DecorativeBlobs({ bp }: { bp: Breakpoint }) {
  const width = WIDTH[bp];
  const height = width * RATIO;

  return (
    <View pointerEvents="none" style={styles.layer}>
      <Svg width={width} height={height} viewBox="0 0 160 380" fill="none">
        {/* Orange — fills the top-right corner */}
        <Path
          d="M80.1882 -0.210693C35.8956 -0.210693 0.0032959 35.6824 0.0032959 79.976C0.0032959 124.27 35.8956 160.163 80.1882 160.163H160.373V-0.210693H80.1882Z"
          fill="#FF6400"
        />
        {/* Sky blue — lower shape, bleeds off the right */}
        <Path
          d="M120.256 229.611C98.1099 267.948 111.245 317.027 149.581 339.123C187.917 361.27 236.995 348.135 259.091 309.798L299.209 240.354L160.323 160.167L120.205 229.611H120.256Z"
          fill="#4CBAE3"
        />
        {/* Light pink — circle layered on top */}
        <Path
          d="M126.262 206.744C126.262 232.455 105.44 253.278 79.7297 253.278C54.0196 253.278 33.197 232.455 33.197 206.744C33.197 181.034 54.0196 160.211 79.7297 160.211C105.44 160.211 126.262 181.034 126.262 206.744Z"
          fill="#FFCDE2"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, right: 0 },
});

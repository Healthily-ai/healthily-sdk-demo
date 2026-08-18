import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BulletItem } from "@/components/home/bullet-item";
import { DecorativeBlobs } from "@/components/home/decorative-blobs";
import { HealthilyLogo } from "@/components/home/healthily-logo";
import { PillButton } from "@/components/home/pill-button";
import { Body, DISPLAY_LINE_HEIGHT, Display } from "@/constants/fonts";
import { Brand, Radius } from "@/constants/theme";
import { useHomeLayout } from "@/hooks/use-breakpoint";

const BULLETS = [
  "Try out our fast, easy assessment",
  "See how we change behaviour",
  "Implement in days not months.",
];

export default function HomeScreen() {
  const layout = useHomeLayout();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Each visit to a feature requires a fresh session, so always route through
  // login, carrying the intended destination so it can redirect there on success.
  const open = (target: "/assessment" | "/chat") =>
    router.push({ pathname: "/login", params: { redirect: target } });

  return (
    <View style={styles.root}>
      {/* Decorative cluster sits behind the content and is clipped by `root`. */}
      <DecorativeBlobs bp={layout.bp} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: layout.paddingLeft,
            paddingRight: layout.paddingRight,
            // Centered layouts pad evenly; the (top-aligned) mobile layout clamps so
            // a device notch never adds excess space beyond the design's top gap.
            paddingTop: layout.centerVertically
              ? insets.top + layout.topGap
              : Math.max(insets.top, layout.topGap),
            paddingBottom: insets.bottom + 32,
            justifyContent: layout.centerVertically ? "center" : "flex-start",
          },
        ]}
      >
        <View style={[styles.content, { maxWidth: layout.contentMaxWidth }]}>
          <HealthilyLogo height={layout.logoHeight} />

          <Text
            style={[
              styles.title,
              {
                fontSize: layout.titleSize,
                lineHeight: layout.titleSize * DISPLAY_LINE_HEIGHT,
              },
            ]}
          >
            Right Care, First Time
          </Text>

          <Text style={styles.subtitle}>
            Get users to the most appropriate next step.
          </Text>

          <View style={styles.bullets}>
            {BULLETS.map((bullet) => (
              <BulletItem key={bullet} label={bullet} />
            ))}
          </View>

          <View
            style={[
              styles.buttons,
              { flexDirection: layout.buttonRow ? "row" : "column" },
            ]}
          >
            <PillButton
              variant="primary"
              label="Try our assessment"
              fullWidth={!layout.buttonRow}
              onPress={() => open("/assessment")}
            />
            <PillButton
              variant="secondary"
              label="Try our chat version"
              fullWidth={!layout.buttonRow}
              onPress={() => open("/chat")}
            />
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              Please note: This is a demonstration of the product. It is not set
              up with live services so should not be used to seek guidance on
              real health issues.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.white, overflow: "hidden" },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  // width:100% (capped by maxWidth) keeps the column bound to the viewport so the
  // title wraps at the available width instead of overflowing under the blobs.
  content: { width: "100%", gap: 32, alignItems: "flex-start" },
  title: { fontFamily: Display.semibold, color: Brand.black },
  subtitle: {
    fontFamily: Body.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.black,
  },
  bullets: { gap: 8, alignSelf: "stretch" },
  buttons: { gap: 8, alignSelf: "stretch" },
  disclaimer: {
    backgroundColor: Brand.neutral50,
    borderRadius: Radius.box,
    padding: 16,
    alignSelf: "stretch",
  },
  disclaimerText: {
    fontFamily: Body.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Brand.black,
  },
});

import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackButton } from "@/components/auth/back-button";
import { EmailSupportLink } from "@/components/auth/email-support-link";
import { FooterLinks } from "@/components/auth/footer-links";
import { TextField } from "@/components/auth/text-field";
import { PillButton } from "@/components/home/pill-button";
import { Body, DISPLAY_LINE_HEIGHT, Display } from "@/constants/fonts";
import { Brand } from "@/constants/theme";
import { validateLogin, type LoginValues } from "@/features/auth/login-schema";
import { FORM_MAX_WIDTH, useLoginLayout } from "@/hooks/use-breakpoint";
import { useResumeSession } from "@/hooks/use-resume-session";
import { useSignIn } from "@/hooks/use-sign-in";
import {
  selectHasValidLogin,
  selectIsAuthenticated,
  useAuthStore,
} from "@/store/auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const layout = useLoginLayout();
  const { signIn, isPending, error } = useSignIn();
  const { resume, error: resumeError } = useResumeSession();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();

  // Decide the reuse path once, from the state at mount. The app only renders
  // after the persisted store has rehydrated (see the root layout), so this
  // snapshot is authoritative — and capturing it here (rather than subscribing to
  // `hasValidLogin`) keeps a fresh form login, which also sets `loginToken`, from
  // being mistaken for a resume.
  const [shouldResume] = useState(
    () =>
      selectHasValidLogin(useAuthStore.getState()) &&
      !selectIsAuthenticated(useAuthStore.getState()),
  );
  const [resumeFailed, setResumeFailed] = useState(false);

  // Reuse path: exchange the saved login for a fresh SDK session via
  // /healthily-login (which resets assessment/chat), then the redirect effect
  // below carries us in. The ref latches so this fires exactly once (guards
  // StrictMode double-invoke and re-renders while the request is in flight). If
  // the saved token is rejected, clear it and fall back to the form.
  const resumeStarted = useRef(false);
  useEffect(() => {
    if (shouldResume && !resumeStarted.current) {
      resumeStarted.current = true;
      resume().catch(() => {
        logout();
        setResumeFailed(true);
      });
    }
  }, [shouldResume, resume, logout]);

  // Redirect once authenticated. Driving this from the auth flag (rather than
  // navigating inline in onSubmit) guarantees (app)/_layout has re-rendered with
  // its guard satisfied, so the assessment/chat route is mounted before we go.
  useEffect(() => {
    if (isLoggedIn) router.replace((redirect ?? "/") as Href);
  }, [isLoggedIn, redirect, router]);

  // While the saved login is being exchanged for an SDK session, show a
  // "resuming" spinner instead of flashing the login form.
  if (shouldResume && !resumeFailed) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={Brand.black} />
        <Text style={styles.resumingText}>Resuming your session…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Formik<LoginValues>
          initialValues={{ username: "", password: "" }}
          validate={validateLogin}
          validateOnMount
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // Runs /login → /healthily-login and stores the credentials. On
              // success the auth store flips `isLoggedIn` and the effect above
              // redirects to the requested screen.
              await signIn(values);
            } catch {
              // Surfaced below via the mutation's `error` state.
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {(form) => (
            <>
              <ScrollView
                style={styles.flex}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  styles.scrollContent,
                  { paddingTop: insets.top + layout.topGap },
                ]}
              >
                <View style={[styles.column, { maxWidth: FORM_MAX_WIDTH }]}>
                  <BackButton onPress={() => router.back()} />

                  <View style={styles.header}>
                    <Text
                      style={[
                        styles.title,
                        {
                          fontSize: layout.titleSize,
                          lineHeight: layout.titleSize * DISPLAY_LINE_HEIGHT,
                        },
                      ]}
                    >
                      Please enter your login details
                    </Text>
                    <Text style={styles.subtitle}>
                      Log in to the Healthily demo with the details shared with
                      you in the email where we sent this link.{" "}
                      <EmailSupportLink style={styles.link}>
                        Can&apos;t find your details? Email us here
                      </EmailSupportLink>
                      .
                    </Text>
                  </View>

                  <View style={styles.fields}>
                    <TextField
                      label="Username"
                      placeholder="Please enter your username"
                      value={form.values.username}
                      onChangeText={form.handleChange("username")}
                      onBlur={form.handleBlur("username")}
                      returnKeyType="next"
                    />
                    <TextField
                      label="Password"
                      placeholder="Please enter your password"
                      secureTextEntry
                      value={form.values.password}
                      onChangeText={form.handleChange("password")}
                      onBlur={form.handleBlur("password")}
                      returnKeyType="go"
                      onSubmitEditing={() => form.handleSubmit()}
                    />
                  </View>

                  <PillButton
                    variant="primary"
                    label="Continue"
                    fullWidth
                    showArrow
                    disabled={!form.isValid || isPending}
                    onPress={() => form.handleSubmit()}
                  />

                  {(error ?? resumeError) ? (
                    <Text style={styles.error}>
                      We couldn&apos;t sign you in. Please check your details
                      and try again.
                    </Text>
                  ) : null}
                </View>
              </ScrollView>

              <FooterLinks
                showAboutLink={layout.showAboutLink}
                style={{
                  paddingLeft: layout.footerPaddingLeft,
                  paddingRight: 24,
                  paddingTop: 12,
                  paddingBottom: insets.bottom + 24,
                }}
              />
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.white },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  column: { width: "100%", gap: 28 },
  header: { gap: 12 },
  title: { fontFamily: Display.semibold, color: Brand.black },
  subtitle: {
    fontFamily: Body.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.black,
  },
  link: {
    fontFamily: Body.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.link,
    textDecorationLine: "underline",
  },
  fields: { gap: 16 },
  error: {
    fontFamily: Body.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.bloodOrange,
  },
  center: { alignItems: "center", justifyContent: "center", gap: 16 },
  resumingText: {
    fontFamily: Body.regular,
    fontSize: 16,
    lineHeight: 24,
    color: Brand.black,
  },
});

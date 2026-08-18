// Dynamic Expo config.
//
// The shared/static configuration lives in app.json and is passed in here as
// `config`. This file only layers on the per-variant differences, driven by
// EXPO_PUBLIC_APP_VARIANT (set per build profile in eas.json):
//
//   production (default) -> "Healthily Demo", existing icon, com.yourmd.sdkwrapper
//   staging              -> "Healthily Demo (STG)", sashed icon, *.staging ids
//   development          -> "Healthily Demo (DEV)", sashed icon, *.dev ids
//
// Distinct bundle identifier / package let the staging and development builds
// sit alongside production (and each other) on the same device. Any run
// without the variable set (e.g. local dev or the web export) falls back to
// the production values in app.json.

const VARIANTS = {
  staging: {
    name: 'Healthily Demo (STG)',
    icon: './assets/images/icon-staging.png',
    idSuffix: 'staging',
    androidForeground: './assets/images/android-icon-foreground-staging.png',
  },
  development: {
    name: 'Healthily Demo (DEV)',
    icon: './assets/images/icon-dev.png',
    idSuffix: 'dev',
    androidForeground: './assets/images/android-icon-foreground-dev.png',
  },
};

module.exports = ({ config }) => {
  const variant = VARIANTS[process.env.EXPO_PUBLIC_APP_VARIANT];
  if (!variant) {
    return config;
  }

  return {
    ...config,
    name: variant.name,
    icon: variant.icon,
    ios: {
      ...config.ios,
      bundleIdentifier: `${config.ios.bundleIdentifier}.${variant.idSuffix}`,
    },
    android: {
      ...config.android,
      package: `${config.android.package}.${variant.idSuffix}`,
      adaptiveIcon: {
        ...config.android.adaptiveIcon,
        foregroundImage: variant.androidForeground,
      },
    },
  };
};

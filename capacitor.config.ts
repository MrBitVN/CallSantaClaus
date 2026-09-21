import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.santacall.magic',
  appName: 'SantaCall Magic',
  webDir: 'dist',
  backgroundColor: '#1a0305',
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    allowsLinkPreview: false,
    scrollEnabled: false
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor'
  }
};

export default config;


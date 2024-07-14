import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'main',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    GoogleMaps: {
        apiKey: 'AIzaSyCMXfre823EDS2YC_BfExnrJWnQmTObOFI',
    },
  },
};

export default config;

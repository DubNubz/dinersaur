import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "main",
  webDir: "dist",
  bundledWebRuntime: false,
  plugins: {
    GoogleMaps: {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    },
  },
};

export default config;

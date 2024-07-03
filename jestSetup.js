// jestSetup.js
import { NativeModules } from "react-native";
import "@testing-library/jest-native/extend-expect";

NativeModules.SettingsManager = {
  settings: {
    AppleLocale: "en_US",
    AppleLanguages: ["en"],
  },
};

NativeModules.ExpoDevice = {
  platformApiLevel: 30,
};

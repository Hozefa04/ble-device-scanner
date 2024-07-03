module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jestSetup.js"],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|@react-native|@react-navigation|react-native-ble-plx|expo|expo-device)/",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

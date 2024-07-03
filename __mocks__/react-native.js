// __mocks__/react-native.js
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js";

module.exports = {
  NativeModules: {},
  NativeEventEmitter: jest.fn(),
  Platform: {
    OS: "android",
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: "android.permission.ACCESS_FINE_LOCATION",
      BLUETOOTH_SCAN: "android.permission.BLUETOOTH_SCAN",
      BLUETOOTH_CONNECT: "android.permission.BLUETOOTH_CONNECT",
    },
    RESULTS: {
      GRANTED: "granted",
    },
  },
  Alert: {
    alert: jest.fn(),
  },
};

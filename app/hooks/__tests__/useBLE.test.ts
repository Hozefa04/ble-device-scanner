import { renderHook, act, WaitFor } from '@testing-library/react-hooks';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device, BleError, BleErrorCode, BleAndroidErrorCode, BleIOSErrorCode, BleATTErrorCode } from 'react-native-ble-plx';
import useBLE from '../useBLE';
import * as ExpoDevice from "expo-device";
import '@testing-library/jest-native/extend-expect';

// Mock BleError
class MockBleError extends Error implements BleError {
  errorCode: BleErrorCode;
  attErrorCode: BleATTErrorCode | null;
  iosErrorCode: BleIOSErrorCode | null;
  androidErrorCode: BleAndroidErrorCode | null;
  reason: string;

  constructor(message: string) {
    super(message);
    this.errorCode = BleErrorCode.UnknownError;
    this.attErrorCode = null;
    this.iosErrorCode = null;
    this.androidErrorCode = null;
    this.reason = message;
  }
}

// Mocking dependencies
jest.mock('react-native-ble-plx', () => {
  return {
    BleManager: jest.fn().mockImplementation(() => ({
      startDeviceScan: jest.fn().mockImplementation(() => Promise.resolve()),
    })),
    BleError: MockBleError,
    BleErrorCode: {
      UnknownError: 0,
      BluetoothUnauthorized: 1,
      BluetoothPoweredOff: 2,
    },
    State: {
      PoweredOn: 'PoweredOn',
      PoweredOff: 'PoweredOff',
      // Add other states as needed
    },
  };
});

jest.mock('react-native', () => ({
  PermissionsAndroid: {
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
      BLUETOOTH_SCAN: 'android.permission.BLUETOOTH_SCAN',
      BLUETOOTH_CONNECT: 'android.permission.BLUETOOTH_CONNECT',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
    request: jest.fn(),
    requestMultiple: jest.fn(),
  },
  Platform: {
    OS: 'android',
  },
}));

let mockApiLevel = 30;

jest.mock('expo-device', () => ({
  get platformApiLevel() {
    return mockApiLevel;
  }
}));

function setApiLevel(level: number) {
  mockApiLevel = level;
}

const waitForNextUpdate = async (result: any, timeout = 1000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (result.current.allDevices.length > 0) return;
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
  }
  throw new Error('Timeout waiting for next update');
};

describe('useBLE hook', () => {
  let bleManagerMock: jest.Mocked<BleManager>;

  beforeEach(() => {
    bleManagerMock = new BleManager() as jest.Mocked<BleManager>;
    jest.clearAllMocks();
  });

  it('should request permissions and return true when granted on Android API < 31', async () => {
    Platform.OS = 'android';
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    const { result } = renderHook(() => useBLE());

    await act(async () => {
      const permissionsGranted = await result.current.requestPermissions();
      expect(permissionsGranted).toBe(true);
    });

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      expect.any(Object)
    );
  });

  it('should request permissions and return true when granted on Android API >= 31', async () => {
    Platform.OS = 'android';
    setApiLevel(31);
    (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
      'android.permission.BLUETOOTH_SCAN': PermissionsAndroid.RESULTS.GRANTED,
      'android.permission.BLUETOOTH_CONNECT': PermissionsAndroid.RESULTS.GRANTED,
      'android.permission.ACCESS_FINE_LOCATION': PermissionsAndroid.RESULTS.GRANTED,
    });

    const { result } = renderHook(() => useBLE());

    let permissionsGranted;
    await act(async () => {
      permissionsGranted = await result.current.requestPermissions();
    });

    expect(permissionsGranted).toBe(true);
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledTimes(1);
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  });

  it('should return true for permissions on iOS', async () => {
    Platform.OS = 'ios';

    const { result } = renderHook(() => useBLE());

    await act(async () => {
      const permissionsGranted = await result.current.requestPermissions();
      expect(permissionsGranted).toBe(true);
    });
  });

  it('should return false for denied permissions on Android API < 31', async () => {
    Platform.OS = 'android';
    setApiLevel(30);
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

    const { result } = renderHook(() => useBLE());

    await act(async () => {
      const permissionsGranted = await result.current.requestPermissions();
      expect(permissionsGranted).toBe(false);
    });

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      expect.any(Object)
    );
  });

  it('should return false for denied permissions on Android API >= 31', async () => {
    Platform.OS = 'android';
    setApiLevel(31);
    (PermissionsAndroid.requestMultiple as jest.Mock).mockResolvedValue({
      'android.permission.BLUETOOTH_SCAN': PermissionsAndroid.RESULTS.DENIED,
      'android.permission.BLUETOOTH_CONNECT': PermissionsAndroid.RESULTS.DENIED,
      'android.permission.ACCESS_FINE_LOCATION': PermissionsAndroid.RESULTS.DENIED,
    });

    const { result } = renderHook(() => useBLE());

    let permissionsGranted;
    await act(async () => {
      permissionsGranted = await result.current.requestPermissions();
    });

    expect(permissionsGranted).toBe(false);
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledTimes(1);
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  });

  it('should handle a specific edge case for API level', async () => {
    Platform.OS = 'android';
    setApiLevel(30);
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);
  
    const { result } = renderHook(() => useBLE());
  
    await act(async () => {
      const permissionsGranted = await result.current.requestPermissions();
      expect(permissionsGranted).toBe(false);
    });
  });

  it('should scan for peripherals and add devices to state', async () => {
    const mockDevice: Device = {
      id: '1',
      name: 'Test Device',
      rssi: -50,
    } as Device;
  
    (BleManager as jest.Mock).mockImplementation(() => ({
      startDeviceScan: jest.fn().mockImplementation((_, __, callback) => {
        setTimeout(() => callback(null, mockDevice), 0);
      }),
    }));
  
    const { result } = renderHook(() => useBLE());
  
    act(() => {
      result.current.scanForPeripherals();
    });
  
    await waitForNextUpdate(result);
  
    expect(result.current.allDevices).toHaveLength(1);
    expect(result.current.allDevices[0]).toEqual(mockDevice);
  });

  it('should not add duplicate devices to state', async () => {
    const mockDevice: Device = {
      id: '1',
      name: 'Test Device',
      rssi: -50,
    } as Device;
  
    (BleManager as jest.Mock).mockImplementation(() => ({
      startDeviceScan: jest.fn().mockImplementation((_, __, callback) => {
        setTimeout(() => {
          callback(null, mockDevice);
          callback(null, mockDevice);
        }, 0);
      }),
    }));
  
    const { result } = renderHook(() => useBLE());
  
    act(() => {
      result.current.scanForPeripherals();
    });
  
    await waitForNextUpdate(result);
  
    expect(result.current.allDevices).toHaveLength(1);
    expect(result.current.allDevices[0]).toEqual(mockDevice);
  });

  it('should scan for peripherals and add multiple devices to state', async () => {
    const mockDevices: Device[] = [
      { id: '1', name: 'Test Device 1', rssi: -50 } as Device,
      { id: '2', name: 'Test Device 2', rssi: -40 } as Device,
    ];
  
    (BleManager as jest.Mock).mockImplementation(() => ({
      startDeviceScan: jest.fn().mockImplementation((_, __, callback) => {
        setTimeout(() => {
          callback(null, mockDevices[0]);
          callback(null, mockDevices[1]);
        }, 0);
      }),
    }));
  
    const { result } = renderHook(() => useBLE());
  
    act(() => {
      result.current.scanForPeripherals();
    });
  
    await waitForNextUpdate(result);
  
    expect(result.current.allDevices).toHaveLength(2);
    expect(result.current.allDevices).toContainEqual(mockDevices[0]);
    expect(result.current.allDevices).toContainEqual(mockDevices[1]);
  });  

  it('should handle scan errors', async () => {
    const mockError = new MockBleError('Scan error');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
    (BleManager as jest.Mock).mockImplementation(() => ({
      startDeviceScan: jest.fn().mockImplementation((_, __, callback) => {
        setTimeout(() => callback(mockError, null), 0);
      }),
    }));
  
    const { result } = renderHook(() => useBLE());
  
    act(() => {
      result.current.scanForPeripherals();
    });
  
    // Wait a bit for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 0));
  
    expect(consoleSpy).toHaveBeenCalledWith(mockError);
  
    consoleSpy.mockRestore();
  });
  
});


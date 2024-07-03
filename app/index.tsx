import useBLE from "@/hooks/useBLE";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  ListRenderItem,
  SafeAreaView,
  Alert,
} from "react-native";
import { Device } from "react-native-ble-plx";

export default function App() {
  // State to manage scanning status
  const [scanning, setScanning] = useState(false);

  // Destructure functions and state from custom hook
  const { requestPermissions, scanForPeripherals, allDevices } = useBLE();

  // Effect to stop scanning once devices are found
  useEffect(() => {
    if (allDevices.length > 0) {
      setScanning(false);
    }
  }, [allDevices]);

  // Effect to scan for devices every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      scanForDevices();

      // Stop scanning after 3 seconds
      setTimeout(() => {
        setScanning(false);
      }, 4000);
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to handle scanning for devices
  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      setScanning(true); // Set scanning state to true
      scanForPeripherals(); // Start scanning for peripherals
    } else {
      // Show alert if permissions are not granted
      Alert.alert(
        "Permission Error",
        "BLE permission is required to scan for devices."
      );
    }
  };

  // Function to render each device item in the list
  const renderItem: ListRenderItem<Device> = ({ item }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name || "Unknown Device"}</Text>
      <Text style={styles.deviceRssi}>RSSI: {item.rssi} dBm</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BLE Scanner</Text>
      </View>
      <View style={styles.scanButton}>
        <Button
          title={scanning ? "Scanning..." : "Scan for Devices"}
          onPress={scanForDevices}
          disabled={scanning}
        />
      </View>
      {allDevices.length > 0 ? (
        <FlatList
          data={allDevices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>
          {scanning
            ? "Scanning for devices..."
            : "No devices found. Try scanning."}
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scanButton: {
    margin: 20,
  },
  list: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deviceRssi: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
});

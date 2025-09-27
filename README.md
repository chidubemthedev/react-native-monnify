# react-native-monnify

An **Expo-friendly React Native wrapper** for the Monnify Web SDK.  
Allows easy integration of Monnify payments via **WebView** for both Expo-managed and bare React Native projects.

---

## ⚡ Features

- Works with **Expo managed workflow** and bare React Native apps
- WebView-based integration for **sandbox and live payments**
- Fully typed with **TypeScript**
- Handles **success**, **error**, and **dismiss** events
- Minimal setup; no extra build tooling required

---

## 📦 Installation

```bash
# Install peer dependencies first
expo install react-native-webview

# Install the package (npm or yarn)
npm install react-native-monnify
# or
yarn add react-native-monnify
📝 Usage
tsx
Copy code
import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Monnify, { MonnifyPaymentParams } from "react-native-monnify";

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const paymentParameters: MonnifyPaymentParams = {
    amount: 100,
    currency: "NGN",
    reference: `${new Date().getTime()}`,
    customerFullName: "John Doe",
    customerEmail: "admin@gmail.com",
    customerMobileNumber: "08012345689",
    apiKey: "MK_PROD_V5EJMMX2FM",
    contractCode: "100693167467",
    paymentDescription: "Payment for goods from RN package",
    mode: "LIVE",
  };

  const onSuccess = (response: any) => {
    console.log("Payment Successful:", response);
    router.push("/success");
  };

  const onError = (response: any) => {
    console.log("Payment Failed:", response);
    router.push("/error");
  };

  const onDismiss = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Monnify
        visible={modalVisible}
        paymentParams={paymentParameters}
        onSuccess={onSuccess}
        onError={onError}
        onDismiss={onDismiss}
      />
      <Pressable style={[styles.button, styles.buttonOpen]} onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Pay with Monnify</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { borderRadius: 20, padding: 10, elevation: 2 },
  buttonOpen: { backgroundColor: "#F194FF" },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" },
});
⚙️ Props
Prop	Type	Description
visible	boolean	Show or hide the payment modal
paymentParams	MonnifyPaymentParams	Payment configuration (API key, contract code, amount, etc.)
onSuccess	(response: any) => void	Callback when payment succeeds
onError	(error: any) => void	Callback when payment fails
onDismiss	() => void	Callback when modal is dismissed

⚡ Notes
Only public API key should be used in the client. Keep secret keys on your server.

Generate a unique reference for every payment attempt.

For production, set mode: "LIVE" and handle redirect URLs as needed.
```

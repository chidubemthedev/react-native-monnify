# react-native-monnify

[![npm version](https://img.shields.io/npm/v/react-native-monnify?color=blue)](https://www.npmjs.com/package/react-native-monnify)
[![License](https://img.shields.io/npm/l/react-native-monnify)](https://github.com/chidubemthedev/react-native-monnify/blob/main/LICENSE)
[![Expo Compatible](https://img.shields.io/badge/Expo-Compatible-4CAF50?logo=expo)](https://docs.expo.dev/)

An **Expo-friendly React Native wrapper** for the Monnify Web SDK. Easily integrate Monnify payments via **WebView** in **Expo-managed** and **bare React Native** apps.

---

## ⚡ Features

- ✅ Works with **Expo managed workflow** and bare React Native apps
- ✅ WebView-based integration for **sandbox and live payments**
- ✅ Fully typed with **TypeScript**
- ✅ Handles **success**, **error**, and **dismiss** events
- ✅ Minimal setup; no extra build tooling required

---

## 📦 Installation

```bash
# Install peer dependencies first
expo install react-native-webview

# Install the package (npm or yarn)
npm install react-native-monnify
# or
yarn add react-native-monnify
```

---

## 📝 Basic Usage

```tsx
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
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
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
```

---

## 📝 Split Payment Example

```tsx
const paymentParameters: MonnifyPaymentParams = {
  amount: 5000,
  currency: "NGN",
  reference: `${new Date().getTime()}`,
  customerFullName: "John Doe",
  customerEmail: "admin@gmail.com",
  customerMobileNumber: "08012345678",
  apiKey: "MK_TEST_P2HGJFA4",
  contractCode: "3520752572",
  paymentDescription: "Payment for goods",
  mode: "TEST",
  metadata: { name: "Damilare", age: 45 },
  incomeSplitConfig: [
    {
      subAccountCode: "MFY_SUB_342113621921",
      feePercentage: 50,
      splitAmount: 1900,
      feeBearer: true,
    },
    {
      subAccountCode: "MFY_SUB_342113621922",
      feePercentage: 50,
      splitAmount: 2100,
      feeBearer: true,
    },
  ],
};
```

---

## ⚙️ Props

### Component Props

| Prop          | Type                    | Required | Description                                           |
| ------------- | ----------------------- | -------- | ----------------------------------------------------- |
| visible       | boolean                 | Yes      | Show or hide the payment modal                        |
| paymentParams | MonnifyPaymentParams    | Yes      | Payment configuration (see PaymentParams table below) |
| onSuccess     | (response: any) => void | No       | Callback when payment succeeds                        |
| onError       | (error: any) => void    | No       | Callback when payment fails                           |
| onDismiss     | () => void              | No       | Callback when modal is dismissed                      |

### PaymentParams Properties

| Prop               | Type                | Required | Description                                                     |
| ------------------ | ------------------- | -------- | --------------------------------------------------------------- |
| amount             | number              | Yes      | The amount to be paid                                           |
| currency           | string              | Yes      | The currency in which payment will be made (e.g., "NGN")        |
| reference          | string              | Yes      | A unique reference for the payment transaction                  |
| customerFullName   | string              | Yes      | The full name of the customer making the payment                |
| customerEmail      | string              | Yes      | The email address of the customer making the payment            |
| apiKey             | string              | Yes      | The API key provided by Monnify                                 |
| contractCode       | string              | Yes      | The contract code provided by Monnify                           |
| paymentDescription | string              | Yes      | A description of the payment                                    |
| mode               | string              | Yes      | Environment mode: "TEST" for development, "LIVE" for production |
| metadata           | Record<string, any> | No       | Additional metadata to be sent with the payment                 |
| incomeSplitConfig  | Array<Object>       | No       | Configuration for splitting the payment into sub-accounts       |

---

## ⚡ Notes

- Only public API key should be used in the client. **Keep secret keys on your server.**
- Generate a unique reference for every payment attempt.
- For production, set `mode: "LIVE"` and handle redirect URLs properly.
- Works in both sandbox (`TEST`) and live (`LIVE`) modes.
- Split payments supported via `incomeSplitConfig`.

---

## 🛠 Development

```bash
# Clone the repo
git clone https://github.com/chidubemthedev/react-native-monnify.git
cd react-native-monnify

# Install dependencies
npm install

# Build the package
npm run build

# Link or test locally in an Expo project
npm pack
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📖 License

MIT License © [Chidubem Agulue](https://github.com/chidubemthedev)

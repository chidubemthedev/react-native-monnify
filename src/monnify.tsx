import React, { useRef } from "react";
import { Modal, Platform, StyleSheet, View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { generateHtml } from "./utils/generateHtml";
import { MonnifyProps } from "./types";

const Monnify: React.FC<MonnifyProps> = ({
  visible,
  paymentParams,
  onSuccess,
  onError,
  onDismiss,
  customStyles,
}) => {
  const webRef = useRef<WebView>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data || "{}");
      const { event: ev, response, data } = payload || {};
      switch (ev) {
        case "onComplete":
          onSuccess?.(response);
          break;
        case "onClose":
          onDismiss?.(data);
          break;
        case "onLoadStart":
        case "onLoadComplete":
          // optional: expose as separate callbacks in future
          break;
        case "onError":
          onError?.(response);
          break;
        default:
          // ignore
          break;
      }
    } catch (err) {
      onError?.({ message: String((err && (err as any).message) || err) });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => onDismiss?.()}
    >
      <View style={[styles.container, customStyles?.webViewContainer]}>
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          setSupportMultipleWindows={false}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          mixedContentMode="always"
          onMessage={handleMessage}
          source={{ html: generateHtml(paymentParams) }}
          // Android text autosizing can affect layout; disable scaling on iOS for fidelity
          scalesPageToFit={Platform.OS !== "ios"}
          style={styles.webView}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingTop: Platform.select({ ios: 48, android: 0 }),
  },
  webView: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
});

export default Monnify;

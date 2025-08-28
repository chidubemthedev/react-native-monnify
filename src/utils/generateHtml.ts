import { MonnifyPaymentParams } from "../types";

/**
 * Generates a minimal HTML page that loads Monnify Web SDK and starts checkout.
 * We use postMessage to communicate events back to React Native.
 */
export const generateHtml = (paymentParams: MonnifyPaymentParams) => {
  const {
    apiKey,
    contractCode,
    mode = "TEST",
    amount,
    currency = "NGN",
    reference,
    customerFullName,
    customerEmail,
    customerMobileNumber,
    paymentDescription,
    redirectUrl,
    metadata,
    incomeSplitConfig,
  } = paymentParams;

  const config = {
    apiKey,
    contractCode,
    mode,
    amount,
    currency,
    reference,
    customerFullName,
    customerEmail,
    customerMobileNumber,
    paymentDescription,
    redirectUrl,
    metadata,
    incomeSplitConfig,
  } as const;

  // Embed as JSON to avoid string concatenation pitfalls
  const CONFIG_JSON = JSON.stringify(config);

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8" />
    <title>Monnify Checkout</title>
    <script src="https://sdk.monnify.com/plugin/monnify.js"></script>
    <script>
      function safePost(data){
        try { window.ReactNativeWebView.postMessage(JSON.stringify(data)); }
        catch(e){ /* noop */ }
      }
      function payWithMonnify(){
        try {
          var cfg = ${CONFIG_JSON};
          if (!window.MonnifySDK || !window.MonnifySDK.initialize) {
            safePost({ event: 'onError', response: { message: 'MonnifySDK not available' } });
            return;
          }
          MonnifySDK.initialize(Object.assign({}, cfg, {
            onLoadStart: function(){ safePost({ event: 'onLoadStart' }); },
            onLoadComplete: function(){ safePost({ event: 'onLoadComplete' }); },
            onComplete: function(response){ safePost({ event: 'onComplete', response: response }); },
            onClose: function(data){ safePost({ event: 'onClose', data: data }); }
          }));
        } catch (err) {
          safePost({ event: 'onError', response: { message: String(err && err.message || err) } });
        }
      }
      document.addEventListener('DOMContentLoaded', payWithMonnify);
    </script>
    <style>
      html, body { margin:0; padding:0; }
    </style>
  </head>
  <body></body>
</html>`;
};

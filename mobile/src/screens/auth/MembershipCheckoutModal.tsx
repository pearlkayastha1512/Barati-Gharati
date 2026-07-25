import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { AxiosError } from "axios";

import { createCustomerPremiumRegistrationOrder } from "../../api/payment.api";
import { CustomerPremiumOrder, RazorpaySuccess } from "../../types/payment";
import { BASE_URL } from "../../constants/api";

type Props = {
  visible: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onClose: () => void;
  onSuccess: (payment: RazorpaySuccess, order: CustomerPremiumOrder) => Promise<void> | void;
};

const errorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
    if (!error.response) return "Payment server se connection nahi ho pa raha hai.";
  }
  return "Payment prepare nahi ho saka.";
};

const checkoutHtml = (
  order: CustomerPremiumOrder,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
) => {
  const options = {
    key: order.keyId,
    amount: order.amountInPaise,
    currency: order.currency,
    name: "Barati Gharati",
    description: "Premium Membership — Wedding Planning Concierge",
    order_id: order.orderId,
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    theme: { color: "#FF4D6D" },
    callback_url: `${BASE_URL}/payment/mobile-callback`,
    redirect: true,
  };

  const safeOptions = JSON.stringify(options).replace(/</g, "\\u003c");
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>html,body{height:100%;margin:0;background:#fffdf0;font-family:-apple-system,BlinkMacSystemFont,sans-serif}.loading{height:100%;display:flex;align-items:center;justify-content:center;color:#6c2d45}</style></head><body><div class="loading">Opening secure payment…</div><script src="https://checkout.razorpay.com/v1/checkout.js"></script><script>(function(){var options=${safeOptions};options.handler=function(response){window.ReactNativeWebView.postMessage(JSON.stringify({type:'success',data:response}));};options.modal={ondismiss:function(){window.ReactNativeWebView.postMessage(JSON.stringify({type:'dismiss'}));}};try{var checkout=new Razorpay(options);checkout.on('payment.failed',function(response){window.ReactNativeWebView.postMessage(JSON.stringify({type:'failed',message:(response.error&&response.error.description)||'Payment failed'}));});checkout.open();}catch(error){window.ReactNativeWebView.postMessage(JSON.stringify({type:'failed',message:error.message||'Unable to open payment gateway'}));}})();</script></body></html>`;
};

export function MembershipCheckoutModal({
  visible,
  customerName,
  customerEmail,
  customerPhone,
  onClose,
  onSuccess,
}: Props) {
  const [order, setOrder] = useState<CustomerPremiumOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prepare = async () => {
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      setOrder(await createCustomerPremiumRegistrationOrder());
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) void prepare();
    if (!visible) {
      setOrder(null);
      setError(null);
      setVerifying(false);
    }
  }, [visible]);

  const html = useMemo(
    () => (order ? checkoutHtml(order, customerName, customerEmail, customerPhone) : ""),
    [order, customerName, customerEmail, customerPhone],
  );

  const handleMessage = async (event: WebViewMessageEvent) => {
    if (!order) return;
    try {
      const message = JSON.parse(event.nativeEvent.data) as {
        type: string;
        data?: RazorpaySuccess;
        message?: string;
      };
      if (message.type === "dismiss") {
        onClose();
        return;
      }
      if (message.type === "failed") {
        setError(message.message ?? "Payment failed. Please try again.");
        setOrder(null);
        return;
      }
      if (message.type !== "success" || !message.data) return;
      setVerifying(true);
      setError(null);
      await onSuccess(message.data, order);
      setVerifying(false);
    } catch (reason) {
      setVerifying(false);
      setError(errorMessage(reason).replace("prepare", "verify"));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Premium Membership</Text>
            {order && (
              <Text style={styles.subtitle}>
                One-time payment · ₹{order.amount.toLocaleString("en-IN")}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.close} onPress={onClose} disabled={verifying}>
            <MaterialIcons name="close" size={23} color="#3F1D2F" />
          </TouchableOpacity>
        </View>

        {(loading || verifying) && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF4D6D" />
            <Text style={styles.info}>
              {verifying ? "Creating your account…" : "Preparing secure checkout…"}
            </Text>
          </View>
        )}
        {error && !loading && !verifying && (
          <View style={styles.center}>
            <MaterialIcons name="error-outline" size={44} color="#E63B5F" />
            <Text style={styles.error}>{error}</Text>
            <TouchableOpacity style={styles.retry} onPress={prepare}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        {order && !verifying && !loading && (
          <WebView
            source={{ html, baseUrl: "https://checkout.razorpay.com" }}
            originWhitelist={["https://*", "http://*"]}
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            javaScriptCanOpenWindowsAutomatically
            setSupportMultipleWindows={false}
            mixedContentMode="compatibility"
            onMessage={handleMessage}
            onError={() => {
              setOrder(null);
              setError("Payment gateway load nahi ho saka. Please use another payment method.");
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFDF0", paddingTop: 42 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#FFB3BF",
  },
  title: { color: "#3F1D2F", fontSize: 20, fontWeight: "800" },
  subtitle: { color: "#8D6171", marginTop: 3 },
  close: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  info: { color: "#6C2D45", marginTop: 14 },
  error: { color: "#E63B5F", textAlign: "center", marginTop: 12 },
  retry: { marginTop: 18, backgroundColor: "#FF4D6D", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12 },
  retryText: { color: "white", fontWeight: "700" },
});
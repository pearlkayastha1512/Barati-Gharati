import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import {
  createVendorRegistrationBadgeOrder,
  VendorRegistrationBadgeOrder,
} from "../../../api/payment.api";
import { BASE_URL } from "../../../constants/api";
import { RazorpaySuccess } from "../../../types/payment";

type Props = {
  visible: boolean;
  badge: "silver" | "gold";
  ownerName: string;
  email: string;
  phone: string;
  onClose: () => void;
  onPaid: (payment: RazorpaySuccess) => Promise<void>;
};

const createHtml = (
  order: VendorRegistrationBadgeOrder,
  customer: Pick<Props, "ownerName" | "email" | "phone">,
) => {
  const options = {
    key: order.keyId,
    amount: order.amountInPaise,
    currency: order.currency,
    name: "Barati Gharati",
    description: `${order.badge === "gold" ? "Gold" : "Silver"} vendor registration badge`,
    order_id: order.orderId,
    callback_url: `${BASE_URL}/payment/mobile-callback`,
    redirect: true,
    prefill: {
      name: customer.ownerName,
      email: customer.email,
      contact: customer.phone,
    },
    theme: { color: "#E4005A" },
  };
  const safeOptions = JSON.stringify(options).replace(/</g, "\\u003c");

  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>html,body{height:100%;margin:0;background:#fff;font-family:sans-serif}.loading{height:100%;display:flex;align-items:center;justify-content:center;color:#6c2d45}</style></head><body><div class="loading">Opening secure payment…</div><script src="https://checkout.razorpay.com/v1/checkout.js"></script><script>(function(){var options=${safeOptions};options.handler=function(response){window.ReactNativeWebView.postMessage(JSON.stringify({type:'success',data:response}));};options.modal={ondismiss:function(){window.ReactNativeWebView.postMessage(JSON.stringify({type:'dismiss'}));}};try{var checkout=new Razorpay(options);checkout.on('payment.failed',function(response){window.ReactNativeWebView.postMessage(JSON.stringify({type:'failed',message:(response.error&&response.error.description)||'Payment failed'}));});checkout.open();}catch(error){window.ReactNativeWebView.postMessage(JSON.stringify({type:'failed',message:error.message||'Unable to open payment gateway'}));}})();</script></body></html>`;
};

export function BadgePaymentModal({ visible, badge, ownerName, email, phone, onClose, onPaid }: Props) {
  const [order, setOrder] = useState<VendorRegistrationBadgeOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prepare = async () => {
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      setOrder(await createVendorRegistrationBadgeOrder(badge));
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Badge payment prepare nahi ho saka.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) void prepare();
    else {
      setOrder(null);
      setError(null);
      setSubmitting(false);
    }
  }, [visible, badge]);

  const html = useMemo(
    () => order ? createHtml(order, { ownerName, email, phone }) : "",
    [order, ownerName, email, phone],
  );

  const handleMessage = async (event: WebViewMessageEvent) => {
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
        setOrder(null);
        setError(message.message ?? "Payment failed. Please try again.");
        return;
      }
      if (message.type !== "success" || !message.data) return;
      setSubmitting(true);
      await onPaid(message.data);
    } catch (reason: any) {
      setSubmitting(false);
      setOrder(null);
      setError(reason?.response?.data?.message ?? reason?.message ?? "Registration submit nahi ho saki.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.container}>
        <View style={modalStyles.header}>
          <View style={{ flex: 1 }}>
            <Text style={modalStyles.title}>Pay for {badge === "gold" ? "Gold" : "Silver"} Badge</Text>
            {order && <Text style={modalStyles.subtitle}>₹{order.amount.toLocaleString("en-IN")} · {order.monthlyBookingLimit} bookings/month</Text>}
          </View>
          <TouchableOpacity onPress={onClose} disabled={submitting} style={modalStyles.close}>
            <MaterialIcons name="close" size={23} color="#3F1D2F" />
          </TouchableOpacity>
        </View>

        {(loading || submitting) && <View style={modalStyles.center}><ActivityIndicator size="large" color="#E4005A" /><Text style={modalStyles.info}>{submitting ? "Verifying payment and submitting registration…" : "Preparing secure checkout…"}</Text></View>}
        {error && !loading && !submitting && <View style={modalStyles.center}><MaterialIcons name="error-outline" size={44} color="#E4005A" /><Text style={modalStyles.error}>{error}</Text><TouchableOpacity style={modalStyles.retry} onPress={prepare}><Text style={modalStyles.retryText}>Try Again</Text></TouchableOpacity></View>}
        {order && !submitting && <WebView
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
          onError={() => { setOrder(null); setError("Payment gateway load nahi ho saka."); }}
        />}
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFDF0", paddingTop: 42 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#FFB3BF" },
  title: { color: "#3F1D2F", fontSize: 20, fontWeight: "800" }, subtitle: { color: "#8D6171", marginTop: 3 }, close: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 }, info: { color: "#6C2D45", marginTop: 14, textAlign: "center" }, error: { color: "#E4005A", textAlign: "center", marginTop: 12 },
  retry: { marginTop: 18, backgroundColor: "#E4005A", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12 }, retryText: { color: "#FFFFFF", fontWeight: "700" },
});

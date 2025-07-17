import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { toDecimalString, fetchEthToUsd, fetchSTRKToUsd } from "@/utils/AppUtils";

const ConfirmPostModal = ({
  visible,
  onConfirm,
  onCancel,
  message,
  gasFee,
  platformFee,
}) => {
  const [totalInUsd, setTotalInUsd] = useState("0");
  const [loading, setLoading] = useState(true);

  const total = Number(gasFee) + Number(platformFee);

  
  const getUsdValue = async () => {
    setLoading(true);
    try {
      const strkPrice = await fetchSTRKToUsd();
      const totalInStrk = strkPrice * total;
      setTotalInUsd(totalInStrk.toFixed(6));
    } catch (e) {
      console.log("error in fetching ", e);
      setTotalInUsd("0");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) getUsdValue();
  }, [gasFee, platformFee, visible]);

  return (
    <Modal isVisible={visible} backdropColor="#000" backdropOpacity={0.7}>
      <View style={styles.modalBox}>
        <Text style={styles.title}>Almost There!</Text>

        {loading ? (
          <View style={{ marginTop: 24 }}>
            <ActivityIndicator size="large" color="#1f87fc" />
            <Text style={[styles.subtext, { marginTop: 12 }]}>
              Loading fees...
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.subtext}>Review Fees before Transaction:</Text>
            <Text style={styles.feeText}>⛽ Gas Fee: ~{gasFee} STRK</Text>
            <Text style={styles.feeText}>
              🎯 Platform Fee: ~{platformFee} STRK
            </Text>
            <Text
              style={[
                styles.feeText,
                { fontWeight: "bold", marginTop: 25, textAlign: "left" },
              ]}
            >
              🧾 Total: {parseFloat(toDecimalString(total)).toFixed(6).toString()} STRK
            </Text>
            <Text
              style={[
                styles.feeText,
                {
                  fontWeight: "bold",
                  textAlign: "left",
                },
              ]}
            >
              $ {totalInUsd}
            </Text>
          </>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, loading && { opacity: 0.5 }]}
            onPress={onConfirm}
            disabled={loading}
          >
            <Text style={styles.confirmText}>
              {loading ? "Please wait..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBox: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 12,
  },
  subtext: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    marginTop: 8,
  },
  feeText: {
    fontSize: 16,
    color: "#1f87fc",
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    marginTop: 24,
    width: "100%",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#1f87fc",
  },
  cancelText: {
    color: "#fff",
    textAlign: "center",
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ConfirmPostModal;

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { toDecimalString, fetchEthToUsd } from "@/utils/AppUtils";

const ConfirmPostModal = ({
  visible,
  onConfirm,
  onCancel,
  message,
  gasFee,
  platformFee,
}) => {
  //   console.log(gasFee);
  const [totalInUsd, setTotalInUsd] = useState("0");

  const total = Number(gasFee) + Number(platformFee);

  const getUsdValue = async () => {
    const ethPrice = await fetchEthToUsd();
    const total = Number(gasFee) + Number(platformFee);
    const totalInEth = ethPrice * total;
    setTotalInUsd(totalInEth.toFixed(6));
  };

  useEffect(() => {
    getUsdValue();
  }, [gasFee, platformFee]);

  return (
    <Modal isVisible={visible} backdropColor="#000" backdropOpacity={0.7}>
      <View style={styles.modalBox}>
        <Text style={styles.title}>Almost There!</Text>
        <Text style={styles.subtext}>Review Fees before Transaction:</Text>
        <Text style={styles.feeText}>⛽ Gas Fee: ~{gasFee} ETH</Text>
        <Text style={styles.feeText}>🎯 Platform Fee: ~{platformFee} ETH</Text>
        <Text
          style={[
            styles.feeText,
            { fontWeight: "bold", marginTop: 25, textAlign: "left" },
          ]}
        >
          🧾 Total: {toDecimalString(total)} ETH
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

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmText}>Continue</Text>
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

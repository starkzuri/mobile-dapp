import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const TransactionFeeModal = ({
  visible,
  onClose,
  onConfirm,
  gasFee = "0.00045",
  platformFee = "0.001",
  currency = "ETH",
  transactionType = "Create Post",
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowAnimation(true);
    }
  }, [visible]);

  const handleConfirm = async () => {
    setIsConfirming(true);

    try {
      await onConfirm();

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Transaction Submitted! 🎉",
        text2: "Your post is being processed on the blockchain",
        visibilityTime: 4000,
        position: "top",
        topOffset: 60,
      });

      onClose();
    } catch (error) {
      console.error("Transaction failed:", error);

      Toast.show({
        type: "error",
        text1: "Transaction Failed 😔",
        text2: "Please try again or check your wallet balance",
        visibilityTime: 4000,
        position: "top",
        topOffset: 60,
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const totalFee = (parseFloat(gasFee) + parseFloat(platformFee)).toFixed(6);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.8}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
    >
      <View style={styles.modalContent}>
        {/* Header with Animation */}
        <View style={styles.header}>
          {showAnimation && (
            <View style={styles.animationContainer}>
              <LottieView
                source={{
                  uri: "https://assets2.lottiefiles.com/packages/lf20_V9t630.json",
                }} // Wallet animation from Lottie Files
                autoPlay
                loop={false}
                style={styles.lottieAnimation}
              />
            </View>
          )}
          <Text style={styles.title}>Transaction Fees</Text>
          <Text style={styles.subtitle}>Review fees before proceeding</Text>
        </View>

        {/* Drag Indicator */}
        <View style={styles.dragIndicator} />

        {/* Transaction Details */}
        <View style={styles.transactionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Type</Text>
            <Text style={styles.detailValue}>{transactionType}</Text>
          </View>
        </View>

        {/* Fee Breakdown */}
        <View style={styles.feeContainer}>
          <Text style={styles.feeTitle}>Fee Breakdown</Text>

          <View style={styles.feeRow}>
            <View style={styles.feeLeft}>
              <Text style={styles.feeLabel}>Gas Fee</Text>
              <Text style={styles.feeDescription}>Network processing cost</Text>
            </View>
            <Text style={styles.feeAmount}>
              {gasFee} {currency}
            </Text>
          </View>

          <View style={styles.feeRow}>
            <View style={styles.feeLeft}>
              <Text style={styles.feeLabel}>Platform Fee</Text>
              <Text style={styles.feeDescription}>Stark Zuri service fee</Text>
            </View>
            <Text style={styles.feeAmount}>
              {platformFee} {currency}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalAmount}>
              {totalFee} {currency}
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 Your post will be stored on the blockchain and earn rewards based
            on engagement
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isConfirming}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              isConfirming && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <View style={styles.loadingContainer}>
                <LottieView
                  source={{
                    uri: "https://assets10.lottiefiles.com/packages/lf20_szlepvdh.json",
                  }} // Loading animation from Lottie Files
                  autoPlay
                  loop
                  style={styles.loadingAnimation}
                />
              </View>
            ) : (
              <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    paddingTop: 8,
    maxHeight: "80%",
    minHeight: 300,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  animationContainer: {
    backgroundColor: "rgba(31, 135, 252, 0.1)",
    borderRadius: 30,
    padding: 8,
    marginBottom: 10,
  },
  lottieAnimation: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  transactionDetails: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    color: "#ccc",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f87fc",
  },
  feeContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  feeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  feeLeft: {
    flex: 1,
  },
  feeLabel: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 2,
  },
  feeDescription: {
    fontSize: 14,
    color: "#999",
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f87fc",
  },
  separator: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f87fc",
  },
  infoContainer: {
    backgroundColor: "rgba(31, 135, 252, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: "#1f87fc",
  },
  infoText: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#1f87fc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#1f87fc80",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingAnimation: {
    width: 24,
    height: 24,
  },
});

export default TransactionFeeModal;

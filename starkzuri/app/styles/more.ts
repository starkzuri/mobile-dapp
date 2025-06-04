import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "#1F2937",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  walletCard: {
    padding: 20,
    marginBottom: 8,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  walletIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(31, 135, 252, 0.2)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  walletInfo: {
    flex: 1,
  },
  walletBalance: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  walletLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 2,
  },
  walletStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  walletStat: {
    flex: 1,
  },
  walletStatValue: {
    color: "#10B981",
    fontSize: 16,
    fontWeight: "bold",
  },
  walletStatLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f87fc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  menuItemSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  appVersion: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  copyright: {
    color: "#4B5563",
    fontSize: 12,
    textAlign: "center",
  },
});

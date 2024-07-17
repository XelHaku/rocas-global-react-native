import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";

const CloseButton = ({ onPress }) => (
  <TouchableOpacity style={styles.closeButton} onPress={onPress}>
    <Text style={styles.closeButtonText}>Cerrar</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CloseButton;

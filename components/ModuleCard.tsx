import React from "react";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { Text } from "@/components/Themed";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2; // 2 columns with 20px padding on sides and 20px gap

const ModuleCard = ({ modulo, onPress }) => (
  <TouchableOpacity
    style={[styles.moduleCard, { backgroundColor: modulo.color || "#4CAF50" }]}
    onPress={onPress}
  >
    <View style={styles.iconContainer}>
      <FontAwesome name={modulo.icono || "book"} size={36} color="white" />
    </View>
    <Text style={styles.moduleTitle}>{modulo.nombre}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  moduleCard: {
    width: cardWidth,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default ModuleCard;

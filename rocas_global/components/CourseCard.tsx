import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";

const CourseCard = ({ onPress, id, nombre }) => (
  <TouchableOpacity style={styles.courseContainer} onPress={onPress}>
    <Text style={styles.courseTitle}>Curso {id}</Text>
    <Text style={styles.courseTitle}>{nombre}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  courseContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CourseCard;

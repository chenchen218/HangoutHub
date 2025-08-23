import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Header = ({ location }: { location: string }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Explore</Text>
    <TouchableOpacity style={styles.locationRow}>
      <Text style={styles.location}>{location}</Text>
      <Ionicons name="chevron-down" size={18} color="#222" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    color: "#222",
    marginRight: 4,
  },
});

export default Header;

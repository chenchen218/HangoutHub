import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const BottomNavBar = () => (
  <View style={styles.container}>
    <TouchableOpacity>
      <Ionicons name="home" size={28} color="#2563eb" />
    </TouchableOpacity>
    <TouchableOpacity>
      <Ionicons name="search" size={28} color="#b0b8c1" />
    </TouchableOpacity>
    <TouchableOpacity>
      <Ionicons name="heart" size={28} color="#b0b8c1" />
    </TouchableOpacity>
    <TouchableOpacity>
      <Ionicons name="person" size={28} color="#b0b8c1" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default BottomNavBar;

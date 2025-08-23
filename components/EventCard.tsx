// in /components/EventCard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const EventCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Game Night</Text>
      <Text style={styles.details}>Board games at the local cafe. 7 PM</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
});

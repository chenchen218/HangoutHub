import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const TravelCard = ({ item, type }: { item: any; type: string }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.title}>{item.title}</Text>
      {type === "popular" ? (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      ) : (
        <View style={styles.tagRow}>
          <Text style={styles.tag}>{item.tag}</Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginLeft: 24,
    marginRight: 8,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 110,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    color: "#222",
    fontWeight: "600",
    fontSize: 13,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default TravelCard;

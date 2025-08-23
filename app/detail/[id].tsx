import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  fetchPopularItems,
  fetchRecommendedItems,
  TravelItem,
} from "../../services/api";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState<TravelItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both popular and recommended items to find the one we need
        const [popular, recommended] = await Promise.all([
          fetchPopularItems(),
          fetchRecommendedItems(),
        ]);

        const allItems = [...popular, ...recommended];
        const foundItem = allItems.find((i) => i.id === id);

        if (foundItem) {
          setItem(foundItem);
        } else {
          setError("Item not found");
        }
      } catch (err) {
        setError("Failed to load item details");
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handlePhoneCall = () => {
    if (item?.phone) {
      Linking.openURL(`tel:${item.phone}`);
    }
  };

  const handleWebsite = () => {
    if (item?.website) {
      Linking.openURL(item.website);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 16, color: "#666" }}>Loading...</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#e53e3e", textAlign: "center" }}>
          {error || "Item not found"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "#f0f6ff" }}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        {"rating" in item ? (
          <View style={styles.row}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.tag}>{item.tag}</Text>
          </View>
        )}
        {item.price && <Text style={styles.price}>${item.price}</Text>}
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}

        {/* Contact Information */}
        {item.address && (
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#666" />
              <Text style={styles.infoText}>{item.address}</Text>
            </View>
          </View>
        )}

        {item.phone && (
          <TouchableOpacity
            style={styles.infoSection}
            onPress={handlePhoneCall}
          >
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#2563eb" />
              <Text style={[styles.infoText, styles.linkText]}>
                {item.phone}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {item.website && (
          <TouchableOpacity style={styles.infoSection} onPress={handleWebsite}>
            <View style={styles.infoRow}>
              <Ionicons name="globe" size={20} color="#2563eb" />
              <Text style={[styles.infoText, styles.linkText]}>
                Visit Website
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {item.openingHours && (
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.infoText}>{item.openingHours}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 48,
    left: 24,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    marginLeft: 6,
    color: "#222",
    fontWeight: "600",
    fontSize: 16,
  },
  tag: {
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#444",
    flex: 1,
  },
  linkText: {
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f6ff",
  },
});

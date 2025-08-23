// in /app/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import CategoryTabs from "../components/CategoryTabs";
import Header from "../components/Header";
import HorizontalCardList from "../components/HorizontalCardList";
import SearchBar from "../components/SearchBar";
import {
  fetchPopularItems,
  fetchRecommendedItems,
  TravelItem,
} from "../services/api";

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Location");
  const [popularItems, setPopularItems] = useState<TravelItem[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both popular and recommended items
        const [popular, recommended] = await Promise.all([
          fetchPopularItems(),
          fetchRecommendedItems(),
        ]);

        setPopularItems(popular);
        setRecommendedItems(recommended);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search term and category
  const filteredPopular = useMemo(() => {
    return popularItems.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Location" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [popularItems, searchTerm, selectedCategory]);

  const filteredRecommended = useMemo(() => {
    return recommendedItems.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Location" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recommendedItems, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#f0f6ff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 16, color: "#666" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#f0f6ff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#e53e3e", textAlign: "center", padding: 20 }}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f6ff" }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <Header location="Aspen, USA" />
          <SearchBar onSearch={setSearchTerm} />
          <CategoryTabs onCategoryChange={setSelectedCategory} />
          <HorizontalCardList
            title="Popular"
            data={filteredPopular}
            type="popular"
          />
          <HorizontalCardList
            title="Recommended"
            data={filteredRecommended}
            type="recommended"
          />
        </ScrollView>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

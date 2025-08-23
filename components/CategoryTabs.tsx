import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = ["Location", "Hotels", "Food", "Adventure", "Activities"];

const CategoryTabs = ({
  onCategoryChange,
}: {
  onCategoryChange: (category: string) => void;
}) => {
  const [active, setActive] = useState(0);

  const handleCategoryPress = (index: number) => {
    setActive(index);
    onCategoryChange(categories[index]);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
    >
      <View style={styles.row}>
        {categories.map((cat, idx) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, active === idx && styles.activeTab]}
            onPress={() => handleCategoryPress(idx)}
          >
            <Text
              style={[styles.tabText, active === idx && styles.activeTabText]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 16,
    marginHorizontal: 0,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#eaf1fb",
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#2563eb",
  },
  tabText: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 15,
  },
  activeTabText: {
    color: "#fff",
  },
});

export default CategoryTabs;

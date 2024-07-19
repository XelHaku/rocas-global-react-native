// components/BibleView.js
import React from "react";
import { View, FlatList } from "react-native";
import { BibleMetadata } from "../json/biblia";
import BookItem from "./BookItem";

const BibleView = ({ navigation }) => {
  const books = Object.keys(BibleMetadata);

  return (
    <View>
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <BookItem
            book={item}
            onPress={() => navigation.navigate("Chapters", { book: item })}
          />
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

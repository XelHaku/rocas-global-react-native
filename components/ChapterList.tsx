// components/ChapterList.js
import React from "react";
import { View, FlatList } from "react-native";
import { BibleMetadata } from "../assets/biblia";
import ChapterItem from "./ChapterItem";

const ChapterList = ({ route, navigation }) => {
  const { book } = route.params;
  const chapters = Array.from(
    { length: BibleMetadata[book].chapters },
    (_, i) => i + 1
  );

  return (
    <View>
      <FlatList
        data={chapters}
        renderItem={({ item }) => (
          <ChapterItem
            chapter={item}
            onPress={() =>
              navigation.navigate("Verses", { book, chapter: item })
            }
          />
        )}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};

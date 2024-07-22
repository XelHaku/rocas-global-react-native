// components/VerseList.js
import React from "react";
import { View, FlatList } from "react-native";
import { Bible } from "../json/biblia";
import VerseItem from "./VerseItem";

const VerseList = ({ route }) => {
  const { book, chapter } = route.params;
  const verses = Bible[book][chapter - 1];

  return (
    <View>
      <FlatList
        data={verses}
        renderItem={({ item, index }) => (
          <VerseItem verse={item} number={index + 1} />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

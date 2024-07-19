import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text } from '@/components/Themed';
import { Picker } from '@react-native-picker/picker';

import { bibliaRV1960 } from '@/constants/bibliaRV1960';
import { bibliaContent } from '@/constants/bibliaContent';

export default function BibleView() {
  const [selectedBook, setSelectedBook] = useState(bibliaRV1960[0].archivo);

  const getBookContent = (bookFile: string) => {
    const content = bibliaContent[bookFile as keyof typeof bibliaContent];
    return content ? JSON.stringify(content, null, 2) : 'Contenido no disponible';
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedBook}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedBook(itemValue)}
      >
        {bibliaRV1960.map((book) => (
          <Picker.Item key={book.archivo} label={book.nombre} value={book.archivo} />
        ))}
      </Picker>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.content}>{getBookContent(selectedBook)}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  content: {
    fontSize: 16,
  },
});
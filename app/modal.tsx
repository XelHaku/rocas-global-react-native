// import React, { useState } from "react";
// import { StyleSheet, Pressable, Platform } from 'react-native';
// import { Text, View } from "@/components/Themed";
// import { StatusBar } from 'expo-status-bar';
// import { Link } from 'expo-router';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import Colors from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
// import ChapterModal from "@/components/ChapterModal";

// export default function ModalScreen() {
//   const [showModal, setShowModal] = useState(false);
//   const colorScheme = useColorScheme();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Modal</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
//       <Pressable
//         onPress={() => setShowModal(true)}
//         style={({ pressed }) => ({
//           opacity: pressed ? 0.5 : 1,
//         })}
//       >
//         <FontAwesome
//           name="info-circle"
//           size={25}
//           color={Colors[colorScheme ?? 'light'].text}
//           style={{ marginRight: 15 }}
//         />
//       </Pressable>

//       {showModal && (
//         <ChapterModal
//           book="Génesis"
//           chapter={3}
//         />
//       )}

//       <Link href="/" style={styles.link}>
//         <Text style={styles.linkText}>Go to home screen!</Text>
//       </Link>

//       <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
//   link: {
//     marginTop: 15,
//     paddingVertical: 15,
//   },
//   linkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
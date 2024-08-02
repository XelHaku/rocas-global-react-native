import { Platform } from 'react-native';

let EncryptedStorage;

if (Platform.OS === 'web') {
  // Implementación mock para web
  EncryptedStorage = {
    setItem: async (key, value) => localStorage.setItem(key, value),
    getItem: async (key) => localStorage.getItem(key),
    removeItem: async (key) => localStorage.removeItem(key),
    clear: async () => localStorage.clear(),
  };
} else {
  // Importación real para plataformas nativas
  EncryptedStorage = require('react-native-encrypted-storage').default;
}

export default EncryptedStorage;
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  bookSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  selectedBookText: {
    fontSize: 16,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bookListContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bookItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  testamentSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  testamentButton: {
    width: 120,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'gold',
  },
  testamentButtonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});
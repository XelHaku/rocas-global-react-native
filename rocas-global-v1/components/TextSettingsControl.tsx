import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface TextSettingsControlProps {
  fontSize: number;
  lineHeight: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onIncreaseLineHeight: () => void;
  onDecreaseLineHeight: () => void;
  isVisible: boolean;
  onClose: () => void;
}

const TextSettingsControl: React.FC<TextSettingsControlProps> = ({
  fontSize,
  lineHeight,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onIncreaseLineHeight,
  onDecreaseLineHeight,
  isVisible,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Tamaño de letra: {fontSize}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={onDecreaseFontSize} style={styles.button}>
                <FontAwesome5 name="minus" size={16} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onIncreaseFontSize} style={styles.button}>
                <FontAwesome5 name="plus" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.controlGroup}>
            <Text style={styles.label}>Espaciado: {lineHeight}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={onDecreaseLineHeight} style={styles.button}>
                <FontAwesome5 name="minus" size={16} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onIncreaseLineHeight} style={styles.button}>
                <FontAwesome5 name="plus" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  controlGroup: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: '#D4AF37',
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 10,
  },
});

export default TextSettingsControl;
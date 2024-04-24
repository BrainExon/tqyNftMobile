import React from 'react';
import {Text, Modal, ActivityIndicator, View, StyleSheet} from 'react-native';

const ProcessingModal = ({visible, error}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {error ? (
            <Text>{error}</Text>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default ProcessingModal;

import React from 'react';
import {Modal, View, Text, Button, StyleSheet} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const UserModal: React.FC<UserModalProps> = ({visible, onClose}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.container}>
        <Text>login success!</Text>
        <Button title="OK" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default UserModal;

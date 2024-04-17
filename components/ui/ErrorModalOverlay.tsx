import React, {useState} from 'react';
import {Text, View, Button} from 'react-native';
import ErrorModal from './ErrorModal';
import {stripStringification} from '../../util/util';

const ErrorModalOverlay = ({visible, message, onClose}) => {
  const cleanMessage = stripStringification(message);
  console.log(`[ErrorModalOverlay] cleanMessage: ${cleanMessage}`);
  return (
    <ErrorModal animationType="slide" transparent>
      {' '}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        {' '}
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          {' '}
          <Text style={{color: 'black'}}>{cleanMessage}</Text>{' '}
          <Button title="Close" onPress={onClose} />{' '}
        </View>{' '}
      </View>{' '}
    </ErrorModal>
  );
};
export default ErrorModalOverlay;

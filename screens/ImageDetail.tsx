import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const ImageDetail = ({route}) => {
  const {uri} = route.params;
  return (
    <View style={styles.imgContainer}>
      <Image source={{uri: uri}} style={styles.imgImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  imgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
});

export default ImageDetail;

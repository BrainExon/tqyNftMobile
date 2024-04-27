import React, {useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ImageDetail = ({route}) => {
  const {uri} = route.params;
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(true);
  //TODO: really, imageList needs to be cached on UserScreen page instead of making an navigation call...
  const handleImagePress = () => {
    //setIsVisible(!isVisible);
    console.log('\n----\n[ImageDetail] navigation to UserScreen...\n----\n');
    navigation.navigate('UserScreen');
  };
  return (
    <TouchableOpacity onPress={() => handleImagePress()}>
      <View style={styles.imgContainer}>
        {isVisible && <Image source={{uri: uri}} style={styles.imgImage} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
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

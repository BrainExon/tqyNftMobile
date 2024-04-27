import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  FlatList,
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import Config from 'react-native-config';
import {useNavigation} from '@react-navigation/native';
const path = require('path');

const ImageList = ({items}) => {
  const [imageUris, setImageUris] = useState([]);
  const [numColumns, setNumColumns] = useState(3);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchImageUri = async filename => {
      try {
        const cleanFilename = path.basename(filename);
        const endPoint = 'image';
        return `${Config.NODEJS_EXPRESS_SERVER}/${endPoint}/${cleanFilename}`;
      } catch (error) {
        console.error('Error fetching image URI:', error);
        return null;
      }
    };
    const fetchData = async () => {
      const uris = await Promise.all(items.map(item => fetchImageUri(item)));
      setImageUris(uris);
    };
    fetchData().catch(e =>
      console.log(`fetchData error: ${JSON.stringify(e)}`),
    );
  }, [items]);
  const handleImagePress = index => {
    navigation.navigate('ImageDetail', {uri: imageUris[index]});
  };
  const renderItem = ({item, index}) => {
    if (!imageUris[index]) {
      return null;
    }

    return (
      <TouchableOpacity onPress={() => handleImagePress(index)}>
        <View style={styles.itemContainer}>
          <Image source={{uri: imageUris[index]}} style={styles.image} />
        </View>
      </TouchableOpacity>
    );
  };
  const windowWidth = Dimensions.get('window').width;
  //const imageWidth = windowWidth / numColumns - 20;
  const keyExtractor = (item, index) => `${index}-${numColumns}`;
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      extraData={numColumns}
    />
  );
};

const windowWidth = Dimensions.get('window').width;
const imageWidth = windowWidth / 3 - 20;

const styles = StyleSheet.create({
  itemContainer: {
    margin: 10,
    width: imageWidth,
    alignItems: 'center',
  },
  image: {
    width: imageWidth,
    height: imageWidth,
  },
});

export default ImageList;

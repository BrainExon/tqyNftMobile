import React, {useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {categories} from '../constants/constants';

const CategoryList = ({categoryCallback}) => {
  console.log('[CategoryList]... ');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryPress = category => {
    setSelectedCategory(category);
    categoryCallback(category);
    console.log(
      `[CategoryList] selected Category: ${JSON.stringify(category)}`,
    );
  };

  return (
    <View style={styles.container}>
      {categories.map((category, index) => (
        <Button
          key={index}
          title={category.label}
          onPress={() => handleCategoryPress(category.value)}
          color={selectedCategory === category ? 'blue' : 'gray'}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryList;

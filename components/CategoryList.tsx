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
        <View style={styles.buttonContainer} key={index}>
          <Button
            title={category.label}
            onPress={() => handleCategoryPress(category.value)}
            color={selectedCategory === category.value ? 'blue' : 'gray'}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // Align children vertically
    alignItems: 'stretch', // Stretch children to match the container's width
    padding: 40,
  },
  buttonContainer: {
    margin: 5, // Margin around each button
    paddingHorizontal: 10, // Horizontal padding inside each button container
    height: 40, // Set a fixed height for each button
  },
});

export default CategoryList;

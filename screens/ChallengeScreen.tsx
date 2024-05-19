import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useWindowDimensions} from 'react-native';
import CategoryList from '../components/CategoryList';
import {dbFind} from '../util/dbUtils';
import {isEmpty, isObjectEmpty, setOutline} from '../util/util';
import {useNavigation} from '@react-navigation/native';
import UserModal from '../components/ui/UserModal';
import ChallengesList from '../components/ChallengesList';
import {useSelector} from 'react-redux';
import {getUserState} from '../redux/userSlice';

const generateItemStyles = (size: any) => {
  const baseItemStyles = StyleSheet.create({
    userContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    searchButtonStyle: {
      alignSelf: 'center',
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      margin: 10,
    },
    searchButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });
  const styles = JSON.parse(JSON.stringify(baseItemStyles));
  if (setOutline()) {
    Object.keys(styles).forEach(key => {
      Object.assign(styles[key], {
        borderStyle: 'solid',
        borderColor: 'yellow',
        borderWidth: 1,
      });
    });
  }
  return styles;
};

function ChallengeScreen() {
  const navigation = useNavigation();
  const boardSize = useWindowDimensions();
  const styles = generateItemStyles(boardSize);
  const [challenges, setChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const userState = useSelector(getUserState);
  const handleErrorCallback = useCallback((error: any) => {
    if (isObjectEmpty(error) || isEmpty(error)) {
      return;
    }
    const errorMessage =
      typeof error !== 'string' ? JSON.stringify(error) : error;
    setError(errorMessage);
    setShowModal(true);
  }, []);

  const handleModalButtonClose = () => {
    setShowModal(false);
  };

  const handleSelectedCategory = async category => {
    setSelectedCategory(category);
    fetchData(category);
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  const fetchData = async category => {
    try {
      const searchByUserId = {
        collection: 'challenges',
        conditions: {
          owner: userState.userId,
          category: category,
        },
      };
      const foundChallenges = await dbFind({
        endPoint: 'find',
        conditions: searchByUserId,
        setError: handleErrorCallback,
      });
      if (foundChallenges.data) {
        const updatedBucketArray = [];
        foundChallenges.data.forEach(challenge => {
          if (challenge) {
            const item = {
              _id: challenge._id,
              name: challenge.name,
              doubloon: challenge.doubloon,
              nft: challenge.nft,
              chId: challenge.chId,
              date: challenge.date,
              description: challenge.description,
              category: challenge.category,
              dataTxId: challenge.dataTxId,
            };
            updatedBucketArray.push(item);
          }
        });
        setChallenges(updatedBucketArray);
      }
    } catch (error) {
      handleErrorCallback(
        `[ChallengeScreen] Error fetching Challenges: ${error}`,
      );
      return;
    }
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      if (!selectedCategory) {
        // Optionally fetch data or just wait for category selection
      }
    });
    return onFocus;
  }, [navigation, selectedCategory]);

  return (
    <View style={styles.userContainer}>
      {showModal ? (
        <UserModal
          visible={showModal}
          message={''}
          error={error ?? ''}
          onClose={handleModalButtonClose}
          showActivity={false}
        />
      ) : selectedCategory ? (
        <ChallengesList items={challenges} />
      ) : (
        <CategoryList categoryCallback={handleSelectedCategory} />
      )}
      <TouchableOpacity
        onPress={handleClearCategory}
        style={styles.searchButtonStyle}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ChallengeScreen;

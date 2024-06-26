import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {dbFind} from '../util/dbUtils';
import React, {useState, useEffect} from 'react';
import {isTablet, setOutline} from '../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import UserModal from './ui/UserModal';
import {useNavigation} from '@react-navigation/native';

const EditChallenge = ({route}) => {
  console.log('\n------\n[EditChallenge]....\n------\n');
  const {challengeId} = route.params;
  console.log(`[EditChallenge] challengeId: ${challengeId}`);
  const navigation = useNavigation();
  const chSize = useWindowDimensions();
  const styles = generateEditChStyles(chSize);
  const [showModal, setShowModal] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleErrorCallback = (errMsg: any) => {
    setErrorMsg(errMsg);
    setShowModal(true);
  };

  const handleUserChPress = () => {
    setShowModal(false);
    navigation.navigate('ChallengeScreen');
  };

  const handleButtonClose = () => {
    setShowModal(false);
    navigation.navigate('SignupScreen');
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const findChallenge = {
          collection: 'challenges',
          conditions: {
            chId: challengeId,
          },
        };
        const foundChallenge = await dbFind({
          endPoint: 'find_one',
          conditions: findChallenge,
          setError: handleErrorCallback,
        });
        console.log(
          `[EditChallenge] FOUND challenge: ${JSON.stringify(
            foundChallenge,
            null,
            2,
          )}`,
        );
        setChallenge(foundChallenge);
      } catch (error) {
        handleErrorCallback(
          `[EditChallenge] Error fetching Challenge with ID: ${challengeId}`,
        );
        return;
      }
    };
    fetchChallenge();
  }, []);
  console.log(
    `[EditChallenge] challenge: ${JSON.stringify(challenge, null, 2)}`,
  );
  return (
    <View style={styles.editChContent}>
      {challenge && (
        <View style={styles.editChContent}>
          <View style={styles.editChContainer}>
            <TouchableOpacity onPress={() => handleUserChPress()}>
              <View style={styles.editChImgContainer}>
                {challenge.data.doubloon && (
                  <Image
                    source={{uri: challenge.data.doubloon}}
                    style={styles.editChImgImage}
                  />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.editChTextTitle}>{challenge.data.name}</Text>
            <Text style={styles.editChText}>
              Description: {challenge.data.description}
            </Text>
            <Text style={styles.editChUsersTitle}>Users:</Text>
            <FlatList
              data={challenge.data.users}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.editChUsersContainer}>
                  <Text style={styles.editChText}>{item}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ChallengeScreen')}
              style={styles.cancelButtonStyle}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

function generateEditChStyles(size: any) {
  const chStyles = StyleSheet.create({
    cancelButtonStyle: {
      marginTop: 20,
      backgroundColor: 'red', // Choose a suitable color or keep it transparent
      padding: 10,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: 'white',
      fontSize: 12, // Font size as 12 pt
    },
    editChContent: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    editChText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    editChButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      //backgroundColor: 'rgba(200, 200, 200, 0.75)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    editChButtonText: {
      color: 'black',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
    editChInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    editChInputDesc: {
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    editChImgContainer: {
      marginVertical: isTablet(size.width, size.height) ? hp('6') : wp('8'),
      alignItems: 'center',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    editChImgImage: {
      width: 200,
      height: 200,
      resizeMode: 'cover',
    },
    editChImgButtonGroup: {
      width: '100%',
      flexDirection: 'row',
      marginVertical: isTablet(size.width, size.height) ? hp('2') : wp('20'),
    },
    editChChButton: {
      flex: 1,
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    editChCancelButton: {
      flex: 1,
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('2'),
    },
    editChModalImage: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      height: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      marginBottom: isTablet(size.width, size.height) ? hp('20') : wp('35'),
      //backgroundColor: 'transparent',
    },
    editChTextTitle: {
      fontWeight: 'bold',
      fontSize: isTablet(size.width, size.height) ? hp('7') : wp('5'),
      margin: isTablet(size.width, size.height) ? hp('4') : wp('3'),
      color: 'white',
    },
    editChUsersTitle: {
      fontWeight: 'bold',
      textAlign: 'left',
      fontSize: isTablet(size.width, size.height) ? hp('7') : wp('5'),
      margin: isTablet(size.width, size.height) ? hp('4') : wp('3'),
      color: 'white',
    },
    editChContainer: {
      //backgroundColor: 'rgba(0, 0, 0, 0.7)',
      alignItems: 'center',
      marginVertical: isTablet(size.width, size.height) ? hp('4') : wp('2'),
      padding: isTablet(size.width, size.height) ? hp('8') : wp('4'),
    },
    editChUsersContainer: {
      alignItems: 'center',
      margin: isTablet(size.width, size.height) ? hp('4') : wp('1'),
      padding: isTablet(size.width, size.height) ? hp('8') : wp('2'),
      borderStyle: 'solid',
      borderColor: 'white',
      borderWidth: 2,
    },
    editChCenteredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  const styles = JSON.parse(JSON.stringify(chStyles));
  if (setOutline()) {
    Object.keys(styles).forEach(key => {
      Object.assign(styles[key], {
        borderStyle: 'solid',
        borderColor: 'red',
        borderWidth: 2,
      });
    });
  }
  return styles;
  // eslint-enable
}

export default EditChallenge;

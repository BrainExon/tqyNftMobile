import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Config from 'react-native-config';
import React, {useState, useEffect} from 'react';
import {isTablet, setOutline} from '../util/util';
import {Picker} from '@react-native-picker/picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {categories} from '../constants/constants';
import {v4 as uuidv4} from 'uuid';
import {dbFindOne, dbUpsert} from '../util/dbUtils';
import {Challenge} from '../components/models/Challenge';
import UserModal from '../components/ui/UserModal';
import {useSelector} from 'react-redux';
import {getUserState} from '../redux/userSlice';
import {useNavigation} from '@react-navigation/native';
const ChallengeScreen = () => {
  const navigation = useNavigation();
  const userState = useSelector(getUserState);
  const chSize = useWindowDimensions();
  const styles = generateChallengeStyles(chSize);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  console.log(`[ChallengeScreen] userState: ${JSON.stringify(userState)}`);
  const handleErrorCallback = (errMsg: any) => {
    setError(errMsg);
  };
  const handleButtonClose = () => {
    setShowModal(false);
    navigation.navigate('LoginScreen');
  };

  useEffect(() => {
    console.log(`[useEffect] userState: ${JSON.stringify(userState)}`);
    console.log(`[useEffect] userState.role: ${userState.role}`);
    const checkUserRole = () => {
      if (userState.role !== 'creator') {
        const errorMessage = Config.AUTH_ERROR?.replace(
          '${APP_NAME}',
          Config.APP_NAME,
        )?.replace('${DOUBLOON_DESIGNER}', Config.DOUBLOON_DESIGNER);
        setError(errorMessage);
        setShowModal(true);
      }
    };
    const focusListener = navigation.addListener('focus', checkUserRole);
    if (focusListener && focusListener.remove) {
      return () => {
        focusListener.remove();
      };
    }
  }, [userState, navigation]);

  const handleValueChange = itemValue => {
    setCategory(itemValue);
  };
  const handleSubmit = async () => {
    console.log('Category:', category);
    console.log('Name:', name);
    console.log('Description:', description);
    try {
      const challenge = new Challenge(
        uuidv4(),
        name,
        Date.now(),
        '',
        [],
        '',
        '',
        '',
        category,
        description,
      );
      await dbUpsert({
        endPoint: 'upsert_challenge',
        data: challenge,
        setError: handleErrorCallback,
      });
      // Show modal regardless of response
      setShowModal(true);
      setMessage('Challenge created!');
    } catch (e: any) {
      console.log('[ChallengeScreen] Error adding challenge:', e.message);
      setError(
        'Failed to create a Toqyn Challenge. Please check your network connection and try again.',
      );
      setShowModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Category:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue, itemIndex) => handleValueChange(itemValue)}>
        {categories.map((category, index) => (
          <Picker.Item
            key={index}
            label={category.label}
            value={category.value}
          />
        ))}
      </Picker>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        placeholder="Enter Name"
      />

      <Text>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={text => setDescription(text)}
        placeholder="Enter Description"
        multiline
      />

      <Button title="Submit" onPress={handleSubmit} />
      {showModal && (
        <UserModal
          visible={showModal}
          message={message ?? ''}
          error={error ?? ''}
          onClose={handleButtonClose}
        />
      )}
    </View>
  );
};
function generateChallengeStyles(size: any) {
  const chStyles = StyleSheet.create({
    chContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    chContent: {
      width: isTablet(size.width, size.height) ? hp('60') : wp('70'),
      backgroundColor: 'rgba(180, 0, 0, 0.4)',
      paddingVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      marginVertical: isTablet(size.width, size.height) ? hp('15') : wp('8'),
      borderStyle: 'solid',
      borderColor: 'red',
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('12') : wp('6'),
    },
    chText: {
      fontSize: isTablet(size.width, size.height) ? hp('2') : wp('4'),
      lineHeight: isTablet(size.width, size.height) ? hp('2') : wp('7'),
      flexDirection: 'row',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
    },
    chButton: {
      width: isTablet(size.width, size.height) ? hp('48') : wp('38'),
      backgroundColor: 'rgba(200, 200, 200, 0.75)',
      borderStyle: 'solid',
      borderColor: 'red',
      paddingVertical: isTablet(size.width, size.height) ? hp('2') : wp('3'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
    },
    chButtonText: {
      color: 'black',
      fontSize: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      textAlign: 'center',
    },
    container: {
      flex: 1,
      padding: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
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

export default ChallengeScreen;

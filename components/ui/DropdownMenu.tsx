import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {isTablet, setOutline} from '../../util/util';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

function generateDropStyle(size: any) {
  const dropStyles = StyleSheet.create({
    dropContainer: {
      position: 'absolute',
      top: isTablet(size.width, size.height) ? hp('35') : wp('28'),
      left: isTablet(size.width, size.height) ? hp('80') : wp('50'),
      width: isTablet(size.width, size.height) ? hp('40') : wp('48'),
      height: isTablet(size.width, size.height) ? hp('30') : wp('22'),
      borderStyle: 'solid',
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('.50'),
      borderRadius: isTablet(size.width, size.height) ? hp('4') : wp('2'),
      borderColor: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
    },
    dropIcon: {
      width: isTablet(size.width, size.height) ? hp('40') : wp('30'),
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    dropTitle: {
      fontSize: isTablet(size.width, size.height) ? hp('4') : wp('4'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      backgroundColor: 'transparent',
      color: 'white',
      textAlign: 'left',
    },
  });
  const styles = JSON.parse(JSON.stringify(dropStyles));
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
}

const DropdownMenu = ({options, onSelect}) => {
  const headSize = useWindowDimensions();
  const styles = generateDropStyle(headSize);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = option => {
    onSelect(option);
    setIsModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropIcon}
        onPress={() => setIsModalVisible(true)}>
        <Icon color={'white'} name={'bars'} size={24} />
      </TouchableOpacity>
      <Modal visible={isModalVisible} transparent={true} animationType="none">
        <View style={styles.dropContainer}>
          {options.map(option => (
            <TouchableOpacity key={option} onPress={() => handleSelect(option)}>
              <Text style={styles.dropTitle}>{option}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text style={styles.dropTitle}>[&nbsp;Close&nbsp;]</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default DropdownMenu;

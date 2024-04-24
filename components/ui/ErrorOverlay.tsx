import {View, StyleSheet, Text} from 'react-native';
import GlobalStyles from '../../constants/GlobalStyles';
import GenButton from './GenButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
const ErrorOverlay = ({message, onConfirm}) => (
  <View testID="test-error-overlay" style={styles.container}>
    <Text style={[styles.text, styles.title]}>
      {`An error occurred! ${JSON.stringify(message)}`}
    </Text>
    <Text style={styles.text}>{JSON.stringify(message)}</Text>
    <GenButton onPress={onConfirm} textStyle={undefined}>
      Okay
    </GenButton>
  </View>
);
export default ErrorOverlay;

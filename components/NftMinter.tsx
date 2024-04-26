import React, {useState, useCallback, useEffect} from 'react';
import Config from 'react-native-config';
import {PinNft, pinNft} from '../ipfs/blockchain';
import {urlExists} from '../util/httpUtils';
import {
  View,
  Image,
  Button,
  ActivityIndicator,
  Modal,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {isEmpty, isObjectEmpty, isTablet, setOutline} from '../util/util';
import {getUserState} from '../redux/userSlice';
import UserModal from './ui/UserModal';
import {useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import GlobalStyles from '../constants/GlobalStyles';

function generateMinterSytles(size: any) {
  const mintStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    inputContainerWrapper: {
      alignItems: 'center',
      width: isTablet(size.width, size.height) ? hp('80') : wp('70'),
      padding: isTablet(size.width, size.height) ? hp('6') : wp('4'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('9'),
      backgroundColor: 'rgba(100, 100, 100, 0.8)',
    },
    buttonGroup: {
      flexDirection: 'row',
      marginBottom: isTablet(size.width, size.height) ? hp('12') : wp('8'),
    },
    pickImageButton: {
      marginHorizontal: isTablet(size.width, size.height) ? hp('8') : wp('4'),
      width: isTablet(size.width, size.height) ? hp('12') : wp('40'),
      backgroundColor: 'rgba(100, 100, 100, 0.8)',
      color: GlobalStyles.colors.primary400,
    },
    mintThisNftButton: {
      marginHorizontal: isTablet(size.width, size.height) ? hp('8') : wp('4'),
      width: isTablet(size.width, size.height) ? hp('12') : wp('40'),
    },
    mintButton: {
      marginVertical: isTablet(size.width, size.height) ? hp('8') : wp('4'),
      marginHorizontal: isTablet(size.width, size.height) ? hp('8') : wp('4'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('8'),
    },
    modalImage: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      height: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      marginBottom: isTablet(size.width, size.height) ? hp('20') : wp('35'),
      backgroundColor: 'transparent',
    },
    textTitle: {
      paddingTop: isTablet(size.width, size.height) ? hp('4') : wp('3'),
      paddingHorizontal: isTablet(size.width, size.height) ? hp('5') : wp('3'),
    },
    textInput: {
      height: isTablet(size.width, size.height) ? hp('10') : wp('10'),
      //borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      marginBottom: isTablet(size.width, size.height) ? hp('12') : wp('8'),
      //margin: isTablet(size.width, size.height) ? hp('4') : wp('8'),
      padding: isTablet(size.width, size.height) ? hp('12') : wp('2'),
      backgroundColor: GlobalStyles.colors.primary200,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      borderWidth: isTablet(size.width, size.height) ? hp('6') : wp('1'),
      borderColor: GlobalStyles.colors.primary200,
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('2'),
      margin: isTablet(size.width, size.height) ? hp('4') : wp('8'),
      // backgroundColor: 'rgba(100, 100, 100, 0.8)',
      padding: isTablet(size.width, size.height) ? hp('12') : wp('4'),
      alignItems: 'center',
    },
    inputContainer: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      backgroundColor: 'rgba(100, 100, 100, 0.8)',
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('4'),
    },
    modalText: {
      marginBottom: isTablet(size.width, size.height) ? hp('15') : wp('3'),
      textAlign: 'center',
      color: 'white',
    },
  });
  const styles = JSON.parse(JSON.stringify(mintStyles));
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
enum MintingStep {
  None = 'None',
  SubmittingInfo = 'Submit',
  UploadingImage = 'UploadingImage',
  MintingMetadata = 'MintingMetadata',
  Success = 'Success',
  Error = 'Error',
}
const NftMinter = () => {
  const mintSize = useWindowDimensions();
  const styles = generateMinterSytles(mintSize);
  const navigation = useNavigation();
  const userState = useSelector(getUserState);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mintProgressStep, setMintProgressStep] = useState<MintingStep>(
    MintingStep.None,
  );
  const [nftName, setNftName] = useState('xyz');
  const [nftDescription, setNftDescription] = useState('zyc');
  const [imageType, setImageType] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleModalButtonClose = () => {
    setShowModal(false);
    navigation.navigate('LoginScreen');
  };

  const handleErrorCallback = useCallback((error: any) => {
    if (isObjectEmpty(error) || isEmpty(error)) {
      return;
    }
    // eslint-disable-next-line
    const errorMessage = typeof error !== 'string' ? JSON.stringify(error) : error;
    console.log(`[handleErrorCallback] errorMessage: ${errorMessage}`);
    setShowModal(true);
    setErrorMessage(errorMessage);
    setMintProgressStep(MintingStep.Error);
  }, []);

  // check user permissions
  useEffect(() => {
    const checkUserRole = () => {
      if (userState.role !== 'creator') {
        const errorMessage = Config.AUTH_ERROR?.replace(
          '${APP_NAME}',
          Config.APP_NAME,
        )
          ?.replace('${DOUBLOON_DESIGNER}', Config.DOUBLOON_DESIGNER)
          ?.replace('${DOUBLOON_DESIGNER}', Config.DOUBLOON_DESIGNER);
        handleErrorCallback(errorMessage);
      }
    };
    checkUserRole();
  }, [handleErrorCallback]);

  const handleSelectImage = async () => {
    const photo = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
    });
    const selectedPhoto = photo?.assets?.[0];
    if (!selectedPhoto?.uri) {
      const err = 'Selected photo not found';
      console.log(`[NftMinter] error: ${JSON.stringify(err)}`);
      handleErrorCallback(err);
      return;
    }
    if (selectedPhoto.fileName) {
      setImageName(selectedPhoto.fileName);
    }
    if (selectedPhoto.type) {
      setImageType(selectedPhoto.type);
    }
    setSelectedImage(selectedPhoto.uri);
  };

  const mintNft = useCallback(
    async (nftImage: string) => {
      console.log('\n---------\n[mintNft]\n---------\n');
      console.log('[mintNft] nftImage', JSON.stringify(nftImage));
      setMintProgressStep(MintingStep.UploadingImage);
      /**
       * interface PinNft {
       *   imagePath: string;
       *   imageType: string;
       *   imageName: string;
       *   callback: () => void;
       * }
       */
      try {
        const ipfsData: PinNft = await pinNft({
          imagePath: nftImage,
          imageType: imageType,
          imageName: imageName,
          callback: handleErrorCallback,
        });
        if (!ipfsData.data.created[0].dataTxId) {
          const err = '[NftMinter] null dataTxId!';
          handleErrorCallback(err);
        }
        const nftResponse = {
          nft: {address: `${ipfsData.data.created[0].dataTxId}`},
          response: {signature: '123'},
        };
        return [nftResponse.nft.address, nftResponse.response.signature];
      } catch (e) {
        console.log(`[mintNft] error: ${JSON.stringify(e)}`);
        handleErrorCallback(e);
      }
    },
    [handleErrorCallback, imageType, imageName],
  );
  const isLoading =
    mintProgressStep === MintingStep.MintingMetadata ||
    mintProgressStep === MintingStep.UploadingImage;

  function ImageComponent() {
    return (
      <View>
        {selectedImage ? (
          <Image
            source={{uri: selectedImage}}
            style={showModal ? '' : styles.modalImage}
          />
        ) : (
          <View style={{marginBottom: 16}}>
            <Text>Select an image from your Photo Library to get started!</Text>
          </View>
        )}
      </View>
    );
  }
  function ButtonGroup() {
    return (
      <View style={styles.buttonGroup}>
        <View style={styles.pickImageButton}>
          <Button
            onPress={handleSelectImage}
            title="Pick an image"
            disabled={isLoading}
          />
        </View>
        <View style={styles.mintThisNftButton}>
          <Button
            onPress={() => setMintProgressStep(MintingStep.SubmittingInfo)}
            title="Mint this NFT"
            disabled={isLoading || !selectedImage}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={showModal ? '' : styles.container}>
      <ImageComponent />
      <ButtonGroup />
      <Modal
        animationType="slide"
        transparent={true}
        visible={mintProgressStep !== MintingStep.None}>
        <TouchableWithoutFeedback
          onPress={() => setMintProgressStep(MintingStep.None)}>
          <View style={showModal ? '' : styles.centeredView}>
            <View>
              {mintProgressStep === MintingStep.UploadingImage ||
              mintProgressStep === MintingStep.MintingMetadata ? (
                <>
                  <UserModal
                    visible={showModal}
                    message={
                      mintProgressStep === MintingStep.UploadingImage
                        ? 'Uploading to blockchain...'
                        : 'Minting NFT...'
                    }
                    error={''}
                    onClose={handleModalButtonClose}
                    showActivity={true}
                  />
                </>
              ) : mintProgressStep === MintingStep.Error ? (
                <UserModal
                  visible={showModal}
                  message={message ?? ''}
                  error={errorMessage ?? ''}
                  onClose={handleModalButtonClose}
                  showActivity={false}
                />
              ) : mintProgressStep === MintingStep.Success ? (
                <>
                  <UserModal
                    visible={showModal}
                    message={Config.MINT_SUCCESS}
                    error={errorMessage ?? ''}
                    onClose={handleModalButtonClose}
                    showActivity={false}
                  />
                </>
              ) : (
                <View style={styles.inputContainer}>
                  <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                    NFT Metadata
                  </Text>
                  <Text style={styles.textTitle}>Name:</Text>
                  <TextInput
                    style={styles.textInput}
                    autoCorrect={false}
                    placeholder="Enter text"
                    onChangeText={text => setNftName(text)}
                    value={nftName}
                  />
                  <Text style={styles.textTitle}>Description:</Text>
                  <TextInput
                    style={styles.textInput}
                    autoCorrect={false}
                    placeholder="Enter text"
                    onChangeText={text => setNftDescription(text)}
                    value={nftDescription}
                  />
                  <View style={styles.mintButton}>
                    <Button
                      title="Mint!"
                      onPress={async () => {
                        if (!selectedImage) {
                          handleErrorCallback(
                            '[NftMinter] error: Image not selected.',
                          );
                          return;
                        }
                        try {
                          let mint,
                            signature = '';
                          [mint, signature] = await mintNft(selectedImage);
                          console.log(`Mint Address: "${mint}"`);
                          const explorerUrl =
                            Config.ARWEAVE_PREVIEW_URL + '/' + mint;
                          urlExists(explorerUrl, (err, exists) => {
                            if (err) {
                              setMintProgressStep(MintingStep.Error);
                              handleErrorCallback(err);
                              return;
                            }
                            setMintProgressStep(MintingStep.Success);
                          });
                        } catch (error) {
                          console.log(
                            `[NftMinting] error: ${JSON.stringify(error)}`,
                          );
                          handleErrorCallback(
                            'Minting service unavailable, try again later.',
                          );
                          return;
                        }
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default NftMinter;

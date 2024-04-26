import React, {useState, useCallback, useEffect} from 'react';
import Config from 'react-native-config';
import {NFTData} from './models/NFT';
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
  Linking,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {isEmpty, isObjectEmpty, isTablet, setOutline} from '../util/util';
import ArdriveUpload from '../ipfs/ArdriveUpload';
import NFT from './models/NFT';
import {dbUpsert} from '../util/dbUtils';
import {getUserState} from '../redux/userSlice';
import UserModal from './ui/UserModal';
import {useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import GlobalStyles from '../constants/GlobalStyles';

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
  const [mintAddress, setMintAddress] = useState<string | null>(null);
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
    if (isObjectEmpty(error)) {
      return;
    }
    if (isEmpty(error)) {
      return;
    }
    if (error) {
      let er = '';
      if (typeof error !== 'string') {
        er = `${JSON.stringify(error)}}`;
      } else {
        er = error;
      }
      console.log(er);
      setShowModal(true);
      setErrorMessage(JSON.stringify(er));
      setMintProgressStep(MintingStep.Error);
    }
  }, []);

  useEffect(() => {
    console.log(`[useEffect] userState: ${JSON.stringify(userState)}`);
    console.log(`[useEffect] userState.role: ${userState.role}`);
    const checkUserRole = () => {
      if (userState.role !== 'creator') {
        console.log(
          `[useEffect] userState.role is not creator?? "${userState.role}"`,
        );
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
  }, []);

  const dbUpsertNft = useCallback(
    async (nft: NFTData) => {
      console.log(`[dbUpsertNft] nft (data): ${JSON.stringify(nft)}`);
      return await dbUpsert({
        endPoint: 'upsert_nft',
        conditions: nft,
        setError: handleErrorCallback,
      });
    },
    [handleErrorCallback],
  );

  const urlExists = (url, callback, retries = 3) => {
    const makeRequest = retryCount => {
      fetch(url, {method: 'GET'})
        .then(res => {
          console.log(`[urlExists] url ${url}`);
          if (res.ok) {
            callback(null, true);
          } else {
            if (retryCount > 0) {
              console.log(`[urlExists] retrying... ${retryCount} retries left`);
              setTimeout(() => {
                makeRequest(retryCount - 1);
              }, 8000); // 3 seconds timeout
            } else {
              callback(null, false);
            }
          }
        })
        .catch(err => {
          if (retryCount > 0) {
            console.log(`[urlExists] retrying... ${retryCount} retries left`);
            setTimeout(() => {
              makeRequest(retryCount - 1);
            }, 8000); // 3 seconds timeout
          } else {
            callback(err, false);
          }
        });
    };
    makeRequest(retries);
  };

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
    async (theImage: string) => {
      console.log('\n---------\n[mintNft]\n---------\n');
      setMintProgressStep(MintingStep.UploadingImage);

      const handleMintNft = async (imagePath: string) => {
        console.log('\n---------\n[handleMintNFt]\n---------\n');
        try {
          setMintProgressStep(MintingStep.UploadingImage);
          const data = await ArdriveUpload(
            imagePath,
            imageType,
            imageName,
            handleErrorCallback,
          );
          if (data && !data.data) {
            handleErrorCallback('[ArdriveUpload] null data response');
            return;
          }
          if (data.data) {
            console.log(`MINT data: ${JSON.stringify(data)}`);
            try {
              const nft = new NFT(data.data);
              console.log(`New [NFT] ${JSON.stringify(nft, null, 2)}`);
              const response = await dbUpsertNft(nft);
              if (response) {
                console.log(
                  `[dbUpsertNft] response: ${JSON.stringify(
                    response,
                    null,
                    2,
                  )}`,
                );
              }
            } catch (e) {
              console.log(
                `unable to create "new NFT()" error: ${JSON.stringify(e)}`,
              );
            }
          } else {
            console.error('[NFT] null "data.data"');
          }
          return data;
        } catch (error: any) {
          const er = `[NftMinter] Error: ${
            error.message || 'Unknown error occurred'
          }`;
          console.log(er);
          handleErrorCallback(er);
          return;
        }
      };
      const ipfsData = await handleMintNft(theImage);
      if (!ipfsData.data.created[0].dataTxId) {
        const err = '[NftMinter] null dataTxId!';
        handleErrorCallback(err);
      }
      const nftResponse = {
        nft: {address: `${ipfsData.data.created[0].dataTxId}`},
        response: {signature: '123'},
      };
      return [nftResponse.nft.address, nftResponse.response.signature];
    },
    [dbUpsertNft, handleErrorCallback, imageType, imageName],
  );
  const isLoading =
    mintProgressStep === MintingStep.MintingMetadata ||
    mintProgressStep === MintingStep.UploadingImage;

  return (
    <View style={showModal ? '' : styles.container}>
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
      {showModal ? (
        ''
      ) : (
        <View style={styles.buttonGroup}>
          <View style={styles.pickImageButton}>
            <Button
              onPress={handleSelectImage}
              title="Pick an image"
              disabled={isLoading}
            />
          </View>
          <View style={styles.mintButton}>
            <Button
              onPress={() => setMintProgressStep(MintingStep.SubmittingInfo)}
              title="Mint this NFT"
              disabled={isLoading || !selectedImage}
            />
          </View>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={mintProgressStep !== MintingStep.None}>
        <TouchableWithoutFeedback
          onPress={() => setMintProgressStep(MintingStep.None)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {mintProgressStep === MintingStep.UploadingImage ||
              mintProgressStep === MintingStep.MintingMetadata ? (
                <>
                  <Text style={styles.modalText}>
                    {mintProgressStep === MintingStep.UploadingImage
                      ? 'Uploading to blockchain...'
                      : 'Minting NFT...'}
                  </Text>
                  <ActivityIndicator size="large" color="#0000ff" />
                </>
              ) : mintProgressStep === MintingStep.Error ? (
                <UserModal
                  visible={showModal}
                  message={message ?? ''}
                  error={errorMessage ?? ''}
                  onClose={handleModalButtonClose}
                />
              ) : mintProgressStep === MintingStep.Success ? (
                <>
                  <Text style={{fontWeight: 'bold'}}>
                    {Config.MINT_SUCCESS}
                  </Text>
                </>
              ) : (
                <View style={styles.inputContainerWrapper}>
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
                    <Button
                      title="Mint!"
                      onPress={async () => {
                        if (!selectedImage) {
                          const error =
                            '[NftMinter] error: Image not selected.';
                          console.error(error);
                          handleErrorCallback(error);
                          return;
                        }
                        let mint, signature;
                        try {
                          [mint, signature] = await mintNft(
                            selectedImage,
                            nftDescription,
                          );
                          console.log(
                            `Mint Successful Mint Address: "${mint}" Tx Signature: "${signature}"`,
                          );
                          const explorerUrl =
                            Config.ARWEAVE_PREVIEW_URL + '/' + mint;
                          urlExists(explorerUrl, (err, exists) => {
                            if (err) {
                              const error = '[urlExists] Error:';
                              console.error(error);
                              handleErrorCallback(error);
                              setMintProgressStep(MintingStep.Error);
                              return;
                            } else {
                              console.log(
                                `URL EXISTS: ${explorerUrl} exists: ${exists}`,
                              );
                              setMintProgressStep(MintingStep.Success);
                              setMintAddress(mint);
                            }
                          });
                        } catch (error) {
                          let err =
                            '[NftMinter] Minting service unavailable, try again later.';
                          if (!isObjectEmpty(error)) {
                            err = `[NftMinter] Minting error: ${JSON.stringify(
                              error,
                            )}`;
                          }
                          console.error(err);
                          handleErrorCallback(err);
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

const styles = StyleSheet.create({});

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
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
      backgroundColor: 'rgba(100, 100, 100, 0.8)',
    },
    inputContainer: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      backgroundColor: 'rgba(100, 100, 100, 0.8)',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    mintButton: {
      marginHorizontal: isTablet(size.width, size.height) ? hp('8') : wp('4'),
      width: isTablet(size.width, size.height) ? hp('12') : wp('40'),
    },
    modalImage: {
      width: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      height: isTablet(size.width, size.height) ? hp('80') : wp('60'),
      marginBottom: isTablet(size.width, size.height) ? hp('20') : wp('35'),
      borderWidth: isTablet(size.width, size.height) ? hp('2') : wp('1'),
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
      borderColor: GlobalStyles.colors.primary200,
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
    modalView: {
      borderWidth: isTablet(size.width, size.height) ? hp('6') : wp('1'),
      borderColor: GlobalStyles.colors.primary200,
      borderRadius: isTablet(size.width, size.height) ? hp('6') : wp('3'),
      margin: isTablet(size.width, size.height) ? hp('4') : wp('8'),
      backgroundColor: 'rgba(100, 100, 100, 0.8)',
      padding: isTablet(size.width, size.height) ? hp('12') : wp('4'),
      alignItems: 'center',
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

export default NftMinter;

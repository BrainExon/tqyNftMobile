import React, {useRef, useState, useCallback} from 'react';
import Config from 'react-native-config';
import {ImageMeta} from '../components/models/ImageMeta';
import {useMWAWallet} from './hooks/useMWAWallet';
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
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Metaplex} from '@metaplex-foundation/js';
import {createNftOperation} from '@metaplex-foundation/js';
import UploadToIPFS from '../ipfs/UploadToIPFS';
//import useMetaplex from '../metaplex-util/useMetaplex';
import {useAuthorization} from './providers/AuthorizationProvider';
import {RPC_ENDPOINT, useConnection} from './providers/ConnectionProvider';
import {isEmpty, isObjectEmpty} from '../util/util';
import ArweaveUpload from '../ipfs/ArweaveUpload';
import ArdriveUpload from "../ipfs/ArdriveUpload";

enum MintingStep {
  None = 'None',
  SubmittingInfo = 'Submit',
  UploadingImage = 'UploadingImage',
  MintingMetadata = 'MintingMetadata',
  Success = 'Success',
  Error = 'Error',
}

const NftMinter = () => {
  const func = '[NftMinter]';

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mintProgressStep, setMintProgressStep] = useState<MintingStep>(
    MintingStep.None,
  );
  const [nftName, setNftName] = useState('xyz');
  const [nftDescription, setNftDescription] = useState('zyc');
  const {selectedAccount, authorizeSession} = useAuthorization();
  const mwaWallet = useMWAWallet(authorizeSession, selectedAccount);
  const {connection} = useConnection();
  //const {metaplex} = useMetaplex(connection, selectedAccount, authorizeSession);
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleErrorCallback = useCallback((error:any) => {
    if (isObjectEmpty(error)) {
      return;
    }
    if (isEmpty(error)) {
      return;
    }
    if (error) {
      const er = `[HandleErrorCallBack] error \n----${JSON.stringify(error)}----\n}`;
      console.log(er);
      setErrorMessage(JSON.stringify(er));
      setMintProgressStep(MintingStep.Error);
    }
  }, []);

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

  interface UploadData {
    imageUploadData: any;
    metadataUploadData: any;
  }

  const uploadDataRef = useRef<UploadData>({
    imageUploadData: null,
    metadataUploadData: null,
  });

  const mintNft = useCallback( async (theImage: string, theDescription: string) => {
    console.log(`\n---------\n[mintNft]\n---------\n`);
      setMintProgressStep(MintingStep.UploadingImage);

      const handleMintNft = async ( imagePath: string, theNftDescription) => {
        console.log(`\n---------\n[handleMintNFt]\n---------\n`);
        try {
          setMintProgressStep(MintingStep.UploadingImage);
          console.log(`[NftMinter] being IPFS file upload...`);
          console.log(`[NftMinter] imagePath: ${imagePath}`);
          console.log(`[NftMinter] imageType: ${imageType}`);
          console.log(`[NftMinter] imageName: ${imageName}`);

          /*
          imagePath: string,
            imageType: string | null,
            imageName: string | null,
            callback: (error: any) => void,
           */
          const data = await ArdriveUpload(
            imagePath,
            imageType,
            imageName,
            handleErrorCallback,
          );
          return data;
        } catch (error) {
          const er = `[NftMinter] Error: ${
            error.message || 'Unknown error occurred'
          }`;
          console.log(er);
          handleErrorCallback(er);
          return;
        }
      };
      const ipfsData = await handleMintNft(theImage, theDescription);
      console.log(`\n---------\n handleMintNft.data.created[0].dataTxId}: ${ipfsData.data.created[0].dataTxId} \n---------\n`);
      if (!ipfsData.data.created[0].dataTxId) {
        const err = `[NftMinter] null dataTxId!`;
        handleErrorCallback(err);
      }
      const nftResponse = {
        nft: {
          address: `${ipfsData.data.created[0].dataTxId}`
        },
        response: {
          signature:  '123',
        }
      };

      return [
        nftResponse.nft.address,
        nftResponse.response.signature,
      ];
    },
    [
      mwaWallet,
      handleErrorCallback,
      nftName,
      selectedAccount?.publicKey,
      imageType,
    ],
  );

  const isLoading =
    mintProgressStep === MintingStep.MintingMetadata ||
    mintProgressStep === MintingStep.UploadingImage;

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <Image source={{uri: selectedImage}} style={styles.image} />
      ) : (
        <View style={{marginBottom: 16}}>
          <Text>Select an image from your Photo Library to get started! </Text>
        </View>
      )}

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
            onPress={() => {
              setMintProgressStep(MintingStep.SubmittingInfo);
            }}
            title="Mint this NFT"
            disabled={isLoading || !selectedImage}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={mintProgressStep !== MintingStep.None}>
        <TouchableWithoutFeedback
          onPress={() => setMintProgressStep(MintingStep.None)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {(() => {
                switch (mintProgressStep) {
                  case MintingStep.UploadingImage:
                  case MintingStep.MintingMetadata:
                    return (
                      <>
                        <Text style={styles.modalText}>
                          {mintProgressStep === MintingStep.UploadingImage
                            ? 'Uploading to IPFS...'
                            : 'Minting NFT...'}
                        </Text>
                        <ActivityIndicator size="large" color="#0000ff" />
                      </>
                    );
                  case MintingStep.Error:
                    console.log(
                      `[NftMinter] Minting error: ${JSON.stringify(
                        errorMessage,
                      )}`,
                    );
                    return (
                      <>
                        <Text style={styles.modalText}>
                          {`Error: ${errorMessage}`}
                        </Text>
                      </>
                    );
                  case MintingStep.Success:
                    const explorerUrl = Config.ARWEAVE_PREVIEW_URL + '/' + mintAddress;
                    return (
                      <>
                        <Text style={{fontWeight: 'bold'}}>
                          Mint successful!
                        </Text>
                        <Text
                          onPress={() => {
                            Linking.openURL(explorerUrl).catch(e => {
                              e.message;
                            });
                          }}
                          style={{
                            ...styles.modalText,
                            color: '#0000EE',
                            textDecorationLine: 'underline',
                          }}>
                          View your NFT on the explorer.
                        </Text>
                      </>
                    );
                  case MintingStep.None:
                  case MintingStep.SubmittingInfo:
                    return (
                      <View style={styles.inputContainer}>
                        <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                          NFT Metadata
                        </Text>
                        <Text>Name: </Text>
                        <TextInput
                          style={styles.input}
                          autoCorrect={false}
                          placeholder="Enter text"
                          onChangeText={text => setNftName(text)}
                          value={nftName}
                        />
                        <Text>Description: </Text>
                        <TextInput
                          style={styles.input}
                          autoCorrect={false}
                          placeholder="Enter text"
                          onChangeText={text => setNftDescription(text)}
                          value={nftDescription}
                        />
                        <Button
                          title="Mint this NFT!"
                          onPress={async () => {
                            if (!selectedImage) {
                              const error =
                                '[NftMinter] error: Image not selected.';
                              console.log(error);
                              handleErrorCallback(error);
                              return;
                            }
                            let mint, signature;
                            try {
                              [mint, signature] = await mintNft( selectedImage, nftDescription );
                              console.log(`Mint Successful
                              Mint Address: ${mint}
                              Tx Signature: ${signature}`);
                              setMintProgressStep(MintingStep.Success);
                              setMintAddress(mint);
                              setTxSignature(signature);
                            } catch (error) {
                              const err = `[NftMinter] error: ${JSON.stringify(
                                error,
                              )}`;
                              console.log(err);
                              handleErrorCallback(err);
                              return;
                            }
                          }}
                        />
                      </View>
                    );
                }
              })()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputContainer: {
    width: 200,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pickImageButton: {
    marginHorizontal: 4,
    width: '50%',
  },
  mintButton: {
    marginHorizontal: 4,
    width: '50%',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#808080',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
});

export default NftMinter;

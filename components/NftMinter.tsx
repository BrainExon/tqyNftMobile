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
import useMetaplex from '../metaplex-util/useMetaplex';
import {useAuthorization} from './providers/AuthorizationProvider';
import {RPC_ENDPOINT, useConnection} from './providers/ConnectionProvider';
import {isEmpty, isObjectEmpty} from '../util/util';
import ArweaveUpload from '../ipfs/ArweaveUpload';

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
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const {selectedAccount, authorizeSession} = useAuthorization();
  const mwaWallet = useMWAWallet(authorizeSession, selectedAccount);
  const {connection} = useConnection();
  const {metaplex} = useMetaplex(connection, selectedAccount, authorizeSession);
  const [mintAddress, setMintAddress] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const handleErrorCallback = useCallback(error => {
    if (isObjectEmpty(error)) {
      return;
    }
    if (isEmpty(error)) {
      return;
    }
    if (error) {
      console.log(
        `[HandleErrorCallBack] error \n----${JSON.stringify(error)}----\n}`,
      );
      setErrorMessage(JSON.stringify(error));
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

  const mintNft = useCallback(
    async (metaplexObject: Metaplex, theImage: string) => {
      setMintProgressStep(MintingStep.UploadingImage);

      const handleMintNft = async (
        metaplexInstance: Metaplex,
        imagePath: string,
      ) => {
        try {
          setMintProgressStep(MintingStep.UploadingImage);
          /**
           *   "imageData":{
           *     "IpfsHash":"QmSoSBFFohEJHL5KEkJEWMgsf5m7guUbpKQ6fS3KkT36CE",
           *     "PinSize":15056,
           *     "Timestamp":"2024-04-13T06:32:14.624Z"
           *   },
           *   "imageMeta":{
           *     "appName":"TQN",
           *     "version":"TQN",
           *     "author":"undefined",
           *     "company":"undefined",
           *     "date":"Sat Apr 13 2024",
           *     "description":"Bf",
           *     "features":[
           *       {
           *         "name":"Uploads",
           *         "limit":"500",
           *         "fileTypeLimits":{
           *           "Text":"10",
           *           "Image":"100",
           *           "Video":"25"
           *         }
           *       }
           *     ],
           *     "ipfsImage":"https://ipfs.io/ipfs/",
           *     "imageName":"rn_image_picker_lib_temp_11269932-b5f6-4da7-926d-0700061bc9f9.jpg",
           *     "attributes":[ ]
           *   }
           * }
           */
          console.log(`[NftMinter] being IPFS file upload...`);
          const response = await UploadToIPFS(
            imagePath,
            nftName,
            nftDescription,
            imageType,
            imageName,
            handleErrorCallback,
          );
          /*
          const response: ArweaveUpload = await ArweaveUpload(
            imageType,
            imagePath,
            mwaWallet,
            handleErrorCallback,
          );
          */
          const data = response as {
            imageData: {
              IpfsHash: string;
              PinSize: string;
              Timestamp: string;
              isDuplicate: string;
            };
            imageMeta: ImageMeta;
          };
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

      const ipfsData = await handleMintNft(metaplexObject, theImage);
      uploadDataRef.current = {
        imageUploadData: ipfsData.imageData,
        metadataUploadData: ipfsData?.imageMeta,
      };
      if (
        uploadDataRef.current.imageUploadData?.error ||
        uploadDataRef.current.metadataUploadData?.error
      ) {
        if (uploadDataRef.current.imageUploadData.error) {
          const err = `[NftMinter] uploadDataRef.current.imageUploadData.error: ${JSON.stringify(
            uploadDataRef.current.imageUploadData.error,
          )}`;
          console.log(err);
          handleErrorCallback(err);
        }

        if (uploadDataRef.current.metadataUploadData.error) {
          const err = `[NftMinter] uploadDataRef.current.metadataUploadData.error: ${JSON.stringify(
            uploadDataRef.current.metadataUploadData.error,
          )}`;
          console.log(err);
          handleErrorCallback(err);
        }
        const errr = '[NftMinter] unknown image upload error.';
        console.log(errr);
        handleErrorCallback(errr);
      }

      console.log(
        `[NftMinter] imageUploadData ${JSON.stringify(
          uploadDataRef.current.imageUploadData,
        )}`,
      );
      console.log(
        `[NftMinter] metadataUploadData ${JSON.stringify(
          uploadDataRef.current.metadataUploadData,
        )}`,
      );
      setMintProgressStep(MintingStep.MintingMetadata);

      /**
       * Creates a new NFT.
       * const { nft } = await metaplex
       *   .nfts()
       *   .create({
       *     name: 'My NFT',
       *     uri: 'https://example.com/my-nft',
       *     sellerFeeBasisPoints: 250, // 2.5%
       *   };
       */
      const multiplexConfig = {
        name: nftName,
        uri: `${uploadDataRef.current.metadataUploadData.ipfsUri}${uploadDataRef.current.imageUploadData.IpfsHash}`,
        sellerFeeBasisPoints: 0,
        tokenOwner: selectedAccount?.publicKey,
      };
      const getNftOperation = async input => {
        try {
          const operation = await createNftOperation(input);
          console.log(
            `[NftMinter][createNftOperation] operation: ${JSON.stringify(
              operation,
            )}`,
          );
          return operation;
        } catch (error) {
          const erMsg = `[NftMinter] [getNftOperation] error: ${JSON.stringify(
            error,
          )}`;
          console.log(erMsg);
          handleErrorCallback(erMsg);
          return;
        }
      };

      const mintOperation = await getNftOperation(multiplexConfig);
      if (!mintOperation) {
        const erMsg = `[NftMinter] [getNftOperation] mintOperation is null: ${JSON.stringify(
          mintOperation,
        )}`;
        console.log(erMsg);
        handleErrorCallback(erMsg);
        return;
      }
      const nftCreate = async config => {
        try {
          //const createNftOutput = await metaplexInstance.operations().execute(config);
          const {nft, response} = await metaplexObject.nfts().create(config);
          return {nft, response};
        } catch (error) {
          const erMsg = `[NftMinter] [nftCreate] Error: ${JSON.stringify(
            error,
          )}`;
          console.log(erMsg);
          handleErrorCallback(erMsg);
          return;
        }
      };
      const nftResponse = await nftCreate(multiplexConfig);
      if (!nftResponse) {
        const erMsg = `[NftMinter][nftCreate] NFT response is null: ${JSON.stringify(
          nftResponse,
        )}`;
        console.log(erMsg);
        handleErrorCallback(erMsg);
        return;
      }
      console.log(nftResponse.nft.address.toBase58());
      console.log(nftResponse.response.signature);

      return [
        nftResponse.nft.address.toBase58(),
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
                    const explorerUrl =
                      'https://explorer.solana.com/address/' +
                      mintAddress +
                      '?cluster=' +
                      RPC_ENDPOINT;

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
                            if (!metaplex) {
                              const error =
                                '[NftMinter] error: Metaplex/MWA not initialized.';
                              console.log(error);
                              handleErrorCallback(error);
                              return;
                            }
                            if (!selectedImage) {
                              const error =
                                '[NftMinter] error: Image not selected.';
                              console.log(error);
                              handleErrorCallback(error);
                              return;
                            }
                            let mint, signature;
                            try {
                              [mint, signature] = await mintNft(
                                metaplex,
                                selectedImage,
                              );
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

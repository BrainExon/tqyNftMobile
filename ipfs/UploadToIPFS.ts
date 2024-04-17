import Config from 'react-native-config';
import axios from 'axios';
// TODO: compute CID before uploading so we don't have to wait on on upload to get CID
//  and can fire uploadData and uploadMeta asynchronously.
//  https://docs.solanamobile.com/react-native/mobile_nft_minter_tutorial
// TODO: trap error statuses, e.g. uploadMetadata should have status==200
const UploadToIPFS = async (
  imagePath: string,
  name: string,
  description: string,
  imageType: string,
  imageName: string,
  callback: (error: any) => void,
) => {
  const handleError = error => {
    console.error('[UploadToIPFS] Error:', error);
    callback(error);
  };

  try {
    const meta = {
      date: new Date().toDateString(),
      imageName: imageName,
      description: description,
    };

    const formData = new FormData();
    formData.append('file', {uri: imagePath, type: imageType, name: imageName});

    console.log('[UploadToIPFS] Uploading image to IPFS....');

    const response = await axios.post(
      `${Config.PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Config.PINATA_JWT_KEY}`,
        },
      },
    );

    if (!response.data || !response.data.IpfsHash) {
      const err = '[UploadToIPFS] Error: IpfsHash not found in response';
      console.log(err);
      handleError(err);
      return;
    }

    const IPFSResponse = {
      IpfsHash: response.data.IpfsHash,
      PinSize: response.data.PinSize,
      Timestamp: response.data.Timestamp,
    };

    console.log('[UploadToIPFS] Uploading Metadata to IPFS....');
    const metadata = JSON.stringify({
      pinataContent: {
        name: meta.imageName,
        description: meta.description,
        image: `https://ipfs.io/ipfs/${IPFSResponse.IpfsHash}`,
      },
    });
    const metadataResponse = await axios.put(
      `${Config.PINATA_API_URL}/pinning/hashMetadata`,
      metadata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Config.PINATA_JWT_KEY}`,
        },
      },
    );
    return {imageData: IPFSResponse, imageMeta: meta};
  } catch (error) {
    console.log(`[UploadToIPFS] Error: ${JSON.stringify(error)}`);
    handleError(error);
    return;
  }
};

export default UploadToIPFS;

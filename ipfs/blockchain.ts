import Config from 'react-native-config';
import {replaceStringByKey} from '../util/util';

const arDriveUpload = async (
  imagePath: string,
  imageType: string | null,
  imageName: string | null,
  callback: (error: any) => void,
) => {
  console.log('[Blockchain]  ARDrive image upload...');
  console.log(`[arDriveUpload] imagePath: ${imagePath}`);
  console.log(`[arDriveUpload] imageType: ${imageType}`);
  console.log(`[arDriveUpload] imageName: ${imageName}`);

  const handleError = (error: any) => {
    console.log('[Blockchain][mint] Error:', JSON.stringify(error));
    callback(error.message);
  };

  if (!imagePath) {
    const err = '[Blockchain] null imagePath!';
    handleError(err);
    return;
  }

  const upload = async () => {
    const formData = new FormData();
    const cleanName = replaceStringByKey(
      imageName,
      'rn_image_picker_lib_temp_',
      '',
    );
    formData.append('files', {
      uri: imagePath,
      type: imageType,
      name: cleanName,
    });
    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };
    console.log(`[blockchain] formData: ${JSON.stringify(formData)}`);
    try {
      const response = await fetch(
        `${Config.NODEJS_EXPRESS_SERVER}/upload_files`,
        requestOptions,
      );
      return await response.json();
    } catch (error) {
      handleError(`[mint] error: ${JSON.stringify(error)}`);
    }
  };

  try {
    const minting = await upload();
    console.log(`[ArdriveUpload] minting response: ${JSON.stringify(minting)}`);
    if (minting.error) {
      console.log(
        `[arDriveUpload][mint] error: ${JSON.stringify(minting.error)}`,
      );
      handleError(minting.error);
    }

    if (!minting.data) {
      const err = `[arDriveUpload][mint] 'data' response: ${JSON.stringify(
        minting.data,
      )}`;
      console.log(err);
      handleError(err);
    }

    return minting;
  } catch (e) {
    // Handle any errors that occurred during the fetch operation
    handleError(e);
  }
};

export interface PinNft {
  imagePath: string;
  imageType: string;
  imageName: string;
  callback: (error: any) => void;
}

export const pinNft = async ({
  imagePath,
  imageType,
  imageName,
  callback,
}: PinNft) => {
  console.log('\n---------\n[handleMintNFt]\n---------\n');
  const handleError = (error: any) => {
    console.log('[Blockchain][mint] Error:', JSON.stringify(error));
    callback(error.message);
  };
  try {
    const data = await arDriveUpload(imagePath, imageType, imageName, callback);
    if (!data.data) {
      handleError('Error pinning NFT to arweave blockchain.');
      return;
    }
    return data;
  } catch (error: any) {
    const er = `[pintNft] Error: ${error.message || 'Unknown error occurred'}`;
    handleError(er);
    return;
  }
};

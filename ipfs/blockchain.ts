import Config from 'react-native-config';
import {replaceStringByKey} from '../util/util';
import axios from 'axios';
const arDriveClient = async (
  ownerId: string,
  imagePath: string,
  imageType: string | null,
  imageName: string | null,
  callback: (error: any) => void,
) => {
  console.log('\n-------\n');
  console.log('[Blockchain]  ARDrive image upload...');
  console.log(`[arDriveClient] ownerId: ${ownerId}`);
  console.log(`[arDriveClient] imagePath: ${imagePath}`);
  console.log(`[arDriveClient] imageType: ${imageType}`);
  console.log(`[arDriveClient] imageName: ${imageName}`);
  console.log('\n-------\n');

  const handleError = (error: any) => {
    console.log('[arDriveClient][mint] Error:', JSON.stringify(error));
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

    formData.append('ownerId', ownerId);

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };
    console.log(
      `[arDriveClient] formData: ${JSON.stringify(formData, null, 2)}`,
    );
    const url = `${Config.NODEJS_EXPRESS_SERVER}/mint_nft`;
    console.log(`[arDriveClient] URL: ${JSON.stringify(url)}`);
    try {
      const response = await fetch(url, requestOptions);
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
        `[arDriveClient][mint] error: ${JSON.stringify(minting.error)}`,
      );
      handleError(`[arDriveClient][mint] error: ${minting.error}`);
    }

    if (!minting.data) {
      const err = `[arDriveClient][mint] 'data' response: ${JSON.stringify(
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
  ownerId: string;
  imagePath: string;
  imageType: string;
  imageName: string;
  callback: (error: any) => void;
}

export const pinNft = async ({
  ownerId,
  imagePath,
  imageType,
  imageName,
  callback,
}: PinNft) => {
  console.log('\n-------\n');
  console.log(`[pintNft] ownerId: ${ownerId}`);
  console.log(`[pintNft] imagePath: ${imagePath}`);
  console.log(`[pintNft] imageType: ${imageType}`);
  console.log(`[pintNft] imageName: ${imageName}`);
  console.log('\n-------\n');
  const handleError = (error: any) => {
    console.log('[Blockchain][pintNft] Error:', JSON.stringify(error));
    callback(error.message);
  };
  try {
    const data = await arDriveClient(
      ownerId,
      imagePath,
      imageType,
      imageName,
      callback,
    );
    if (!data.data) {
      handleError('[pintNft] Error pinning NFT to arweave blockchain.');
      return;
    }
    return data;
  } catch (error: any) {
    const er = `[pintNft] Error: ${error.message || 'Unknown error occurred'}`;
    handleError(er);
    return;
  }
};

export const pinNftVersion = async ({
  ownerId,
  imagePath,
  imageType,
  imageName,
  callback,
}: PinNft) => {
  console.log('\n-------\n');
  console.log(`[pinNftVersion] ownerId: ${ownerId}`);
  console.log(`[pinNftVersion] imagePath: ${imagePath}`);
  console.log(`[pinNftVersion] imageType: ${imageType}`);
  console.log(`[pinNftVersion] imageName: ${imageName}`);
  console.log('\n-------\n');
  const handleError = (error: any) => {
    console.log('[pinNftVersion] Error:', JSON.stringify(error));
    callback(error.message);
  };
  try {
    const data = {
      imagePath: imagePath,
      imageType: imageType,
      imageName: imageName,
      ownerId: ownerId,
    };
    console.log(`[pinNftVersion] data: ${JSON.stringify(data, null, 2)}`);
    const url = `${Config.NODEJS_EXPRESS_SERVER}/mint_nft_version`;
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error: any) {
    const er = `[pinNftVersion] Error: ${
      error.message || 'Unknown error occurred'
    }`;
    handleError(er);
    return;
  }
};

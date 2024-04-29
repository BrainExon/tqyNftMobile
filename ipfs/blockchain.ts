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

/**
 * Returns a response something like this:
 * {
 *   success: true,
 *   data: {
 *     _id: "66300d54f283363d967a15e6",
 *     date: 1714425172072,
 *     ownerId: "dc6ddf89-37fc-4224-a0d7-5c03ae4353e7",
 *     nftId: "2142d9ea-1c86-4125-9bf1-344691946687",
 *     created: [
 *       {
 *         type: "file",
 *         entityName: "03642d02-c51c-4a48-aec7-5f3d431ed6bd_v1.png",
 *         entityId: "3559eb2e-d197-4e2b-a628-5c00138bdea4",
 *         dataTxId: "Hsy7HgR-l03KS1HbK1cX8GtlHNrsZLFMTF95TX0qrJU",
 *         metadataTxId: "DKR_AytSe2tvnAd0_nXuYL9shZAyFXpc1opSYotT4fk",
 *         bundledIn: "cquaZKIeEfscT6y7YpZOYfqmdFsq5gmP1PBnKMXb9kA",
 *         sourceUri: "file:///Users/chellax/Projects/Express/functions/images_store/03642d02-c51c-4a48-aec7-5f3d431ed6bd_v1.png"
 *       },
 *       {
 *         type: "bundle",
 *         bundleTxId: "cquaZKIeEfscT6y7YpZOYfqmdFsq5gmP1PBnKMXb9kA"
 *       }
 *     ],
 *     tips: [
 *       {
 *         recipient: "mrilKP-FPWEoicO0CUL2Ts0MvsM3G5IJELABV7g2XQI",
 *         txId: "cquaZKIeEfscT6y7YpZOYfqmdFsq5gmP1PBnKMXb9kA",
 *         winston: "137422921"
 *       }
 *     ],
 *     fees: {
 *       cquaZKIeEfscT6y7YpZOYfqmdFsq5gmP1PBnKMXb9kA: "916152809"
 *     }
 *   },
 *   error: ""
 * }
 */
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
    const url = `${Config.NODEJS_EXPRESS_SERVER}/mint_nft_version`;
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log(
      `[pinNftVersion] Newly Minted User Challenge versioned NFT response: ${JSON.stringify(
        response.data.success,
        null,
        2,
      )}`,
    );
    console.log(
      `[pinNftVersion] RESPONSE.DATA: ${JSON.stringify(
        response.data,
        null,
        2,
      )}`,
    );
    return response.data;
  } catch (error: any) {
    const er = `[pinNftVersion] Error: ${
      error.message || 'Unknown error occurred'
    }`;
    handleError(er);
    return;
  }
};

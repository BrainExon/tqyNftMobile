const RNFS = require('react-native-fs');
import Config from 'react-native-config';
import {replaceStringByKey} from '../util/util';
/**
 * Function returns something like this:
 *
 * {
 *   success:true,
 *   data:{
 *     created:[
 *       {
 *         type:"file",
 *         entityName:"5c2a972c-0605-4752-a25e-289d58cd2b3c.jpg",
 *         entityId:"54abf953-a748-4bdb-85a1-e489c3fefb0d",
 *         dataTxId:"cUUHJEfivcKUU9ZFNX20eRy5OgzxF8t_Uq3abo8N6iI",
 *         metadataTxId:"J_giQej-bAC5iN47bRN-4Ljl-xbCXsoq9NVZmCSXsJY",
 *         bundledIn:"GLD_5Bb2NNIax4OrVvgeMMUjC01-FRa-Dx1A60SzLWw",
 *         sourceUri:"file:///Users/chellax/Projects/Express/functions/uploads/5c2a972c-0605-4752-a25e-289d58cd2b3c.jpg"
 *       },
 *       {
 *         type:"bundle",
 *         bundleTxId:"GLD_5Bb2NNIax4OrVvgeMMUjC01-FRa-Dx1A60SzLWw"
 *       }
 *     ],
 *     tips: [
 *       {
 *         recipient:"C6nBlkd7pKRxPiUk1AaGeCrup7XiVQow40NO6c9RDGg",
 *         txId:"GLD_5Bb2NNIax4OrVvgeMMUjC01-FRa-Dx1A60SzLWw",
 *         winston:"27753169"
 *       }
 *     ],
 *     fees: {
 *       "GLD_5Bb2NNIax4OrVvgeMMUjC01-FRa-Dx1A60SzLWw:185021129"
 *     }
 *   },
 *   error:
 * }
 */
const ArdriveUpload = async (
  imagePath: string,
  imageType: string | null,
  imageName: string | null,
  callback: (error: any) => void,
) => {
  console.log('[ArdriveUpload]  ARDrive image upload...');
  console.log(`[ArDriveUpload] imagePath: ${imagePath}`);
  console.log(`[ArDriveUpload] imageType: ${imageType}`);
  console.log(`[ArDriveUpload] imageName: ${imageName}`);

  const handleError = (error: any) => {
    console.log('[ArdriveUpload][mint] Error:', JSON.stringify(error));
    callback(error.message);
  };

  if (!imagePath) {
    const err = '[ArdriveUpload] null imagePath!';
    handleError(err);
    return;
  }

  const mint = async () => {
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
    console.log(`[ArdriveUplaod] formData: ${JSON.stringify(formData)}`);
    try {
      const response = await fetch(
        `${Config.NODEJS_EXPRESS_SERVER}/upload_files`,
        requestOptions,
      );
      const result = await response.json();
      return result;
    } catch (error) {
      handleError(`[ArdriveUpload] error: ${JSON.stringify(error)}`);
    }
  };

  try {
    const minting = await mint();
    console.log(`[ArdriveUpload] minting response: ${JSON.stringify(minting)}`);
    if (minting.error) {
      console.log(
        `[ArDriveUpload][mint] error: ${JSON.stringify(minting.error)}`,
      );
      handleError(minting.error);
    }

    if (!minting.data) {
      const err = `[ArDriveUpload][mint] 'data' response: ${JSON.stringify(
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

export default ArdriveUpload;

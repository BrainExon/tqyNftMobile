const RNFS = require('react-native-fs');
import Config from 'react-native-config';
import { replaceStringByKey } from "../util/util";
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
    console.error('[ArdriveUpload][mint] Error:', JSON.stringify(error));
    callback(error.message);
  };

  if (!imagePath) {
    const err = '[ArdriveUpload] null imagePath!';
    handleError(err);
    return;
  }

  const mint = async () => {
    const formData = new FormData();
    const cleanName = replaceStringByKey(imageName, 'rn_image_picker_lib_temp_', '');
    //formData.append('files', { uri: imagePath, type: imageType, name: imageName });
    formData.append('files', { uri: imagePath, type: imageType, name: cleanName });

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    try {
      const response = await fetch(`${Config.NODEJS_EXPRESS_SERVER}/upload_files`, requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  try {
    const minting = await mint();

    if (minting.error) {
      console.log(`[ArDriveUpload][mint] error: ${JSON.stringify(minting.error)}`);
      handleError(minting.error);
    }

    if (!minting.data) {
      const err = `[ArDriveUpload][mint] 'data' response: ${JSON.stringify(minting.data)}`;
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

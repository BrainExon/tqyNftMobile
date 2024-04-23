const RNFS = require('react-native-fs');
import Config from 'react-native-config';

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
    formData.append('files', {
      uri: imagePath,
      type: imageType,
      name: imageName,
    });
    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };
    fetch(Config.NODEJS_EXPRESS_SERVER, requestOptions)
      .then(response => response.text())
      .then(result => result)
      .catch(error => console.error(error));
  };
  try {
    const minting = await mint();
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
    return minting.data;
  } catch (e) {}
};

export default ArdriveUpload;

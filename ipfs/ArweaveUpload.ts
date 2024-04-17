import {ArweaveMeta} from '../components/models/ArweaveMeta';
import Config from 'react-native-config';
//import {useAuthorization} from '../components/providers/AuthorizationProvider';
// TODO need to add pop-up window asking user if we
// can access their photos, etc.
import RNFetchBlob from 'rn-fetch-blob';
const Arweave = require('arweave');
// import {useMWAWallet} from '../components/hooks/useMWAWallet';
export interface ArweaveUpload {
  imagePath: string;
  nftName: string;
  nftDescription: string;
  imageType: string;
  imageName: string;
  handleErrorCallback: (error: any) => void;
}
const ArweaveUpload = async (
  imagePath: string,
  nftName: string,
  nftDescription: string,
  imageType: string,
  imageName: string,
  callback: (error: any) => void,
) => {
  const handleCallback = (error: Error) => {
    callback(error.message);
  };
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 20000,
      logging: false,
    });

    //const mwaWallet = useMWAWallet(authorizeSession, selectedAccount);
    const dirs = RNFetchBlob.fs.dirs
    console.log(dirs.DocumentDir);
    console.log(dirs.CacheDir);
    console.log(dirs.DCIMDir);
    console.log(dirs.DownloadDir);


    console.log(`[ArweaveUpload] ORIG imageName:  ${JSON.stringify(imageName)}`);
    console.log(`[ArweaveUpload] ORIG imagePath:  ${JSON.stringify(imagePath)}`);
    //const cleanImagePath = imagePath.replace(/.*cache\//, '');
    const imageUri = `${dirs.CacheDir}/${imageName}`;
    //console.log(`[ArweaveUpload] IMAGE PATH ${JSON.stringify(cleanImagePath)}`);
    console.log(`[ArweaveUpload] imageUri:  ${JSON.stringify(imageUri)}`);
    const readImageData = async () => {
      try {
        const data = await RNFetchBlob.fs.readFile(imageUri, 'base64');
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };
    const data = await readImageData();

    if (!data) {
      const error = new Error(
        '[ArweaveUpload] failed to read image: ',
        JSON.stringify(cleanImagePath),
      );
      console.log(error);
      handleCallback(error);
    }
    console.log(`[ArweaveUpload] file data ${JSON.stringify(data)}`);
    const error = new Error('[ArweaveUpload] FOO FOO FOO');
    handleCallback(error);
    return;
    /*
    const transaction = await arweave.createTransaction({data: data});
    transaction.addTag('Content-Type', imageType);
    await arweave.transactions.sign(transaction, mwaWallet);
    const response = await arweave.transactions.post(transaction);
    console.log(`[ArweaveUpload] response ${JSON.stringify(response)}`);
    return;
    const id = transaction.id;
    const imageUri = id ? `https://arweave.net/${id}` : undefined;
    if (!imageUri) {
      const err = new Error('[ArweaveUpload] null imageUri');
      console.log(err);
      handleCallback(err);
    }
    const arweaveMeta = new ArweaveMeta(
      `${Config.META_APP_NAME}`,
      `${Config.META_APP_SYMBOL}`,
      `${Config.META_APP_NAME} test`,
      500,
      `${Config.META_APP_URL}`,
      [{trait_type: 'NFT type', value: 'Custom'}],
      'Test Collection',
      `Custom ${Config.META_APP_NAME} NFTs`,
      `${imageUri}`,
      `${imageType}`,
      `${response.creatorAddress}`,
      100,
      {
        files: [
          {
            uri: imageUri,
            type: imageType,
          },
        ],
        category: 'image',
        maxSupply: 100,
        creators: [{address: response.data.address, share: 100}],
      },
    );
    console.log(`[ArweaveUpload] metadata: ${JSON.stringify(arweaveMeta)}`);
    const metadataRequest = JSON.stringify(arweaveMeta);
    console.log(
      `[ArweaveUpload] metadata request: ${JSON.stringify(metadataRequest)}`,
    );
    const metadataTransaction = await arweave.createTransaction({
      data: metadataRequest,
    });
    metadataTransaction.addTag('Content-Type', 'application/json');
    await arweave.transactions.sign(metadataTransaction, mwaWallet);
    console.log('metadata txid', metadataTransaction.id);
    console.log(await arweave.transactions.post(metadataTransaction));

     */
  } catch (e) {
    console.log(`[ArweaveUpload] error: ${JSON.stringify(e)}`);
    handleCallback(e);
  }
};

export default ArweaveUpload;

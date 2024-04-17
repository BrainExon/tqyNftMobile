import {ArweaveMeta} from '../components/models/ArweaveMeta';
import Config from 'react-native-config';
import {useAuthorization} from '../components/providers/AuthorizationProvider';
const fs = require('fs');
import RNFetchBlob from 'rn-fetch-blob';
const Arweave = require('arweave');
// import {useMWAWallet} from '../components/hooks/useMWAWallet';
export interface ArweaveUpload {
  imageType: string;
  imagePath: string;
  mwaWallet: any,
  callback: (error: any) => void;
}
const ArweaveUpload = async (
  imageType: string,
  imagePath: string,
  mwaWallet: any,
  callback: (error: any) => void,
) => {
  const handleCallback = error => {
    callback(error);
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
    //const data = fs.readFileSync('./code/nfts/arweave-upload/lowres-dog.png');
    const imageData = async imagePath => {
      try {
        return await RNFetchBlob.fs.readFile(
          imagePath,
          'base64',
        );
        //return fs.readFileSync(path);
      } catch (e) {
        const error = '[ArweaveUpload] read image file null';
        console.log(error);
        handleCallback(error);
        return;
      }
    };
    const data = imageData(imagePath);
    if (!data) {
      const error = '[ArweaveUpload] image data null';
      console.log(error);
      handleCallback(error);
    }
    console.log(`[ArweaveUpload] file data ${JSON.stringify(data)}`);
    return;
    const transaction = await arweave.createTransaction({data: data});
    transaction.addTag('Content-Type', imageType);
    await arweave.transactions.sign(transaction, mwaWallet);
    const response = await arweave.transactions.post(transaction);
    console.log(`[ArweaveUpload] response ${JSON.stringify(response)}`);
    return;
    const id = transaction.id;
    const imageUri = id ? `https://arweave.net/${id}` : undefined;
    if (!imageUri) {
      const err = '[ArweaveUpload] null imageUri';
      console.log(err);
      handleCallback(error);
    }
    /*
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
```(bundle/config 2: .env 3: .eslintrc.js 4: .gitignore 5: .node-version 6: .prettierrc.js 7: .watchmanconfig 8: App.tsx 9: Gemfile 10: Gemfile.lock 11: README.md 12: __tests__/App-test.tsx 13: android/app/build.gradle 14: android/app/debug.keystore 15: android/app/proguard-rules.pro 16: android/app/src/debug/AndroidManifest.xml 17: android/app/src/debug/java/com/mobilenftminter/ReactNativeFlipper.java 18: android/app/src/main/AndroidManifest.xml 19: android/app/src/main/java/com/mobilenftminter/MainActivity.java 20: android/app/src/main/java/com/mobilenftminter/MainApplication.java 21: android/app/src/main/res/drawable/rn_edit_text_material.xml 22: android/app/src/main/res/mipmap-hdpi/ic_launcher.png 23: android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png 24: android/app/src/main/res/mipmap-mdpi/ic_launcher.png 25: android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png 26: android/app/src/main/res/mipmap-xhdpi/ic_launcher.png 27: android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png 28: android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png 29: android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png 30: android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png 31: android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png 32: android/app/src/main/res/values/strings.xml 33: android/app/src/main/res/values/styles.xml 34: android/app/src/release/java/com/mobilenftminter/ReactNativeFlipper.java 35: android/build.gradle 36: android/gradle.properties 37: android/gradle/wrapper/gradle-wrapper.jar 38: android/gradle/wrapper/gradle-wrapper.properties 39: android/gradlew 40: android/gradlew.bat 41: android/settings.gradle 42: app.json 43: babel.config.js 44: components/Colors.tsx 45: components/ConnectButton.tsx 46: components/DisconnectButton.tsx 47: components/Header.tsx 48: components/MintButton.tsx 49: components/NftMinter.tsx 50: components/Section.tsx 51: components/constants/GlobalStyles.js 52: components/constants/constants.ts 53: components/hooks/useMWAWallet.tsx 54: components/models/ArweaveMeta.ts 55: components/models/ImageMeta.ts 56: components/providers/AuthorizationProvider.tsx 57: components/providers/ConnectionProvider.tsx 58: components/ui/ErrorModal.tsx 59: components/ui/ErrorModalOverlay.tsx 60: components/ui/ErrorOverlay.tsx 61: components/ui/GenButton.tsx 62: img/background.png 63: img/pig.png 64: index.js 65: ios/.xcode.env 66: ios/MobileNFTMinter.xcodeproj/project.pbxproj 67: ios/MobileNFTMinter.xcodeproj/xcshareddata/xcschemes/MobileNFTMinter.xcscheme 68: ios/MobileNFTMinter.xcworkspace/contents.xcworkspacedata 69: ios/MobileNFTMinter/AppDelegate.h 70: ios/MobileNFTMinter/AppDelegate.mm 71: ios/MobileNFTMinter/Images.xcassets/AppIcon.appiconset/Contents.json 72: ios/MobileNFTMinter/Images.xcassets/Contents.json 73: ios/MobileNFTMinter/Info.plist 74: ios/MobileNFTMinter/LaunchScreen.storyboard 75: ios/MobileNFTMinter/main.m 76: ios/MobileNFTMinterTests/Info.plist 77: ios/MobileNFTMinterTests/MobileNFTMinterTests.m 78: ios/Podfile 79: ios/Podfile.lock 80: ipfs/ArweaveUpload.ts 81: ipfs/UploadToIPFS.ts 82: ipfs/getCid.ts 83: ipfs/nftClient.js 84: ipfs/testAuthentication.ts 85: metaplex-util/mwaPlugin.ts 86: metaplex-util/useMetaplex.tsx 87: metro.config.js 88: package.json 89: screens/MainScreen.tsx 90: tsconfig.json 91: types/node-libs-react-native.d.ts 92: util/alertAndLog.ts 93: util/errorResponse.ts 94: util/util.ts 95: util/validators.ts)```

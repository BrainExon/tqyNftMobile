import Config from 'react-native-config';
import axios from 'axios';

interface UrlExists {
  (
    url: string,
    callback: (error: Error | null, exists: boolean) => void,
    retries?: number,
  ): void;
}

export const urlExists: UrlExists = (url, callback, retries = 1) => {
  const makeRequest = (retryCount: number) => {
    fetch(url, {method: 'GET'})
      .then(res => {
        console.log(`[urlExists] url ${url}`);
        if (res.ok) {
          callback(null, true);
        } else {
          if (retryCount > 0) {
            console.log(`[urlExists] retrying... ${retryCount} retries left`);
            setTimeout(() => {
              makeRequest(retryCount - 1);
            }, 8000); // 3 seconds timeout
          } else {
            callback(null, false);
          }
        }
      })
      .catch(err => {
        if (retryCount > 0) {
          console.log(`[urlExists] retrying... ${retryCount} retries left`);
          setTimeout(() => {
            makeRequest(retryCount - 1);
          }, 8000); // 3 seconds timeout
        } else {
          callback(err, false);
        }
      });
  };

  makeRequest(retries);
};

/**
 * This function "generateQrCode()" response looks something like this:
 * {
 *   "success":true,
 *   "data":"qrcodes/dbd7eb33-fac0-474d-a5fe-f96a878dac6e.png",
 *   "error":null
 * }
 * @param challenge
 */
export const generateQrCode = async (challenge: string) => {
  const formdata = new FormData();
  const verifyUrl = `${Config.NODEJS_EXPRESS_SERVER}/verify/${challenge}`;
  formdata.append('url', verifyUrl);
  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };
  const qrApi = `${Config.NODEJS_EXPRESS_SERVER}/qr_code`;
  const qr = await fetch(qrApi, requestOptions);
  console.log(`[generateQrCode] response: ${JSON.stringify(qr)} `);
  const jsonData = await qr.json();
  console.log(`[generateQrCode] response JSON: ${JSON.stringify(jsonData)} `);
  return jsonData;
};

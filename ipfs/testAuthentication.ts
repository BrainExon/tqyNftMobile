import axios from 'axios';
//import {baseUrl} from '../../constants';
import {createConfigForAxiosHeaders} from '../util/validators';
import {handleError} from '../util/errorResponse';
//import {PinataConfig} from '../..';
import Config from 'react-native-config';
import {printDebug} from '../util/util';

export interface PinataConfig {
  pinataApiKey?: string;
  pinataSecretApiKey?: string;
  pinataJWTKey?: string;
}

export interface PinataTestAuthenticationResponse {
  authenticated: boolean;
}

function testAuthentication(config): Promise<PinataTestAuthenticationResponse> {
  const func = '[testAuthentication] ';
  //  test authentication to make sure that the user's provided keys are legit
  const baseUrl = Config.PINATA_API_URL;
  const endpoint = `${baseUrl}/data/testAuthentication`;

  printDebug(`${func} Pinata endpoint: `, endpoint, Config.PRINT_DEBUG);
  printDebug(`${func} Pinata config: `, config, Config.PRINT_DEBUG);

  return new Promise((resolve, reject) => {
    axios
      .get(endpoint, {...createConfigForAxiosHeaders(config)})
      .then(function (result) {
        if (result.status !== 200) {
          reject(
            new Error(
              `unknown server response while authenticating: ${result}`,
            ),
          );
        } else {
          printDebug(`${func} Pinata RESULT: `, result, Config.PRINT_DEBUG);
        }
        resolve({
          authenticated: true,
        });
      })
      .catch(function (error) {
        const formattedError = handleError(error);
        printDebug(`${func} AXIOS ERROR: `, error, Config.PRINT_DEBUG);
        reject(formattedError);
      });
  });
}
export default testAuthentication;

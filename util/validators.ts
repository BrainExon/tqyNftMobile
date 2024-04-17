import {PinataConfig} from '../ipfs/testAuthentication';
import {ERROR_NO_CREDENTIALS_PROVIDED} from '../components/constants/constants';
import Config from 'react-native-config';
import {printDebug} from './util';
//import {version} from './package.json';

const commonHeaders = {
  'x-pinata-origin': 'sdk',
  //'x-version': version,
};
export interface axiosHeaders {
  maxContentLength: number;
  maxBodyLength: number;
  headers: {
    [key: string]: any;
  };
  withCredentials?: boolean;
}

export function validateApiKeys(
  pinataApiKey?: string,
  pinataSecretApiKey?: string,
) {
  const func = '[validateApiKeys]';
  if (!pinataApiKey || pinataApiKey === '') {
    throw new Error(
      'No pinataApiKey provided! Please provide your pinata api key as an argument when you start this script',
    );
  }
  if (!pinataSecretApiKey || pinataSecretApiKey === '') {
    throw new Error(
      'No pinataSecretApiKey provided! Please provide your pinata secret api key as an argument when you start this script',
    );
  }
  printDebug(`${func} KEYS ARE VALID: `, pinataApiKey, Config.PRINT_DEBUG);
  return true;
}

export function createConfigForAxiosHeaders(config: PinataConfig) {
  if (
    config.pinataApiKey &&
    config.pinataApiKey.length > 0 &&
    config.pinataSecretApiKey &&
    config.pinataSecretApiKey.length > 0
  ) {
    return {
      withCredentials: true,
      headers: {
        ...commonHeaders,
        pinata_api_key: config.pinataApiKey,
        pinata_secret_api_key: config.pinataSecretApiKey,
      },
    };
  }

  if (config.pinataJWTKey && config.pinataJWTKey.length > 0) {
    return {
      headers: {
        ...commonHeaders,
        Authorization: `Bearer ${config.pinataJWTKey}`,
      },
    };
  }

  throw new Error(ERROR_NO_CREDENTIALS_PROVIDED);
}

export function createConfigForAxiosHeadersWithFormData(
  config: PinataConfig,
  boundaryValue: string,
) {
  const requestOptions: axiosHeaders = {
    ...createConfigForAxiosHeaders(config),
    maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large files
    maxBodyLength: Infinity,
  };

  requestOptions.headers[
    'Content-type'
  ] = `multipart/form-data; boundary=${boundaryValue}`;

  requestOptions.headers = {...requestOptions.headers, ...commonHeaders};
  return requestOptions;
}

export function validateMetadata(metadata: any) {
  if (metadata.name) {
    if (
      !(typeof metadata.name === 'string' || metadata.name instanceof String)
    ) {
      throw new Error('metadata name must be of type string');
    }
  }

  if (metadata.keyvalues) {
    if (!(typeof metadata.keyvalues === 'object')) {
      throw new Error('metatadata keyvalues must be an object');
    }

    let i = 0;

    Object.entries(metadata.keyvalues).forEach(function (keyValue: any) {
      if (i > 9) {
        throw new Error(
          'No more than 10 keyvalues can be provided for metadata entries',
        );
      }
      //  we want to make sure that the input is a string, a boolean, or a number, so we don't get an object passed in by accident
      if (
        !(
          typeof keyValue[1] === 'string' ||
          typeof keyValue[1] === 'boolean' ||
          !isNaN(keyValue[1])
        )
      ) {
        throw new Error(
          'Metadata keyvalue values must be strings, booleans, or numbers',
        );
      }
      i++;
    });
  }
}

export function validatePinPolicyStructure(pinPolicy: {regions: any[]}) {
  //this function takes in a pin policy and checks the JSON structure to make sure it's valid
  if (!pinPolicy) {
    throw new Error('No pin policy provided');
  }

  if (!pinPolicy.regions) {
    throw new Error('No regions provided in pin policy');
  }
  if (pinPolicy.regions.length) {
    pinPolicy.regions.forEach(region => {
      if (
        !region.id ||
        !(Object.prototype.toString.call(region.id) === '[object String]')
      ) {
        throw new Error('region id must be a string');
      }

      if (
        !(
          region.desiredReplicationCount || region.desiredReplicationCount === 0
        ) ||
        !Number.isInteger(region.desiredReplicationCount)
      ) {
        throw new Error('desiredReplicationCount must be an integer');
      }
    });
  }
}

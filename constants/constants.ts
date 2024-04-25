import Config from 'react-native-config';
export const baseUrl = 'https://api.pinata.cloud';
export const ERROR_NO_CREDENTIALS_PROVIDED =
  'No credentials provided! Please provide your pinata api keys, or JWT token, when starting this script.';
export const categories = [
  {label: 'Gaming', value: 'gaming'},
  {label: 'Social Challenge', value: 'social_challenge'},
  {label: 'Corporate', value: 'corporate_training'},
  {label: 'Continuing Education', value: 'continuing_education'},
  {label: 'Certification', value: 'certification'},
  {label: 'Xtreme', value: 'xtreme'},
  {label: 'Sports', value: 'sports'},
  {label: 'Toqyn This', value: 'toqyn_this'},
  {label: 'Licensing', value: 'licensing'},
  {label: 'Personal Challenge', value: 'personal_challenge'},
  {label: 'Event', value: 'event'},
  {label: 'Other', value: 'other'},
];
export const ImageMetaTemplate = {
  appName: `${Config.META_APP_NAME}`,
  version: `${Config.META_APP_VERSION}`,
  author: `${Config.META_APP_AUTHOR}`,
  company: `${Config.META_APP_COMPANY}`,
  date: '',
  description: '',
  features: [
    {
      name: 'Uploads',
      limit: `${Config.META_LIMIT}`,
      fileTypeLimits: {
        Text: `${Config.META_TEXT_LIMIT}`,
        Image: `${Config.META_IMAGE_LIMIT}`,
        Video: `${Config.META_VIDEO_LIMIT}`,
      },
    },
  ],
  ipfsUri: 'https://ipfs.io/ipfs/',
  attributes: [],
};

/**
 * files: [{uri: imageUrl, type: 'image/png'}],
 * files: [{url: imageUrl, type: imageType}]
 * creators: [{address: 'CBBUMHRmbVUck99mTCip5sHP16kzGj3QTYB8K3XxwmQx', share: 100}],
 */
export const arweaveImageTemplate = {
  name: `${Config.META_APP_NAME}`,
  symbol: `${Config.META_APP_SYMBOL}`,
  description: '',
  seller_fee_basis_points: 500,
  external_url: `${Config.META_APP_URL}`,
  attributes: [{trait_type: 'NFT type', value: 'Custom'}],
  collection: {
    name: 'Test Collection',
    family: 'Custom NFTs',
  },
  properties: {
    files: [],
    category: 'image',
    maxSupply: 0,
    creators: [],
  },
  imageUrl: '',
  imageType: '',
};

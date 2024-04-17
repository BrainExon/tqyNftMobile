type Attribute = {trait_type: string; value: string};
type Creator = {address: string; share: number};
type Metadata = {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  external_url: string;
  attributes: Attribute[];
  collection: {name: string; family: string};
  properties: {
    files: {uri: string; type: string}[];
    category: string;
    maxSupply: number;
    creators: Creator[];
  };
  imageUrl: string;
  imageType: string;
};

export class ArweaveMeta {
  metadata: Metadata;

  constructor(
    name: string,
    symbol: string,
    description: string,
    seller_fee_basis_points: number,
    external_url: string,
    attributes: Attribute[],
    collectionName: string,
    collectionFamily: string,
    imageUrl: string,
    imageType: string,
    creatorAddress: string,
    creatorShare: number,
    properties: {
      files: {uri: string; type: string}[];
      category: string;
      maxSupply: number;
      creators: Creator[];
    },
  ) {
    this.metadata = {
      name,
      symbol,
      description,
      seller_fee_basis_points,
      external_url,
      attributes,
      collection: {
        name: collectionName,
        family: collectionFamily,
      },
      properties: {
        files: properties.files,
        category: properties.category,
        maxSupply: properties.maxSupply,
        creators: [],
      },
      imageUrl,
      imageType,
    };
  }
}

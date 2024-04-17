type Attribute = {
  trait_type: string;
  value: string;
};

type Creator = {
  address: string;
  share: number;
};

type Metadata = {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  external_url: string;
  attributes: Attribute[];
  collection: {
    name: string;
    family: string;
  };
  properties: {
    files: {
      uri: string;
      type: string;
    }[];
    category: string;
    maxSupply: number;
    creators: Creator[];
  };
  image: string;
};

export class ImageMeta {
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
        files: [{uri: imageUrl, type: imageType}],
        category: 'image',
        maxSupply: 0,
        creators: [{address: creatorAddress, share: creatorShare}],
      },
      image: imageUrl,
    };
  }

  getMetadata(): Metadata {
    return this.metadata;
  }
}

interface CreatedItem {
  type: string;
  entityName?: string;
  entityId?: string;
  dataTxId?: string;
  metadataTxId?: string;
  bundledIn?: string;
  sourceUri?: string;
}

interface TipsItem {
  recipient: string;
  txId: string;
  winston: string;
}

interface Fees {
  [key: string]: string;
}

export interface NFTData {
  created: CreatedItem[];
  tips: TipsItem[];
  fees: Fees;
}

export class NFT {
  created: CreatedItem[];
  tips: TipsItem[];
  fees: Fees;

  constructor(data: NFTData) {
    this.created = data.created;
    this.tips = data.tips;
    this.fees = data.fees;
  }
}

export default NFT;

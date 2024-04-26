import {v4 as uuidv4} from 'uuid';

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
  nftId: string;
  created: CreatedItem[];
  tips: TipsItem[];
  fees: Fees;

  constructor(data: NFTData) {
    this.nftId = uuidv4();
    this.created = data.created;
    this.tips = data.tips;
    this.fees = data.fees;
  }
}

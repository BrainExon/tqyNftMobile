export class Challenge {
  chId: string;
  name: string;
  date: string;
  owner: string;
  users: string[];
  doubloon: string;
  nft: string;
  dataTxId: string;
  nftVersion: number;
  category: string;
  description: string;
  qrCode: string | null;
  constructor(
    chId: string,
    name: string,
    date: string,
    owner: string,
    users: string[] = [],
    doubloon: string,
    nft: string,
    dataTxId: string,
    nftVersion: number,
    category: string,
    description: string,
    qrCode: string | null,
  ) {
    this.chId = chId;
    this.name = name;
    this.date = date;
    this.owner = owner;
    this.users = users;
    this.doubloon = doubloon;
    this.nft = nft;
    this.dataTxId = dataTxId;
    this.nftVersion = nftVersion;
    this.category = category;
    this.description = description;
    this.qrCode = qrCode;
  }
}

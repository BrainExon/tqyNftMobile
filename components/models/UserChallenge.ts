export class UserChallenge {
  userChallengeId: string;
  userId: string,
  chId: string;
  chName: string;
  dateStarted: string;
  dateCompleted: string;
  doubloon: string;
  nft: string;
  dataTxId: string;
  nftVersion: number;
  category: string;
  description: string;
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
  }
}

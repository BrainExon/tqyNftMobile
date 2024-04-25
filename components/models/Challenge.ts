class Challenge {
  chId: string;
  name: string;
  date: string;
  owner: string;
  users: string[];
  doubloon: string;
  nft: string;
  nftVersion: number;
  category: string;
  constructor(
    chId: string,
    name: string,
    date: string,
    owner: string,
    users: string[] = [],
    doubloon: string,
    nft: string,
    nftVersion: number,
    category: string,
  ) {
    this.chId = chId;
    this.name = name;
    this.date = date;
    this.owner = owner;
    this.users = users;
    this.doubloon = doubloon;
    this.nft = nft;
    this.nftVersion = nftVersion;
    this.category = category;
  }
}

export default Challenge;

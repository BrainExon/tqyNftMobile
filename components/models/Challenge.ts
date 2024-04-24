class Challenge {
  chId: string;
  name: string;
  date: string;
  owner: string;
  users: string[];

  constructor(
    chId: string,
    name: string,
    date: string,
    owner: string,
    users: string[] = [],
  ) {
    this.chId = chId;
    this.name = name;
    this.date = date;
    this.owner = owner;
    this.users = users;
  }
}

export default Challenge;

export class UserChallenge {
  userChallengeId: string;
  userId: string;
  chId: string;
  nftId: string;
  doubloon: string;
  date: number;
  dateCompleted: number | null;
  status: string;
  name: string;
  description: string;
  constructor(
    userChallengeId: string,
    userId: string,
    chId: string,
    nftId: string,
    doubloon: string,
    date: number,
    dateCompleted: number,
    status: string,
    name: string,
    description: string,
  ) {
    this.userChallengeId = userChallengeId;
    this.userId = userId;
    this.chId = chId;
    this.nftId = nftId;
    this.doubloon = doubloon;
    this.date = date;
    this.dateCompleted = dateCompleted;
    this.status = status;
    this.name = name;
    this.description = description;
  }
}

export class UserChallenge {
  userChallengeId: string;
  userId: string;
  chId: string;
  nftId: string;
  doubloon: string;
  date: number;
  dateCompleted: number | null;

  constructor(
    userChallengeId: string,
    userId: string,
    chId: string,
    nftId: string,
    doubloon: string,
    date: number,
    dateCompleted: number | null,
  ) {
    this.userChallengeId = userChallengeId;
    this.userId = userId;
    this.chId = chId;
    this.nftId = nftId;
    this.doubloon = doubloon;
    this.date = date;
    this.dateCompleted = dateCompleted;
  }
}

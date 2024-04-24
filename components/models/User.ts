export class User {
  userId: string;
  phone: string;
  wallet: string;
  events: any[];
  chCreated: any[];
  chAccepted: any[];
  date: number;

  constructor(
    userId: string,
    phone: string,
    wallet: string,
    events: any[] = [],
    chCreated: any[] = [],
    chAccepted: any[] = [],
    date: number,
  ) {
    this.userId = userId;
    this.phone = phone;
    this.wallet = wallet;
    this.events = events;
    this.chCreated = chCreated;
    this.chAccepted = chAccepted;
    this.date = date;
  }
}

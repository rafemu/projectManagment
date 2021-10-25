export interface IEmployee {
    id?:string,
    firstName: string;
    lastName: string;
    phone: string;
    dailyWage: number;
    bankAccount: number;
    bankBranch: string;
    startFromDate?:Date;
    createdAt: Date;
  }
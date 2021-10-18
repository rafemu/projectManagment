import { IEmployee } from "./emplyee.interface";
export interface IDWage {
    id?:string,
    employeeId: IEmployee;
    dailyWage:number,
    startFrom:string,
  }
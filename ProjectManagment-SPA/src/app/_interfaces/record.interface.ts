import { IEmployee } from "./emplyee.interface";
import { IProject } from "./project.interface";

export interface IRecord {
    id?:string,
    date: Date;
    employeeId: any;
    projectId: any;
    startAt: Date;
    endAt: Date;
    payPerDay?: number;
    notes: string;
    createdAt: any;
  }
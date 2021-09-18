import { IEmployee } from "./emplyee.interface";
import { IProject } from "./project.interface";

export interface IRecord {
    id?:string,
    date: Date;
    employeeId: IEmployee;
    projectId: IProject;
    startAt: Date;
    endAt: Date;
    payPerDay: number;
    notes: string;
    createdAt: any;
  }
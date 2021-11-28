import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseURL } from '.';
import { IRecord } from '../_interfaces/record.interface';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  private recordsArray: IRecord[] = [];
  private recordsSubject = new BehaviorSubject<{
    records: IRecord[];
    totaleRecords: number;
  }>({ records: this.recordsArray, totaleRecords: 0 });
  public records$: Observable<{
    records: IRecord[];
    totaleRecords: number;
  }>;

  private recordsByProjectArray: IRecord[] = [];
  private recordsByProjectSubject = new BehaviorSubject<{
    records: IRecord[];
    totaleRecords: number;
  }>({ records: this.recordsByProjectArray, totaleRecords: 0 });
  public recordsByProject$: Observable<{
    records: IRecord[];
    totaleRecords: number;
  }>;

  constructor(private httpClient: HttpClient) {
    this.records$ = this.recordsSubject.asObservable();
    this.recordsByProject$ = this.recordsByProjectSubject.asObservable();
  }

  getAllRecords(recordPerPage?: number , currentPage?: number, month?: string,employeeId:number | undefined = undefined) {
    const queryParams = `?currentMonth=${month}&pagesize=${recordPerPage}&page=${currentPage}&employeeId=${employeeId}`;
    return this.httpClient
      .get(`${BaseURL}/timesSheet` + queryParams)
      .pipe(
        map((record: any) => {
          return {
            records: record.result.map((record: any) => {
              const {
                id,
                employeeId,
                date,
                firstName,
                lastName,
                startAt,
                endAt,
                notes,
                dailyWage,
                payPerDay,
                duration,
                dayWorkedPlace,
                startFromDate
              } = record;
              return {
                id: id,
                employeeId:employeeId,
                date: date,
                firstName: firstName,
                lastName: lastName,
                startAt: startAt,
                endAt: endAt,
                notes: notes,
                dailyWage: dailyWage,
                payPerDay: payPerDay,
                wageFrom:startFromDate,
                duration: duration,
                dayWorkedPlace:dayWorkedPlace
              };
            }),
            totalRecords: record.total,
          };
        })
      )
      .subscribe((recordsAndTotal) => {
        this.recordsArray = recordsAndTotal.records;
        console.log(this.recordsArray)
        this.recordsSubject.next({
          records: [...this.recordsArray],
          totaleRecords: recordsAndTotal.totalRecords,
        });
      });
  }

  getAllRecordByProject(recordPerPage?: number, currentPage?: number,projectId?:string) {
    const queryParams = `?pagesize=${recordPerPage}&page=${currentPage}`;
    return this.httpClient
      .get(`${BaseURL}/timesSheet/${projectId}` + queryParams)
      .pipe(
        map((record: any) => {
          console.log(record)
          return {
            records: record.map((record: any) => {
              const {
                id,
                employeeId,
                date,
                firstName,
                lastName,
                startAt,
                endAt,
                notes,
                dailyWage,
                payPerDay,
                duration,
                dayWorkedPlace,
                startFromDate
              } = record;
              return {
                id: id,
                employeeId:employeeId,
                date: date,
                firstName: firstName,
                lastName: lastName,
                startAt: startAt,
                endAt: endAt,
                notes: notes,
                dailyWage: dailyWage,
                payPerDay: payPerDay,
                wageFrom:startFromDate,
                duration: duration,
              };
            }),
            totalRecords: record.total,
          };
        })
      )
      .subscribe((recordsAndTotal) => {
        this.recordsByProjectArray = recordsAndTotal.records;
        this.recordsByProjectSubject.next({
          records: [...this.recordsByProjectArray],
          totaleRecords: recordsAndTotal.totalRecords,
        });
      });
  }

  addNewRecord(recordDetails: IRecord) {
    console.log(recordDetails)
    return this.httpClient.post(
      `${BaseURL}/timesSheet/addRecords`,
      recordDetails
    );
  }

  updateRecord(data: IRecord) {
    return this.httpClient.put(`${BaseURL}/timesSheet/editRecord/`, data);
  }
  
  deleteRecord(recordId:number){
    return this.httpClient.delete(`${BaseURL}/timesSheet/deleteRecord/${recordId}`)
  }

  calculateSalary(date: string) {
    return this.httpClient.post(
      `${BaseURL}/timesSheet/calculateSalary`,
      {currentMonth:date}
    );
  }

  getSalary(){
    return this.httpClient.get(`${BaseURL}/timesSheet/get/allSalaries`);
  }

  getSalaryByMonth(currentMonth:string){
    const queryParams = `?currentMonth=${currentMonth}`
    return this.httpClient.get(`${BaseURL}/timesSheet/getlast/Salary` + queryParams);
  }


}

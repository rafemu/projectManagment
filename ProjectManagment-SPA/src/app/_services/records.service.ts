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
  constructor(private httpClient: HttpClient) {
    this.records$ = this.recordsSubject.asObservable();
  }

  getAllRecords(recordPerPage?: number, currentPage?: number, month?: string) {
    const queryParams = `?currentMonth=${month}&pagesize=${recordPerPage}&page=${currentPage}`;
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
        console.log(recordsAndTotal )
        this.recordsArray = recordsAndTotal.records;
        this.recordsSubject.next({
          records: [...this.recordsArray],
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
}

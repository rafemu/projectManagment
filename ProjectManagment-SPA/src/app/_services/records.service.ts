import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseURL } from '.';
import { IRecord } from '../_interfaces/record.interface';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(private httpClient:HttpClient) {

   }


   addNewRecord(recordDetails:IRecord){
    console.log(recordDetails)
    return this.httpClient.post(
      `${BaseURL}/timesSheet/addRecords`,
      recordDetails
    );
   }

}

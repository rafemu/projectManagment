import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-calc-hr',
  templateUrl: './calc-hr.component.html',
  styleUrls: ['./calc-hr.component.scss']
})
export class CalcHrComponent implements OnInit {
  
  @Output() caclHrEvent = new EventEmitter<string>();
  public currentDate:string;

  constructor() {
    this.currentDate = moment()
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss");


   }

  ngOnInit(): void {
  }
  getSelectedDate(event: any) {
    this.currentDate = moment(event.value)
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss");
  }
  submit() {
    this.caclHrEvent.emit(this.currentDate);
  }
}

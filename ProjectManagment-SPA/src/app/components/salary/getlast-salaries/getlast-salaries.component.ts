import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-getlast-salaries',
  templateUrl: './getlast-salaries.component.html',
  styleUrls: ['./getlast-salaries.component.scss']
})
export class GetlastSalariesComponent implements OnInit {
  @Output() getSalarisByMonthEvent = new EventEmitter<string>();
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
    this.getSalarisByMonthEvent.emit(this.currentDate);
  }
}

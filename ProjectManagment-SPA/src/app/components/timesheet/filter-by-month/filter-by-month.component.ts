import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-by-month',
  templateUrl: './filter-by-month.component.html',
  styleUrls: ['./filter-by-month.component.scss'],
})
export class FilterByMonthComponent implements OnInit {
  @Output() getRecordsByDateEvent = new EventEmitter<Date>();
  @Output() filterByNameEvent = new EventEmitter<string>();
  @Output() AddRecordEvent = new EventEmitter<string>();

  public currentDate?: Date = new Date();
  public filterValue: string;
  constructor() {
    this.filterValue = '';
  }

  ngOnInit(): void {}

  getSelectedDate(event: any) {
    this.currentDate = event.value;
  }
  submit() {
    this.getRecordsByDateEvent.emit(this.currentDate);
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.filterByNameEvent.emit(this.filterValue);
  }

  addRecord(){
    this.AddRecordEvent.emit('Add')
  }

  clear() {
    this.filterValue = '';
  }
}

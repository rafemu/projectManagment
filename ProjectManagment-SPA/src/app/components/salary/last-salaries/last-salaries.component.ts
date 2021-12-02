import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-last-salaries',
  templateUrl: './last-salaries.component.html',
  styleUrls: ['./last-salaries.component.scss']
})
export class LastSalariesComponent implements OnInit {
@Input() lastSalary:any;


dataSource!: MatTableDataSource<any>;

displayedColumns = [
  'id',
  'salaryDate',
  'fullName',
  'workedDays',
  'dailyWage',
  'salary'
];


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<any>(this.lastSalary);
  }

  getTotalOftotal() {
    return this.lastSalary
      .map((t:any) => t.salary)
      .reduce((acc:any, value:any) => acc + Number(value), 0);
  }


}

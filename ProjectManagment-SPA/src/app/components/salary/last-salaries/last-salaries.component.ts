import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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

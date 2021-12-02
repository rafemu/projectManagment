import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employee-worked-days',
  templateUrl: './employee-worked-days.component.html',
  styleUrls: ['./employee-worked-days.component.scss']
})
export class EmployeeWorkedDaysComponent implements OnInit {
  @Input() recordsByProject!:any;
  public dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  displayedColumns = [
    'id',
    'date',
    'day',
    'firstName',
    'projectName',
    'startAt',
    'endAt',
    'duration',
    'dailyWage',
    'payPerDay',
    'notes',
    
  ];
  constructor() { }

  ngOnInit(): void {
    console.log(this.recordsByProject)
  }
  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<any>(this.recordsByProject);
  }

}

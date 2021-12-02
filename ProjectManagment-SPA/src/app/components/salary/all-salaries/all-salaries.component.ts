import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-all-salaries',
  templateUrl: './all-salaries.component.html',
  styleUrls: ['./all-salaries.component.scss']
})
export class AllSalariesComponent implements OnInit {
  @Input() salaries!:any;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  displayedColumns = [
    'id',
    'salaryDate',
    'total'
  ];


  constructor() {
   }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
    console.log(this.salaries)
    this.dataSource = new MatTableDataSource<any>(this.salaries);
  }

  getTotalOftotal() {
    return this.salaries
      .map((t:any) => t.total)
      .reduce((acc:any, value:any) => acc + Number(value), 0);
  }

}

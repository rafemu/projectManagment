import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-paids-details',
  templateUrl: './paids-details.component.html',
  styleUrls: ['./paids-details.component.scss']
})
export class PaidsDetailsComponent implements OnInit {

  @Input() projectPiads!:any;
  public dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  Object.create(null);
@ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
displayedColumns = [
  'id',
  'date',
  'paid',
  'notes',
];
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<any>(this.projectPiads?.paids);
  }
}

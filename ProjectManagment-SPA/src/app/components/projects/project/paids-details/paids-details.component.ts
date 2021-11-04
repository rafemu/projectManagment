import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddPaidsComponent } from './add-paids/add-paids.component';

@Component({
  selector: 'app-paids-details',
  templateUrl: './paids-details.component.html',
  styleUrls: ['./paids-details.component.scss']
})
export class PaidsDetailsComponent implements OnInit {
  @Output() AddPaidsEvent = new EventEmitter<any>();

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
  constructor(  public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(AddPaidsComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'undefined') return;
      if (result.event === 'Add') {
        console.log(result)
        this.AddPaidsEvent.emit(result.data)
      } else if (result.event === 'Update') {
        // this._employeeService
        //   .updateEmployee(result.data, obj.id)
        //   .subscribe((result) => {
        //     if (result) {
        //       this._employeeService.getAllemployee(
        //         this.employeesPerPage,
        //         this.currentPage
        //       );
        //     }
        //   });
      } else if (result.event === 'Delete') {
        // this._employeeService.deleteEmployee(obj.id).subscribe((result) => {
        //   if (result) {
        //     console.log('projectDeleted', result);
        //     this._employeeService.getAllemployee(
        //       this.employeesPerPage,
        //       this.currentPage
        //     );
        //   }
        // });
      }
    });
  }
  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<any>(this.projectPiads?.paids);
  }
}

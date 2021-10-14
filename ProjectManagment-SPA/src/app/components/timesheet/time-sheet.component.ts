import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IRecord } from 'src/app/_interfaces/record.interface';
import { EmployeesService } from 'src/app/_services/employees.service';
import { ProjectsService } from 'src/app/_services/projects.service';
import { RecordsService } from 'src/app/_services/records.service';
import { RecordActionComponent } from './record-action/record-action.component';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { setProjectsLS } from './projects.localStorage';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
   
})
export class TimeSheetComponent implements OnInit {
  public records: IRecord[] = [];
  public recordsPerPage = 30;
  public currentPage = 1;
  public pageSizeOptions = [30, 50, 100 ];
  public totalRecords = 0;
  private subRecords$: Subscription | undefined;
  private subProject:Subscription | undefined;
  private currentMonth!:string;
  public dataSource: MatTableDataSource<any>;
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
    'notes',
    'duration',
    'dailyWage',
    'payPerDay',
    
  ];
  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeesService,
    private projectsService: ProjectsService,
    private recordsService: RecordsService
  ) {
    this.dataSource = new MatTableDataSource<any>(this.records);
     this.currentMonth = moment().format("YYYY-MM-DD HH:mm:ss")
  }

  ngOnInit(): void {
    this.employeeService.getAllemployee();
    this.projectsService.getAllProjects();
     this.projectsService.projects$
      .pipe(filter((v) => v !== undefined))
      .subscribe((projec) => {
          setProjectsLS(projec.projects)
          this.getAllRecords()
      });
    
   
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRecordsByDate(event:any){
    this.currentMonth = moment(event).format("YYYY-MM-DD HH:mm:ss");
    this.recordsService.getAllRecords(
      this.recordsPerPage,
      this.currentPage,
      this.currentMonth
    );
  }

  getAllRecords(){
    this.recordsService.getAllRecords(
      this.recordsPerPage,
      this.currentPage,
      this.currentMonth
    );
    this.subRecords$ = this.recordsService.records$.subscribe((records) => {
      this.records = records.records;

      this.totalRecords = records.totaleRecords;
      this.dataSource = new MatTableDataSource<any>(this.records);
    });
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(RecordActionComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'undefined') return;
      if (result.event === 'Add') {
        console.log(result)
        this.recordsService.addNewRecord(result.data).subscribe((result) => {
          this.getAllRecords()
        });
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
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.recordsPerPage = pageData.pageSize;
    this.recordsService.getAllRecords(
      this.recordsPerPage,
      this.currentPage,
      this.currentMonth
    );
    this.recordsService.records$.subscribe((records) => {
      this.records = records.records;
      this.totalRecords = records.totaleRecords;
      this.dataSource = new MatTableDataSource<any>(this.records);
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { IEmployee } from 'src/app/_interfaces/emplyee.interface';
import { EmployeesService } from 'src/app/_services/employees.service';
import { EmployeeActionsComponent } from './employee-actions/employee-actions.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employee: IEmployee[] = [];
  employeesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50];
  totalEmployees = 0;
  public subEmployee$: Subscription | undefined;
  dataSource: MatTableDataSource<IEmployee>;
  public projectTitle: string = '';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  displayedColumns = [
    'id',
    'firstName',
    'lastName',
    'phone',
    'wagePerDay',
    'bankAccount',
    'bankBranch',
    'action'
  ];

  constructor(
    private _employeeService: EmployeesService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<IEmployee>(this.employee);
  }

  ngOnInit(): void {
    this._employeeService.getAllemployee(
      this.employeesPerPage,
      this.currentPage
    );
   this.subEmployee$ =  this._employeeService.employee$.subscribe((employee) => {
      this.employee = employee.employee;
      this.totalEmployees = employee.totalemployee;
      this.dataSource = new MatTableDataSource<IEmployee>(this.employee);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.employeesPerPage = pageData.pageSize;
    this._employeeService.getAllemployee(
      this.employeesPerPage,
      this.currentPage
    );
    this._employeeService.employee$.subscribe((employee) => {
      this.employee = employee.employee;
      this.totalEmployees = employee.totalemployee;
      this.dataSource = new MatTableDataSource<IEmployee>(this.employee);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(EmployeeActionsComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'undefined') return;
      if (result.event === 'Add') {
        this._employeeService.addEmployee(result.data).subscribe((result) => {
          if (result) {
            this._employeeService.getAllemployee(
              this.employeesPerPage,
              this.currentPage
            );
          }
        });
      } else if (result.event === 'Update') {
        this._employeeService
          .updateEmployee(result.data, obj.id)
          .subscribe((result) => {
            if (result) {
              this._employeeService.getAllemployee(
                this.employeesPerPage,
                this.currentPage
              );
            }
          });
      } else if (result.event === 'Delete') {
        this._employeeService.deleteEmployee(obj.id).subscribe((result) => {
          if (result) {
            console.log('projectDeleted', result);
            this._employeeService.getAllemployee(
              this.employeesPerPage,
              this.currentPage
            );
          }
        });
      }
    });
  }
  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.subEmployee$)this.subEmployee$.unsubscribe()
  }
}
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeesService } from 'src/app/_services/employees.service';
import { ProjectsService } from 'src/app/_services/projects.service';
import { RecordActionComponent } from './record-action/record-action.component';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss']
})
export class TimeSheetComponent implements OnInit {

  constructor(public dialog: MatDialog,private employeeService: EmployeesService,
    private projectsService: ProjectsService,) { }

  ngOnInit(): void {
    this.employeeService.getAllemployee()
    this.projectsService.getAllProjects()
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(RecordActionComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if (typeof result === 'undefined') return;
      if (result.event === 'Add') {
        // this._employeeService.addEmployee(result.data).subscribe((result) => {
        //   if (result) {
        //     this._employeeService.getAllemployee(
        //       this.employeesPerPage,
        //       this.currentPage
        //     );
        //   }
        // });
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

}

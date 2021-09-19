import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IRecord } from 'src/app/_interfaces/record.interface';
import { enableRipple } from '@syncfusion/ej2-base';
import { EmployeesService } from 'src/app/_services/employees.service';
import { ProjectsService } from 'src/app/_services/projects.service';
import { IEmployee } from 'src/app/_interfaces/emplyee.interface';
import { IProject } from 'src/app/_interfaces/project.interface';
import { combineLatest, forkJoin, Subscription, zip } from 'rxjs';
import { filter } from 'rxjs/operators';

enableRipple(true);

@Component({
  selector: 'app-record-action',
  templateUrl: './record-action.component.html',
  styleUrls: ['./record-action.component.scss'],
})
export class RecordActionComponent implements OnInit, OnDestroy {
  action: string;
  local_data: any;
  form: any;
  employees: IEmployee[] = [];
  projects: IProject[] = [];
  public subEmployee$: Subscription | undefined;
  public subProject$: Subscription | undefined;

  public dateValue: Date = new Date();
  public month: number = new Date().getMonth();
  public fullYear: number = new Date().getFullYear();
  public date: number = new Date().getDate();
  public startAt: Date = new Date(
    this.fullYear,
    this.month,
    this.date,
    10,
    0,
    0
  );
  public endAt: Date = new Date(this.fullYear, this.month, this.date, 16, 0, 0);
  public minValue: Date = new Date(
    this.fullYear,
    this.month,
    this.date,
    7,
    0,
    0
  );
  public maxValue: Date = new Date(
    this.fullYear,
    this.month,
    this.date,
    16,
    0,
    0
  );

  optionsEmployee: any = [];
  optionsProjects: any = [];

  constructor(
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<RecordActionComponent>,
    private employeeService: EmployeesService,
    private projectsService: ProjectsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IRecord
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.getProjects();
    this.getEmployees();
    this.initForm();
    if (this.local_data.action === 'Update') {
      this.filForm();
    }
  }

  getEmployees() {
    this.subEmployee$ = this.employeeService.employee$.pipe(filter((v)=>v!==undefined)).subscribe(
      (employees) => {
        this.employees = employees.employee;
        this.employees.map((emp) => {
          const obj = {
            display: emp.firstName + ' ' + emp.lastName,
            value: emp.id,
          };
          this.optionsEmployee.push(obj)

          // return obj
        });
        // this.optionsEmployee.push(this.employees)
      }
    );
  }

  getProjects() {
    this.subProject$ = this.projectsService.projects$.pipe(filter((v)=>v!==undefined)).subscribe((projec) => {
      this.projects = projec.projects;
      this.projects.map((proj) => {
        const obj = { display: proj.projectName, value: proj.id };
        // return obj;
        this.optionsProjects.push(obj);

      });
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: new FormControl(this.dateValue, {
        validators: [Validators.required],
      }),
      employeeId: new FormControl('', {
        validators: [Validators.required],
      }),
      projectId: new FormControl('', { validators: [Validators.required] }),
      startAt: new FormControl(this.startAt, {
        validators: [Validators.required],
      }),
      endAt: new FormControl(this.endAt, { validators: [Validators.required] }),
      notes: new FormControl(''),
    });
  }

  filForm() {
    this.form.setValue({
      date: this.local_data['date'],
      employeeId: this.local_data['employeeId'],
      projectId: this.local_data['projectId'],
      startAt: this.local_data['startAt'],
      endAt: this.local_data['endAt'],
      notes: this.local_data['notes'],
    });
  }

  doAction() {
    const record: IRecord = {
      date: this.form.value.date,
      employeeId: this.form.value.employeeId,
      projectId: this.form.value.projectId,
      startAt: this.form.value.startAt,
      endAt: this.form.value.endAt,
      payPerDay: this.form.value.payPerDay,
      notes: this.form.value.notes,
      createdAt: Date.now(),
    };

    if (this.form.invalids) return;
    this.dialogRef.close({ event: this.action, data: record });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  ngOnDestroy() {
    if (this.subEmployee$) this.subEmployee$.unsubscribe();
    if (this.subProject$) this.subProject$.unsubscribe();
  }
}

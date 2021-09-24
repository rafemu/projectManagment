import { DatePipe } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IRecord } from 'src/app/_interfaces/record.interface';
import { enableRipple } from '@syncfusion/ej2-base';
import { EmployeesService } from 'src/app/_services/employees.service';
import { ProjectsService } from 'src/app/_services/projects.service';
import { IEmployee } from 'src/app/_interfaces/emplyee.interface';
import { IProject } from 'src/app/_interfaces/project.interface';
import { Subscription, zip } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import * as moment from 'moment';

enableRipple(true);

@Component({
  selector: 'app-record-action',
  templateUrl: './record-action.component.html',
  styleUrls: ['./record-action.component.scss'],
})
export class RecordActionComponent implements OnInit, OnDestroy {
  @ViewChild(SelectAutocompleteComponent)
  multiSelect!: SelectAutocompleteComponent;

  action: string;
  local_data: any;
  form: any;
  employees: IEmployee[] = [];
  projects: IProject[] = [];
  private subEmployee$: Subscription | undefined;
  private subProject$: Subscription | undefined;

  // public recordDate: Date = new Date();//datevalue

  // public month: number = new Date().getMonth();
  // public fullYear: number = this.recordDate.getFullYear();
  // public date: number = this.recordDate.getDate();

  // public startAt: Date = new Date(
  //   this.fullYear,
  //   this.month,
  //   this.date,
  //   10,
  //   0,
  //   0
  // );

  // public endAt: Date = new Date(this.fullYear, this.month, this.date, 16, 0, 0);
  // public minValue: Date = new Date(
  //   this.fullYear,
  //   this.month,
  //   this.date,
  //   7,
  //   0,
  //   0
  // );
  // public maxValue: Date = new Date(
  //   this.fullYear,
  //   this.month,
  //   this.date,
  //   16,
  //   0,
  //   0
  // );
  public recordDate?: Date; //datevalue
  public month?: number;
  public fullYear?: number;
  public date?: number;
  public startAt?: Date;
  public endAt?: Date;
  // public minValue?: Date;
  // public maxValue?: Date;

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
      this.reChangeDates(new Date())
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
    this.subEmployee$ = this.employeeService.employee$
      .pipe(filter((v) => v !== undefined))
      .subscribe((employees) => {
        this.employees = employees.employee;
        this.employees.map((emp) => {
          const obj = {
            display: emp.firstName + ' ' + emp.lastName,
            value: emp.id,
          };
          this.optionsEmployee.push(obj);
        });
      });
  }

  getProjects() {
    this.subProject$ = this.projectsService.projects$
      .pipe(filter((v) => v !== undefined))
      .subscribe((projec) => {
        this.projects = projec.projects;
        this.projects.map((proj) => {
          const obj = { display: proj.projectName, value: proj.id };
          this.optionsProjects.push(obj);
        });
      });
  }

  initForm() {
    this.form = this.formBuilder.group({
      date: new FormControl(this.recordDate, {
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

    reChangeDates(newDate:Date) {
    this.recordDate = newDate
    this.month = new Date().getMonth();
    this.fullYear = this.recordDate.getFullYear();
    this.date = this.recordDate.getDate();
    this.startAt = new Date(this.fullYear, this.month, this.date, 7, 0, 0);
    this.endAt = new Date(this.fullYear, this.month, this.date, 16, 0, 0);
    // this.minValue = new Date(this.fullYear, this.month, this.date, 6, 0, 0);
    // this.maxValue = new Date( this.fullYear, this.month, this.date, 24, 0, 0 );

    console.log('start',this.startAt)
    console.log('endat',this.endAt) 

    // this.form.setValue({
    //   date:this.recordDate,
    //   startAt: this.startAt,
    //   endAt: this.endAt,
    // });
  }

  getRecordDate(event: any) {
    this.reChangeDates(event.value)
    // console.log('this.date', this.date);
    // console.log('this.startAt', this.startAt);
    // this.recordDate = event.value;
    // console.log('this.recordDate', this.recordDate);
  }

  doAction() {
    console.log(this.form.value.startAt);
    const record: IRecord = {
      date: this.form.value.date, //.format('YYYY-MM-DD'),
      employeeId: this.form.value.employeeId,
      projectId: this.form.value.projectId,
      startAt: this.form.value.startAt, // moment(this.form.value.startAt).format('HH:mm'),
      endAt: this.form.value.endAt, //moment(this.form.value.endAt).format('HH:mm'),
      notes: this.form.value.notes,
      createdAt: moment().format('YYYY-MM-DD'),
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

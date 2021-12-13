import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IDWage } from 'src/app/_interfaces/dailyWage.interface';
import { IEmployee } from 'src/app/_interfaces/emplyee.interface';
import { EmployeesService } from 'src/app/_services/employees.service';

@Component({
  selector: 'app-daily-wage',
  templateUrl: './daily-wage.component.html',
  styleUrls: ['./daily-wage.component.scss'],
})
export class DailyWageComponent implements OnInit {
  action: string;
  private local_data: any;
  public form: any;
  public currentDate?: string;
  public selectedEmployee: any;
  private subEmployee$?: Subscription;
  public employees: IEmployee[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    private employeeService: EmployeesService,
    public dialogRef: MatDialogRef<DailyWageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.currentDate = moment().startOf('month').format('YYYY-MM-DD'); 
  }

  ngOnInit(): void {
    this.getEmployees();
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      employeeId: new FormControl('', {
        validators: [Validators.required],
      }),
      dailyWage: new FormControl('', {
        validators: [Validators.required],
      }),
      startFrom: new FormControl(this.currentDate, {
        validators: [Validators.required],
      }),
    });
  }

  getEmployees() {
    this.subEmployee$ = this.employeeService.employee$
      .pipe(filter((v) => v !== undefined))
      .subscribe((employees) => {
        this.employees = employees.employee;
      });
  }

  doAction() {
    const { employeeId, dailyWage, startFrom } = this.form.value;
    const dailyWageData: IDWage = {
      employeeId: employeeId,
      dailyWage: dailyWage,
      startFrom: moment(startFrom).startOf('month').format('YYYY-MM-DD HH:mm:ss')
      //.split('T')[0],
    };
    if (this.form.invalids) return;
    this.dialogRef.close({ event: this.action, data: dailyWageData });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

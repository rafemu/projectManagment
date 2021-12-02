import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
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
import { Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import * as moment from 'moment';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { RecordsService } from 'src/app/_services/records.service';

enableRipple(true);

@Component({
  selector: 'app-record-action',
  templateUrl: './record-action.component.html',
  styleUrls: ['./record-action.component.scss'],
})
export class RecordActionComponent implements OnInit, OnDestroy {
  @ViewChild(SelectAutocompleteComponent)
  multiSelect!: SelectAutocompleteComponent;

  // toppingsControl = new FormControl([]);
  // toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  // employeeControl = new FormControl([]);
   availableEmployees: IEmployee[]  = []

  action: string;
  local_data: any;
  form: any;
  employees: IEmployee[] = [];
  selectedEmployees: any[] = [];
  selectedProjects: any[] = [];
  private subEmployee$: Subscription | undefined;
  private subProject$: Subscription | undefined;

  public recordDate?: Date; //datevalue
  public month?: number;
  public fullYear?: number;
  public date?: number;
  public startAt?: Date;
  public endAt?: Date;
  public selectedWorkedPlaces: Array<any> = [];
  private newDate?: Date;

  optionsEmployee: any = [];
  optionsProjects: any = [];

  //////////////////
  visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredProjects: Observable<string[]>;
  allProjects: IProject[] = [];
  opened = false;
  @ViewChild('projectInput') projectInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  @ViewChild('autocompleteTrigger') matACTrigger!: MatAutocompleteTrigger;
  /////////////////
  filteredEmployees: Observable<string[]>;
  allEmployees: IEmployee[] = [];
  @ViewChild('employeeInput') employeeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autoEmployee') matAutocompleteEmployee!: MatAutocomplete;
  @ViewChild('autocompleteTriggerEmployee')
  matACTriggerEmployee!: MatAutocompleteTrigger;
  /////////////////

  constructor(
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<RecordActionComponent>,
    private employeeService: EmployeesService,
    private projectsService: ProjectsService,
    private recordsService: RecordsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IRecord
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.getProjects();
    this.getEmployees();

    this.initForm();
    this.reChangeDates(new Date());

    if (this.local_data.action === 'Update') {
      this.filForm();
    }
    this.filteredProjects = this.form.get('projectId').valueChanges.pipe(
      startWith(null),
      map((project: string | null) =>
        project ? this._filter(project) : this.allProjects.slice()
      )
    );

    this.filteredEmployees = this.form.get('employeeId').valueChanges.pipe(
      startWith(null),
      map((employee: string | null) =>
        employee ? this._filterEmployee(employee) : this.availableEmployees.slice()
      )
    );
  }
  ngOnInit(): void {}

  getEmployees() {
    this.subEmployee$ = this.employeeService.employee$
      .pipe(filter((v) => v !== undefined))
      .subscribe((employees) => {
        this.allEmployees = employees.employee;
        this.availableEmployees = this.allEmployees;
      });
  }

  getProjects() {
    this.subProject$ = this.projectsService.projects$
      .pipe(filter((v) => v !== undefined))
      .subscribe((projec) => {
        this.allProjects = projec.projects;
      });
  }

  initForm() {
    console.log(this.local_data);
    this.form = this.formBuilder.group({
      date: new FormControl(this.recordDate, {
        validators: [Validators.required],
      }),
      employeeId: new FormControl('', {
        validators: [Validators.required],
      }),
      projectId: new FormControl([], { validators: [Validators.required] }),
      startAt: new FormControl(this.startAt, {
        validators: [Validators.required],
      }),
      endAt: new FormControl(this.endAt, { validators: [Validators.required] }),
      notes: new FormControl(''),
    });
  }

  filForm() {
    const projectsIdToArray = this.local_data.dayWorkedPlace.split(',');
    this.selectedProjects = this.allProjects.filter((fProject) => {
      return projectsIdToArray.find((p: any) => p == fProject.id);
    });
    this.selectedEmployees.push(this.local_data.employeeId);
    this.form.setValue({
      date: new Date(this.local_data['date']),
      employeeId: this.selectedEmployees,
      projectId: this.selectedProjects,
      startAt: this.local_data['startAt'],
      endAt: this.local_data['endAt'],
      notes: this.local_data['notes'],
    });
  }

  getSelectedOptions(selected: any) {
    this.selectedWorkedPlaces = selected;
  }

  getRecordDate(event: any) {
    this.reChangeDates(event.value);
    this.newDate = event.value;
  }

  reChangeDates(newDate: Date) {
    this.recordDate = newDate;
    this.month = this.recordDate.getMonth();
    this.fullYear = this.recordDate.getFullYear();
    this.date = this.recordDate.getDate();
    this.startAt = new Date(this.fullYear, this.month, this.date, 7, 0, 0);
    this.endAt = new Date(this.fullYear, this.month, this.date, 16, 0, 0);
    this.form.get('date').setValue(this.recordDate);
    this.form.get('startAt').setValue(this.startAt);
    this.form.get('endAt').setValue(this.endAt);

    this.recordsService
      .getRecordsByDate(newDate.toISOString().split('T')[0])
      .subscribe((result) =>{
       console.log(result)
       if(Array.isArray(result))this.filteredEmployees =  this.form.get('employeeId').valueChanges.pipe(
        startWith(null),
        map((employee: string | null) =>
        this.allEmployees.filter(employee=>!result.find(e=>employee.id === e.employeeId))
        )
      );
       
       
       console.log(this.availableEmployees)
       });
  }

  doAction() {
    let getSelectedProjectIds = this.selectedProjects.map((p) => p.id);
    let getSelectedEmployee;
    let id;
    if (this.action == 'Update') {
      getSelectedEmployee = this.selectedEmployees;
      id = this.local_data.id ? this.local_data.id : null;
    } else {
      getSelectedEmployee = this.selectedEmployees.map((e) => e.id);
    }
    const record: IRecord = {
      id,
      date: this.form.value.date.toISOString().split('T')[0], //.format('YYYY-MM-DD'),
      employeeId: getSelectedEmployee,
      projectId: getSelectedProjectIds,
      startAt: this.form.value.startAt,
      endAt: this.form.value.endAt,
      notes: this.form.value.notes,
      createdAt: moment().format('YYYY-MM-DD'),
    };
    console.log(record);
    if (this.form.invalids) return;
    this.dialogRef.close({ event: this.action, data: record });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  //////////////

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value: any = event.value;
    if (value.trim()) {
      this.selectedProjects.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.form.get('projectId').setValue(null);
  }

  remove(fruit: any): void {
    console.log(fruit);
    const index = this.selectedProjects.indexOf(fruit);

    if (index >= 0) {
      this.selectedProjects.splice(index, 1);
    }
  }

  selected(event: any): void {
    const newValue: any = event.option.value;
    let alreadySelected = this.selectedProjects.some(
      (vendor) => vendor['id'] === newValue?.id
    );

    if (alreadySelected) {
      this.selectedProjects = [
        ...this.selectedProjects.filter(
          (project) => project.id !== newValue.id
        ),
      ];
    } else {
      this.selectedProjects.push(newValue);
    }

    this.projectInput.nativeElement.value = '';
    this.form.controls['projectId'].setValue(null);

    requestAnimationFrame(() => {
      this.openAuto(this.matACTrigger);
    });
  }

  private _filter(value: any) {
    return this.allProjects.filter((project: any) =>
      project.projectName.includes(value)
    );
  }

  openAuto(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.projectInput.nativeElement.focus();
  }

  /////////////

  addEmployee(event: MatChipInputEvent): void {
    const input = event.input;
    const value: any = event.value;
    if (value.trim()) {
      this.selectedEmployees.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.form.get('projectId').setValue(null);
  }

  removeEmployee(fruit: any): void {
    const index = this.selectedEmployees.indexOf(fruit);

    if (index >= 0) {
      this.selectedEmployees.splice(index, 1);
    }
  }

  selectedEmployeeF(event: any): void {
    const newValue: any = event.option.value;
    let alreadySelected = this.selectedEmployees.some(
      (employee) => employee['id'] === newValue?.id
    );

    if (alreadySelected) {
      this.selectedEmployees = [
        ...this.selectedEmployees.filter(
          (employee) => employee.id !== newValue.id
        ),
      ];
    } else {
      this.selectedEmployees.push(newValue);
    }

    this.employeeInput.nativeElement.value = '';
    this.form.controls['employeeId'].setValue(null);

    requestAnimationFrame(() => {
      this.openAutoEmployee(this.matACTriggerEmployee);
    });
  }

  private _filterEmployee(value: any) {
    return this.availableEmployees.filter((employee: any) =>
      employee.firstName.includes(value)
    );
  }

  openAutoEmployee(trigger: MatAutocompleteTrigger) {
    trigger.openPanel();
    this.employeeInput.nativeElement.focus();
  }

  /////////////
  ngOnDestroy() {
    if (this.subEmployee$) this.subEmployee$.unsubscribe();
    if (this.subProject$) this.subProject$.unsubscribe();
  }
}

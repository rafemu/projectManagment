import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { RecordsService } from 'src/app/_services/records.service';

@Component({
  selector: 'app-employee-data-tabel',
  templateUrl: './employee-data-tabel.component.html',
  styleUrls: ['./employee-data-tabel.component.scss'],
})
export class EmployeeDataTabelComponent implements OnInit {
  public records: any;
  public employeeRecod: any = [];
  public currentMonth!: string;
  public monthDays: any[] = [];
  public dataSource: MatTableDataSource<any>;
  private employeeId?: number;

  displayedColumns = [
    // 'id',
    'date',
    'day',
    'firstName',
    'projectName',
    'startAt',
    'endAt',
    'duration',
    'dailyWage',
    'payPerDay',
    'notes',
  ];

  constructor(
    private recordsService: RecordsService,
    private router: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource<any>(this.employeeRecod);
    this.currentMonth = moment().format(
      'YYYY-MM-DD HH:mm:ss'
    );
    //'2021-09-30T13:00:00.000Z'
  }

  ngOnInit(): void {

    this.router.params.subscribe((params) => {
      this.employeeId = params.id;
      this.getRecordsByDate(this.currentMonth);
    });
    this.recordsService.records$.subscribe((record) => {
      this.records = record.records;
      this.filterDates();
    });
  }

  getSelectedDate(event:any){ 
    this.currentMonth =  moment(event.value).format(
      'YYYY-MM-DD HH:mm:ss'
    );
  }

  submit(){
    console.log(this.currentMonth)
    this.getRecordsByDate(this.currentMonth)
    this.filterDates()
  }

  filterDates() {
    console.log(this.monthDays)
    this.monthDays = this.getDaysOfMonth(
      moment(this.currentMonth).year(),
      moment(this.currentMonth).month() + 1
    );
    this.monthDays.map((day, index) => {
      const dailyWork = this.records.find((rec: any) => {
        if (moment(rec.date).isSame(day.date)) {
          this.monthDays.splice(index, 1, rec);
        }
      });
    });
    this.dataSource = new MatTableDataSource<any>(this.monthDays);
  }

  getTotalDuration() {
    return this.monthDays
      .map((t) => t.duration)
      .reduce((acc, value) => acc + Number(value) , 0);
  }

  getTotalOfPayPerDay() {
    return this.monthDays
      .map((t) => t.payPerDay)
      .reduce((acc, value) => acc + Number(value), 0);
  }

  getDaysOfMonth = function (year: number, month: number) {
    var monthDate = moment(year + '-' + month, 'YYYY-MM');
    var daysInMonth = monthDate.daysInMonth();
    var arrDays = [];

    while (daysInMonth) {
      var current = moment(monthDate, 'YYYY-MM-DD').date(daysInMonth);
      arrDays.push({
        date: current.format('YYYY-MM-DD'),
        dailyWage: '',
        dayWorkedPlace: null,
        duration: '',
        employeeId: '',
        endAt: null,
        firstName: '',
        id: '',
        lastName: '',
        notes: '',
        payPerDay: '',
        startAt: null,
        wageFrom: null,
      });
      daysInMonth--;
    }
    return arrDays;
  };

  getRecordsByDate(event: any) {
    this.recordsService.getAllRecords(
      40,
      1,
      event,
      this.employeeId
    );
  }
}
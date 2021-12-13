import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { RecordsService } from 'src/app/_services/records.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss'],
})
export class SalaryComponent implements OnInit {
  public salaries: any[] = [];
  public salaryByMonth : any[] = [];
  private currentMonth:string;
  constructor(private recordsServices: RecordsService) {
    this.currentMonth = moment()
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss");

  }

  ngOnInit(): void {
    this.getSalaries();
    this.getSalaryByMonth(this.currentMonth)
  }

  getSalaries() {
    this.recordsServices.getSalary().subscribe((res: any) => {
      this.salaries = res.result;
    });
  }

  getSalarisByMonth(event:any){
    if(!event) return;
    this.getSalaryByMonth(event)
  }

  getSalaryByMonth(month:string) {
    this.recordsServices.getSalaryByMonth(month).subscribe((res: any) => {
      this.salaryByMonth = res.result;
    });
  }

  calculateSalary(event: any) {
    if(!event) return;
    this.recordsServices.calculateSalary(event).subscribe((result) => {
      this.getSalaries();
      this.getSalaryByMonth(this.currentMonth);
    });
  }
}

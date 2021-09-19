import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseURL } from '.';
import { IEmployee } from '../_interfaces/emplyee.interface';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private employeeArray: IEmployee[] = [];
  private employeeSubject = new BehaviorSubject<{
    employee: IEmployee[];
    totalemployee: number;
  }>({ employee: this.employeeArray, totalemployee: 0 });
  public employee$: Observable<{
    employee: IEmployee[];
    totalemployee: number;
  }>;
  constructor(private httpClient: HttpClient) {
    this.employee$ = this.employeeSubject.asObservable();
  }

  getAllemployee(employeePerPage?: number, currentPage?: number) {
    const queryParams = `?pagesize=${employeePerPage}&page=${currentPage}`;
    return this.httpClient
      .get(`${BaseURL}/employee` + queryParams)
      .pipe(
        map((employee: any) => {
          console.log(employee)
          return {
            employee: employee.result.map((employee: IEmployee) => {
              return {
                id: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                phone: employee.phone,
                wagePerDay: employee.wagePerDay,
                bankAccount: employee.bankAccount,
                bankBranch: employee.bankBranch,
                createdAt: employee.createdAt,
              };
            }),
            totalemployee: employee.total,
          };
        })
      )
      .subscribe((employees) => {
        this.employeeArray = employees.employee;
        // console.log(employees)
        this.employeeSubject.next({
          employee: [...this.employeeArray],
          totalemployee: employees.totalemployee,
        });
      });
  }

  addEmployee(data: IEmployee) {
    return this.httpClient.post(`${BaseURL}/employee`, data);
  }

  updateEmployee(data: IEmployee, employeeId: number) {
    return this.httpClient.put(`${BaseURL}/employee/${employeeId}`, data);
  }

  deleteEmployee(employeeId: number) {
    return this.httpClient.delete(`${BaseURL}/employee/${employeeId}`);
  }
}

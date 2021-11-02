import { Pipe, PipeTransform } from '@angular/core';
import { getProjectsLS } from '../components/timesheet/projects.localStorage';
import { IProject } from '../_interfaces/project.interface';
@Pipe({
  name: 'ProjectPipe',
})
export class ProjectsPipe implements PipeTransform {
  private projects: IProject[] = [];
  private projectName!: any;
  private concatName = '';

  constructor() {
    this.projects = getProjectsLS() || null;
  }
  transform(value: any, ...args: any[]): any {
    if (value == null) return (this.concatName = 'Vacation');
    console.log(value);
    let spliteProjectId = value.split(',');
    console.log(spliteProjectId)
    spliteProjectId.map((p: any) => {
      console.log(p)
      this.projectName = this.projects.filter((project) => {
        return project.id == p;
      });
      spliteProjectId.length > 1
        ? (this.concatName += ' / ' + this.projectName[0].projectName)
        : (this.concatName = this.projectName[0].projectName);
    });

    return this.concatName; 
  }
}

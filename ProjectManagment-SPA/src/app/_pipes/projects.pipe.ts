import { Pipe, PipeTransform } from '@angular/core';
import { getProjectsLS } from '../components/timesheet/projects.localStorage';
import { IProject } from '../_interfaces/project.interface';
@Pipe({
  name: 'ProjectPipe'
})
export class ProjectsPipe implements PipeTransform {
  private  projects: IProject[] = [];
  private projectName!:any;
  private concatName=''

constructor(
  ){
 
  this.projects = getProjectsLS() || null;
}
  transform(value: any, ...args: any[]): any {
    let spliteProjectId = value.split(",");
    spliteProjectId.map((p:any)=>{
     this.projectName =  this.projects.filter(project=>{
          return project.id == p
          })
     spliteProjectId.length > 1 ? this.concatName += ' / ' +   this.projectName[0].projectName : this.concatName= this.projectName[0].projectName 
    })

    return this.concatName
  }
}

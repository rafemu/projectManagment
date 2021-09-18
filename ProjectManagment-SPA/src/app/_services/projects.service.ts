import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseURL } from '.';
import { IProject } from '../_interfaces/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private projectsArray: IProject[] = [];
  private projectsSubject = new BehaviorSubject<{
    projects: IProject[];
    totalProjects: number;
  }>({ projects: this.projectsArray, totalProjects: 0 });
  public projects$: Observable<{ projects: IProject[]; totalProjects: number }>;
  constructor(private httpClient: HttpClient) {
    this.projects$ = this.projectsSubject.asObservable();
  }

  getAllProjects(projectsPerPage?: number, currentPage?: number) {
    const queryParams = `?pagesize=${projectsPerPage}&page=${currentPage}`;
    return this.httpClient
      .get(`${BaseURL}/projects` + queryParams)
      .pipe(
        map((projects: any) => {
          return {
            projects: projects.result.map((project: IProject) => {
              const img = project.agreement ==null ? project.agreement= 'default/default-placeholder-150x150.png' : project.agreement.split("/")[1]; 
              return {
                id: project.id,
                projectName: project.projectName,
                clientFullName: project.clientFullName,
                clientPhone: project.clientPhone,
                location: project.location,
                quotation: project.quotation,
                paid: project.paid,
                unPaid: project.unPaid,
                haregem: project.haregem,
                agreement: img,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
              };
            }),
            totalProjects: projects.total,
          };
        })
      )
      .subscribe((transformData) => {
        this.projectsArray = transformData.projects;
        this.projectsSubject.next({
          projects: [...this.projectsArray],
          totalProjects: transformData.totalProjects,
        });
      });
  }

  addProject(data: IProject) {
    const formDataHeader = {
      headers: new HttpHeaders({
        "content-type": "multipart/form-data",
      })
    };
    console.log(data);
    const postData = new FormData();
    postData.append('projectName', data.projectName);
    postData.append('clientFullName', data.clientFullName);
    postData.append('clientPhone', data.clientPhone);
    postData.append('location', data.location);
    postData.append('quotation', data.quotation.toString());
    postData.append('paid', data.paid.toString());
    postData.append('createdAt', data.createdAt.toString());
    postData.append('agreement', data.agreement);
    console.log(postData)
      return this.httpClient.post(
        `${BaseURL}/projects`,
        postData
      );
  }

  updateProject(data: IProject,projectId:number) {
    const postData = new FormData();
    postData.append('projectName', data.projectName);
    postData.append('clientFullName', data.clientFullName);
    postData.append('clientPhone', data.clientPhone);
    postData.append('location', data.location);
    postData.append('quotation', data.quotation.toString());
    postData.append('paid', data.paid.toString());
    postData.append('createdAt', data.createdAt.toString());
    postData.append('agreement', data.agreement);
    console.log(data)
      return this.httpClient.put(
        `${BaseURL}/projects/${projectId}`,
        postData
      );
  }

  deleteProject(projectId: number) {
      return this.httpClient.delete(
        `${BaseURL}/projects/${projectId}`
      );
  }

}

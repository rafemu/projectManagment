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

  private projectById!: IProject;
  private projectByIdSubject = new BehaviorSubject<{ project: IProject }>({
    project: this.projectById,
  });
  public projectById$: Observable<{ project: IProject }>;

  constructor(private httpClient: HttpClient) {
    this.projects$ = this.projectsSubject.asObservable();
    this.projectById$ = this.projectByIdSubject.asObservable();
  }

  getAllProjects(projectsPerPage?: number, currentPage?: number) {
    const queryParams = `?pagesize=${projectsPerPage}&page=${currentPage}`;
    return this.httpClient
      .get(`${BaseURL}/projects` + queryParams)
      .pipe(
        map((projects: any) => {
          return {
            projects: projects.result.map((project: IProject) => {
              const img =
                project.agreement == null
                  ? (project.agreement =
                      'default/default-placeholder-150x150.png')
                  : project.agreement.split('/')[1];
              const {
                id,
                projectName,
                clientFullName,
                clientPhone,
                location,
                quotation,
                paid,
                unPaid,
                haregem,
                createdAt,
                updatedAt,
              } = project;
              return {
                id: id,
                projectName: projectName,
                clientFullName: clientFullName,
                clientPhone: clientPhone,
                location: location,
                quotation: quotation,
                paid: paid,
                unPaid: unPaid,
                haregem: haregem,
                agreement: img,
                createdAt: createdAt,
                updatedAt: updatedAt,
              };
            }),
            totalProjects: projects.total,
          };
        })
      )
      .subscribe((projects) => {
        this.projectsArray = projects.projects;
        this.projectsSubject.next({
          projects: [...this.projectsArray],
          totalProjects: projects.totalProjects,
        });
      });
  }

  getProjectById(id: string) {
    return this.httpClient
      .get(`${BaseURL}/projects/` + id)
      .pipe(
        map((project: any) => {
          console.log(project);

          const img =
            project.agreement == null
              ? (project.agreement = 'default/default-placeholder-150x150.png')
              : project.agreement.split('/')[1];

          const {
            id,
            projectName,
            clientFullName,
            clientPhone,
            location,
            quotation,
            paid,
            unPaid,
            haregem,
            createdAt,
            updatedAt,
          } = project;
          return {
            id: id,
            projectName: projectName,
            clientFullName: clientFullName,
            clientPhone: clientPhone,
            location: location,
            quotation: quotation,
            paid: paid,
            unPaid: unPaid,
            haregem: haregem,
            agreement: img,
            createdAt: createdAt,
            updatedAt: updatedAt,
          };
        })
      )
      .subscribe((project) => {
        this.projectById = project;
        this.projectByIdSubject.next({
          project: this.projectById,  
        });
      });
  }
  addProject(data: IProject) {
    const formDataHeader = {
      headers: new HttpHeaders({
        'content-type': 'multipart/form-data',
      }),
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
    console.log(postData);
    return this.httpClient.post(`${BaseURL}/projects`, postData);
  }

  getProjectPaids(id:string): Promise<Array<any>> {
    return (this.httpClient.get(`${BaseURL}/projects/getPaids/${id}`).toPromise() as Promise<Array<any>>)
  }

  updateProject(data: IProject, projectId: number) {
    const postData = new FormData();
    postData.append('projectName', data.projectName);
    postData.append('clientFullName', data.clientFullName);
    postData.append('clientPhone', data.clientPhone);
    postData.append('location', data.location);
    postData.append('quotation', data.quotation.toString());
    postData.append('paid', data.paid.toString());
    postData.append('createdAt', data.createdAt.toString());
    postData.append('agreement', data.agreement);
    console.log(data);
    return this.httpClient.put(`${BaseURL}/projects/${projectId}`, postData);
  }

  deleteProject(projectId: number) {
    return this.httpClient.delete(`${BaseURL}/projects/${projectId}`);
  }
}

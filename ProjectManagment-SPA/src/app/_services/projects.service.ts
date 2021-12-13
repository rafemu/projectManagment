import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { BaseURL } from '.';
import { IPaids } from '../_interfaces/paids.interface';
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

  getAllProjects(projectsPerPage?: number, currentPage?: number,searchValue?: string) {
    const queryParams =`?pagesize=${projectsPerPage}&page=${currentPage}`;
    return this.httpClient
      .post(`${BaseURL}/projects/getProjects` + queryParams,{searchValue})
      .pipe(
        map((projects: any) => {
          return {
            projects: projects.result.map((project: IProject) => {
              const img =
                project.agreement == null
                  ? (project.agreement =
                      'default/default-placeholder-150x150.png')
                  : project.agreement.replace('images/','');
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
          const img =
          project.agreement == null
            ? (project.agreement =
                'default/default-placeholder-150x150.png')
            : project.agreement.replace('images/','');

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
            notes,
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
            quotationNotes:notes,
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
    // const formDataHeader = {
    //   headers: new HttpHeaders({
    //     'content-type': 'multipart/form-data',
    //   }),
    // };
    // const postData = new FormData();
    // postData.append('projectName', data.projectName);
    // postData.append('clientFullName', data.clientFullName);
    // postData.append('clientPhone', data.clientPhone);
    // postData.append('location', data.location);
    // // postData.append('quotation', data.quotation.toString());
    // // postData.append('paid', data.paid.toString());
    // postData.append('createdAt', data.createdAt.toString());
    // // postData.append('agreement', data.agreement);
    return this.httpClient.post(`${BaseURL}/projects`, data);
  }

  getProjectPaids(id: string): Promise<Array<any>> {
    return this.httpClient
      .get(`${BaseURL}/projects/getPaids/${id}`)
      .toPromise() as Promise<Array<any>>;
  }

  addProjectQuotation(quotationData:any){
    
    const { projectId, notes,quotation, imagePath } = quotationData;
    const quotData = new FormData();
    quotData.append('projectId', projectId);
    quotData.append('quotation', quotation);
    if (imagePath) quotData.append('agreement', imagePath);
    quotData.append('notes', notes);

    return this.httpClient.post(`${BaseURL}/projects/quotation/${projectId}`, quotData);
  }

  updateQuotation(quotationData:any){
    const { projectId, notes,quotation, imagePath } = quotationData;
    const quotData = new FormData();
    quotData.append('projectId', projectId);
    quotData.append('quotation', quotation);
    if (imagePath) quotData.append('agreement', imagePath);
    quotData.append('notes', notes);

    return this.httpClient.put(`${BaseURL}/projects/updateQuotation/${projectId}`, quotData);
  }

  addProjectPaids(paidData: IPaids,projectId:string) {
    const formDataHeader = {
      headers: new HttpHeaders({
        'content-type': 'multipart/form-data',
      }),
    };
    const { paidDate, paid, checkImg, notes, method } = paidData;
    const paidsData = new FormData();
    paidsData.append('paidDate', paidDate.toString());
    paidsData.append('projectId', projectId);
    paidsData.append('paid', paid.toString());
    if (checkImg) paidsData.append('checkImg', checkImg);
    paidsData.append('method', method);
    paidsData.append('notes', notes);

    return this.httpClient.post(`${BaseURL}/projects/paids`, paidsData);
  }

  updatePaid(paidData: IPaids,paidId:string) {
    const { paidDate, paid,projectId, checkImg, notes, method } = paidData;
    const paidsData = new FormData();
    paidsData.append('paidDate', paidDate.toString());
    paidsData.append('projectId', projectId.toString());
    paidsData.append('paid', paid.toString());
    if (checkImg) paidsData.append('checkImg', checkImg);
    paidsData.append('method', method);
    paidsData.append('notes', notes);
    return this.httpClient.put(`${BaseURL}/projects/paid/${paidId}`, paidsData);
  }

  deletePaid(paidId:number){
    return this.httpClient.delete(`${BaseURL}/projects/paidById/${paidId}`);
  }


  updateProject(data: IProject, projectId: number) {
    const postData = new FormData();
    postData.append('projectName', data.projectName);
    postData.append('clientFullName', data.clientFullName);
    postData.append('clientPhone', data.clientPhone);
    postData.append('location', data.location);
    postData.append('createdAt', data.createdAt.toString());
    postData.append('agreement', data.agreement);
    return this.httpClient.put(`${BaseURL}/projects/${projectId}`, postData);
  }

  deleteProject(projectId: number) {
    return this.httpClient.delete(`${BaseURL}/projects/${projectId}`);
  }
}

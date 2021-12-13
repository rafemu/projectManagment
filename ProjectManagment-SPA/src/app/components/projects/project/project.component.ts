import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProject } from 'src/app/_interfaces/project.interface';
import { IRecord } from 'src/app/_interfaces/record.interface';
import { ProjectsService } from 'src/app/_services/projects.service';
import { RecordsService } from 'src/app/_services/records.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  private subscribtionProject!: Subscription;
  private subscribtionRecords!: Subscription;
  private projectId!: string;
  public project?: IProject;
  public records: IRecord[] = [];
  public projectPiads: Array<any> = [];
  constructor(
    private recordsService: RecordsService,
    private projectService: ProjectsService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.projectId = params.projectId;
      this.getProjectById(this.projectId);
      this.getProjectPaids(this.projectId);
    });
    this.subscribtionProject = this.projectService.projectById$
      .pipe(untilDestroyed(this))
      .subscribe((project) => {
        this.project = project.project;
      });
    this.subscribtionRecords = this.recordsService.recordsByProject$
      .pipe(untilDestroyed(this))
      .subscribe((record) => {
        this.records = record.records;
      });
  }

  getProjectById(id: string) {
    this.projectService.getProjectById(id);
    this.recordsService.getAllRecordByProject(100, 1, id);
  }

  async getProjectPaids(id: string) {
    this.projectPiads = await this.projectService.getProjectPaids(id);
  }

  AddPaids(event: any) {
    this.projectService.addProjectPaids(event,this.projectId).subscribe((result:any) => {
      if (result) return this.getProjectPaids(this.projectId);
    });
  }

  UpdatePaids(event:any){
const {data , id} = event
    this.projectService.updatePaid(data,id).subscribe((result) => {
      if (result) return this.getProjectPaids(this.projectId);
    });
  }

  deletePaids(event:any){
    this.projectService.deletePaid(event).subscribe((result) => {
      if (result) return this.getProjectPaids(this.projectId);
    });
  }

  ngOnDestroy(): void {
    if (this.subscribtionRecords) this.subscribtionRecords.unsubscribe();
    if (this.subscribtionProject) this.subscribtionProject.unsubscribe();
  }
}

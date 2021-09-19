import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IProject } from 'src/app/_interfaces/project.interface';
import { ProjectsService } from 'src/app/_services/projects.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsActionsComponent } from './projects-actions/projects-actions.component';
import { BaseURL } from './../../_services';
import { ImageViewComponent } from './image-view/image-view.component';
import { Subscription } from 'rxjs';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { filter } from 'rxjs/operators';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @ViewChild(SelectAutocompleteComponent)
  multiSelect!: SelectAutocompleteComponent;

  projects: IProject[] = [];
  projectPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50];
  totalProjects = 0;
  dataSourceProjects: MatTableDataSource<IProject>;
  imgPath = BaseURL;
  public subProject$: Subscription | undefined;

  public projectTitle: string = '';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  displayedColumns = [
    'id',
    'clientFullName',
    'clientPhone',
    'location',
    'quotation',
    'paid',
    'unPaid',
    'haregem',
    'agreement',
    'createdAt',
    'action',
  ];

  constructor(
    private _projectServices: ProjectsService,
    public dialog: MatDialog
  ) {
    this.dataSourceProjects = new MatTableDataSource<IProject>(this.projects);
  }

  ngOnInit() {
    this._projectServices.projects$
      .subscribe((projects) => {
        this.projects = projects.projects;
        this.totalProjects = projects.totalProjects;
        this.dataSourceProjects = new MatTableDataSource<IProject>(
          this.projects
        );
      });
    this._projectServices.getAllProjects(this.projectPerPage, this.currentPage);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.projectPerPage = pageData.pageSize;
    this._projectServices.getAllProjects(this.projectPerPage, this.currentPage);
    this.subProject$ = this._projectServices.projects$.subscribe((projects) => {
      this.projects = projects.projects;
      this.dataSourceProjects = new MatTableDataSource<IProject>(this.projects);
    });
  }
  onToggleDropdown() {
    this.multiSelect.toggleDropdown();
  }

  applyFilter(filterValue: string) {
    this.dataSourceProjects.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(ProjectsActionsComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'undefined') return;
      if (result.event === 'Add') {
        this._projectServices.addProject(result.data).subscribe((result) => {
          if (result) {
            this._projectServices.getAllProjects(
              this.projectPerPage,
              this.currentPage
            );
          }
        });
      } else if (result.event === 'Update') {
        this._projectServices
          .updateProject(result.data, obj.id)
          .subscribe((result) => {
            if (result) {
              this._projectServices.getAllProjects(
                this.projectPerPage,
                this.currentPage
              );
            }
          });
      } else if (result.event === 'Delete') {
        this._projectServices.deleteProject(obj.id).subscribe((result) => {
          if (result) {
            console.log('projectDeleted', result);
            this._projectServices.getAllProjects(
              this.projectPerPage,
              this.currentPage
            );
          }
        });
      }
    });
  }

  openAgreement(obj: any) {
    const dialogRef = this.dialog.open(ImageViewComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  timeAgo(time: Date) {
    return moment(time).fromNow();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.subProject$) this.subProject$.unsubscribe();
  }
}

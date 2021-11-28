import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IProject } from 'src/app/_interfaces/project.interface';
import { BaseURL } from 'src/app/_services';
import { ProjectsService } from 'src/app/_services/projects.service';
import { ImageViewComponent } from '../../image-view/image-view.component';
import { QuotationActionComponent } from './quotation-action/quotation-action.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  @Input() project!: IProject;
  constructor(
    private dialog: MatDialog,
    private projectServices: ProjectsService
  ) {
console.log(this.project)
    
  }

  ngOnInit(): void {}

  openDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(QuotationActionComponent, {
      data: this.project,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'undefined') return;
      if (result.event === 'Add') {
        this.projectServices
          .addProjectQuotation(result.data)
          .subscribe((result) => {
            console.log(result);
          });
      } else if (result.event === 'Update') {
        this.projectServices
          .updateQuotation(result.data)
          .subscribe((result) => {
            console.log(result);
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
  ngOnChanges() {
    console.log(this.project)
    if (this.project.agreement === 'undefined' || null) {
      this.project.agreement =
        '/assets/images/default-placeholder-150x150.png';
    } else {
      this.project.agreement =
        BaseURL + '/' + this.project.agreement.replace('images/', '');

    }
  }
}

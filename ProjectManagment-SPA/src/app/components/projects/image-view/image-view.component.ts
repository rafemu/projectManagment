import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProject } from 'src/app/_interfaces/project.interface';
import { BaseURL } from 'src/app/_services';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {
  local_data:any;
  imgPath = BaseURL;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ImageViewComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IProject
  ) {
    this.local_data = { ...data };
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}

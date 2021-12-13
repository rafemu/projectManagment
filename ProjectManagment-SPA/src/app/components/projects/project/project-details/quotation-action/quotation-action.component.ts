import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseURL } from 'src/app/_services';

@Component({
  selector: 'app-quotation-action',
  templateUrl: './quotation-action.component.html',
  styleUrls: ['./quotation-action.component.scss']
})
export class QuotationActionComponent implements OnInit {
  public action!: string;
  public form: any;
  public projectdData: any;
  public imagePath: any;
  public fileError: string = '';
  private selectedImg:any;
  constructor(private dialogRef: MatDialogRef<QuotationActionComponent>,private formBuilder: FormBuilder
    ,@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.projectdData = data
      if (this.projectdData.agreement === null || this.action == 'Add') {
        this.projectdData.agreement =
          '/assets/images/default-placeholder-150x150.png';
      } else {
        this.projectdData.agreement =
          BaseURL + '/' + this.projectdData.agreement.replace('images/', '');

      }
     }

  ngOnInit(): void {
    this.action = this.projectdData.action;
    if(this.projectdData.action === 'Update' || 'Add') this.initForm();
    if (this.projectdData.action === 'Update') this.filForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      quotation: new FormControl('', {
        validators: [Validators.required],
      }),
      notes: new FormControl(''),
    });
  }

  filForm() {
    this.form.setValue({
      quotation: this.projectdData['quotation'],
      notes: this.projectdData['quotationNotes'],
    });
  }

  doAction() {
    const { quotation, notes } = this.form.value;
    const quotationValues: any = {
      projectId: this.projectdData.id,
      quotation: quotation,
      notes: notes,
      imagePath: this.selectedImg,
    };
    if (this.form.invalids) return;
    this.dialogRef.close({ event: this.action, data: quotationValues });
  }

//display image of input file
onSelectFile(event: any) {
  // called each time file input changes
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = () => {
      if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif|pdf)$/i)) {
        // this.alertify.warning('image should be JPG|JPEG|PNG|GIF');
        this.fileError = 'image should be JPG|JPEG|PNG|GIF|pdf';
      } else {
        if (event.target.files[0].size > 1.5 * 1024 * 1024) {
          // this.alertify.warning('image should not be more than 1.5mb');
          this.fileError = 'image should not be more than 1.5mb';

        } else {
          this.selectedImg = event.target.files[0];
          this.projectdData.agreement = reader.result;
        }
      }
    };
  }
}

closeDialog() {
  this.dialogRef.close({ event: 'Cancel' });
}
}

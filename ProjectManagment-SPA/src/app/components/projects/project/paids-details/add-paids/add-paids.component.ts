import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { IPaids } from 'src/app/_interfaces/paids.interface';
import { BaseURL } from 'src/app/_services';

@Component({
  selector: 'app-add-paids',
  templateUrl: './add-paids.component.html',
  styleUrls: ['./add-paids.component.scss'],
})
export class AddPaidsComponent implements OnInit {
  public action!: string;
  public form: any;
  public paidDate!: Date;
  public fileError: string = '';
  public imagePath: any;
  public local_data: any;
  public isShow: boolean = false;
  public methods?: Array<any> = [
    { value: 'cash', viewValue: 'Cash' },
    { value: 'check', viewValue: 'Check' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddPaidsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paidDate = new Date();
    this.local_data = { ...data };
    console.log(this.local_data);
    this.action = this.local_data.action;
    if (this.local_data.agreement === undefined) {
      console.log(this.local_data.agreement);
      this.local_data.agreement =
        '/assets/images/default-placeholder-150x150.png';
    } else {
      this.local_data.agreement = BaseURL + '/' + this.local_data.agreement;
      console.log(this.local_data.agreement);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  doAction() {
    const { paiddate, projectId, paid, method, notes } = this.form.value;
    const paidValues: IPaids = {
      paidDate: paiddate.toISOString().split('T')[0], //.format('YYYY-MM-DD'),
      projectId: projectId,
      paid: paid,
      method: method,
      notes: notes,
      checkImg: this.imagePath,
      createdAt: moment().format('YYYY-MM-DD'),
    };
    if (this.form.invalids) return;
    this.dialogRef.close({ event: this.action, data: paidValues });
  }
  initForm() {
    this.form = this.formBuilder.group({
      paiddate: new FormControl(this.paidDate, {
        validators: [Validators.required],
      }),
      paid: new FormControl('', { validators: [Validators.required] }),
      method: new FormControl('cash', { validators: [Validators.required] }),
      notes: new FormControl(''),
    });
  }

  selectMethod(event: any) {
    event.value == 'check' ? (this.isShow = true) : (this.isShow = false);
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
          } else {
            this.imagePath = event.target.files[0];
            this.local_data.agreement = reader.result;
          }
        }
      };
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

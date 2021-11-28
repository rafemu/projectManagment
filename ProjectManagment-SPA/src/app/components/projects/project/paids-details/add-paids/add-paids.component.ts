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
  public recordData: any;
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
    this.recordData = { ...data };
    this.action = this.recordData.action;
    if (this.recordData.checksImgPath === null || this.action == 'Add') {
      this.recordData.checksImgPath =
        '/assets/images/default-placeholder-150x150.png';
    } else {
      this.recordData.checksImgPath =
        BaseURL + '/' + this.recordData.checksImgPath.replace('images/', '');
    }
  }

  ngOnInit(): void {
   if(this.recordData.action === 'Update' || 'Add') this.initForm();
    if (this.recordData.action === 'Update') this.filForm();
  }

  doAction() {
    const { paiddate, paid, method, notes } = this.form.value;
    const paidValues: IPaids = {
      paidDate: moment(paiddate).format('YYYY-MM-DD HH:mm:ss'),
      projectId: this.recordData.projectId,
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

  filForm() {

    this.form.setValue({
      paiddate: this.recordData['paidDate'],
      paid: this.recordData['paid'],
      method: this.recordData['method'],
      notes: this.recordData['notes'],
    });
    if(this.recordData.method == 'check') this.isShow = true
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
            this.recordData.checksImgPath = reader.result;
          }
        }
      };
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

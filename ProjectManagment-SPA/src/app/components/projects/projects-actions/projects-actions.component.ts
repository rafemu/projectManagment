import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProject } from 'src/app/_interfaces/project.interface';
import { BaseURL } from 'src/app/_services';
import * as moment from 'moment';

@Component({
  selector: 'app-projects-actions',
  templateUrl: './projects-actions.component.html',
  styleUrls: ['./projects-actions.component.scss'],
})
export class ProjectsActionsComponent implements OnInit {
  action: string;
  local_data: any;
  imagePath: any;
  form: any;
  fileError:string= ''

  constructor(
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ProjectsActionsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IProject
  ) {
    this.local_data = { ...data };
    console.log(this.local_data)
    this.action = this.local_data.action;
    if (this.local_data.agreement === undefined) {
      console.log(this.local_data.agreement)
       this.local_data.agreement =
      '/assets/images/default-placeholder-150x150.png';
    }else{
      this.local_data.agreement = BaseURL+'/'+this.local_data.agreement
      console.log(this.local_data.agreement )
    }
  }

  ngOnInit(): void {
    this.initForm();
    console.log(this.local_data)
    if(this.local_data.action === 'Update'){
      this.filForm()
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      projectName: new FormControl('', { validators: [Validators.required] }),
      clientFullName: new FormControl('', {
        validators: [Validators.required],
      }),
      clientPhone: new FormControl('', { validators: [Validators.required] }),
      location: new FormControl('', { validators: [Validators.required] }),
      quotation: new FormControl('', { validators: [Validators.required] }),
      paid: new FormControl('', { validators: [Validators.required] }),
      createdAt: new FormControl('', { validators: [Validators.required] }),
    });
  }

  filForm(){
    this.form.setValue({
      projectName: this.local_data['projectName'],
      clientFullName: this.local_data['clientFullName'],
      clientPhone: this.local_data['clientPhone'],
      location: this.local_data['location'],
      quotation: this.local_data['quotation'],
      paid: this.local_data['paid'],
      createdAt: this.local_data['createdAt'],
    });
    console.log(this.local_data)
  }

  doAction() {
    const {projectName,clientFullName,clientPhone,location,quotation,paid,createdAt} =this.form.value
    const  project:IProject={
          projectName: projectName,
          clientFullName: clientFullName,
          clientPhone: clientPhone,
          location: location,
          quotation: quotation,
          paid: paid,
          // haregem:this.form.haregem,
          createdAt: moment(this.form.value.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          agreement:this.imagePath
    }
    
    if (this.form.invalids) return;
    this.dialogRef.close({ event: this.action, data: project });
  }

 

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

   //display image of input file
   onSelectFile(event:any) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => {
        if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif|pdf)$/i)) {
          // this.alertify.warning('image should be JPG|JPEG|PNG|GIF');
          this.fileError = 'image should be JPG|JPEG|PNG|GIF|pdf'
        }
        else {
          if (event.target.files[0].size > 1.5 * 1024 * 1024) {
            // this.alertify.warning('image should not be more than 1.5mb');
          } else {
            this.imagePath = event.target.files[0];
            this.local_data.agreement = reader.result;
          }
        }
      }
    }
  }




}

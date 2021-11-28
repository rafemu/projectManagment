import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MyserviceService } from './../myservice.service';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { IUser } from '../_interfaces/auth.interface';
import { TokenService } from '../_services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MyserviceService]
})
export class LoginComponent implements OnInit {
  msg = '';
  public loginForm: any;
  constructor(private _authService:AuthService, private _tokenService:TokenService,private formBuilder: FormBuilder, private router: Router) {

  this.initForm();
   }

  

  ngOnInit(): void {
    const token = this._tokenService.getToken();
    if (token) {
      this.router.navigate(['/projects']);
    }
  }
  initForm() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }


  login() {
    this._authService.login(this.loginForm.value).subscribe((respons) => {
      console.log(respons);
      this.msg = respons.message;
      this.router.navigate(['/projects'])
      // this.handleUserResponse(respons)
    });
  }

  handleUserResponse(user: any) {
    const { userData, accessToken } = user;
    if (accessToken) {
      this._tokenService.deleteToken();
      this._tokenService.setToken(accessToken);
      this._authService.setAuth(userData);
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs/operators';
import { BaseURL } from '.';
import { IUser } from '../_interfaces/auth.interface';
import { TokenService } from './token.service';

const auth_PATTH = '/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userSubject = new BehaviorSubject<IUser>({});
  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService
  ) {
    const user = this.tokenService.getPayload();
    if (user) {
      this.userSubject.next(user);
    }
  }

  userValue(): IUser {
    return this.userSubject.value;
  }

  setAuth(user: IUser) {
    // Save JWT sent from server in localstorage
    this.tokenService.setToken(user.accessToken);
    // Set current user data into observable
    this.userSubject.next(user);
    // Set isAuthenticated to true
    // this.isAuthenticatedSubject.next(true);
  }

  login(userDetails: IUser) {
    return this.httpClient.post<any>(
      `${BaseURL}${auth_PATTH}/login`,
      userDetails
    )
    .pipe(
      tap((user:any) => {
        const { userData, accessToken } = user;
        // localStorage.setItem('pmr_token', JSON.stringify(userData));
        if (accessToken) {
          this.tokenService.deleteToken();
          this.tokenService.setToken(accessToken);
          this.userSubject.next(userData);
           return userData;
        }
      })
    );
  }

  // setCurrentUser(user: IUser) {
  //   this.userSubject.next(user);
  // }
  purgeAuth() {
    // Remove JWT from localstorage
    this.tokenService.deleteToken();
    // Set current user to an empty object
    this.userSubject.next({} as IUser);
    // Set auth status to false
    // this.isAuthenticatedSubject.next(false);
  }

  logOut() {
    this.userSubject.next({});
    this.tokenService.deleteToken();
    localStorage.removeItem('pmr_token');
  }

  register(userDetails: IUser): Promise<Array<any>> {
    return this.httpClient
      .post(`${BaseURL}${auth_PATTH}/register`, userDetails)
      .toPromise() as Promise<Array<any>>;
  }

}

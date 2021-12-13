import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  helper = new JwtHelperService();
  constructor(private tokenService: TokenService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const token = this.tokenService.getToken();

    if (token) {
      if (this.helper.isTokenExpired(token)) {
        this.tokenService.deleteToken();
        this.router.navigateByUrl('/');
      } else {
        req = req.clone({ headers: req.headers.set('x-access-token', token) });
      }
    }
    return next.handle(req);
  }
}

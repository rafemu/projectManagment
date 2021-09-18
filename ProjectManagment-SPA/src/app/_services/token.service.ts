import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private cookieService: CookieService) {}
  setToken(token: any) {
    this.cookieService.set('pmr_token', token);
  }
  getToken() {
    return this.cookieService.get('pmr_token');
  }
  deleteToken() {
    this.cookieService.delete('pmr_token');
  }
  getPayload() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(atob(payload));
    }
    return payload ? payload.data : payload;
  }
}

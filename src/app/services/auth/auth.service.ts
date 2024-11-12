import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUserResponse } from 'src/app/models/auth/authUserResponse';
import { AuthUserRequest } from 'src/app/models/auth/authUserRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  signIn(signRequest: AuthUserRequest): Observable<AuthUserResponse> {
    
    return this.http.post<AuthUserResponse>(`${environment.ApiBase}${environment.signin}`, signRequest);
  }

}

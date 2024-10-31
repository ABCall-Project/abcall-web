import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly http: HttpClient) { }

  getUsersByRole(roleId: string): Observable<User[]> {
    return this.http.get<User[]>(`${environment.ApiUsers}${environment.getUsersByRole}${roleId}`);
  }

}
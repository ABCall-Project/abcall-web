import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { UserList } from 'src/app/models/user/user-list';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly http: HttpClient) { }

  getUsersByRole(roleId: string): Observable<User[]> {
    return this.http.get<User[]>(`${environment.ApiBase}${environment.getUsersByRole}${roleId}`);
  }

  getUsersByRolePaginated(roleId: string, page: number = 1, limit: number = 5): Observable<UserList> {
    return this.http.get<UserList>(`${environment.ApiBase}${environment.getUsersByRole}${roleId}&page=${page}&limit=${limit}`).pipe(
      map(reponse => {
        return reponse;
      }));
  }

}
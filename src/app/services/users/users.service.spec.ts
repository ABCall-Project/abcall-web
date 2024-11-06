import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);

  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return users by role', () => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John',
        last_name: 'Doe',
        phone_number: '1234567890',
        email: 'john.doe@example.com',
        address: '123 Main St',
        birthdate: '1980-01-01',
        role_id: 'Agent'
      },
      {
        id: '2',
        name: 'Jane',
        last_name: 'Smith',
        phone_number: '0987654321',
        email: 'jane.smith@example.com',
        address: '456 Elm St',
        birthdate: '1990-02-02',
        role_id: 'Agent'
      }
    ];
    const roleId = 'some-role-id';
    const url = `${environment.ApiBase}${environment.getUsersByRole}${roleId}`;

    // Llamada al método getUsersByRole
    service.getUsersByRole(roleId).subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should handle error when getUsersByRole fails', () => {
    const roleId = 'some-role-id';
    const url = `${environment.ApiBase}${environment.getUsersByRole}${roleId}`;

    // Llamamos al método getUsersByRole
    service.getUsersByRole(roleId).subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe('Internal Server Error');
      }
    });

    // Simulamos un error HTTP 500
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
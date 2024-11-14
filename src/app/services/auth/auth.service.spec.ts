import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthUserRequest } from 'src/app/models/auth/authUserRequest';
import { AuthUserResponse } from 'src/app/models/auth/authUserResponse';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule para pruebas HTTP
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController); // Mock de las peticiones HTTP
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request to sign in and return AuthUserResponse', () => {
    const mockRequest: AuthUserRequest = { email: 'test@example.com', password: 'password' };
    const mockResponse: AuthUserResponse = {
      id: '1',
      name: 'John',
      last_name: 'Doe',
      phone_number: '1234567890',
      email: 'test@example.com',
      address: '123 Main St',
      birthdate: '1990-01-01',
      role_id: 'admin',
      token: 'fake-jwt-token'
    };

    service.signIn(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.id).toBe('1');
      expect(response.name).toBe('John');
      expect(response.token).toBe('fake-jwt-token');
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.signin}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse); // Simula la respuesta del servidor
  });

  it('should handle error response gracefully', () => {
    const mockRequest: AuthUserRequest = { email: 'test@example.com', password: 'wrongpassword' };

    service.signIn(mockRequest).subscribe({
      next: () => fail('expected an error, not success'),
      error: (error) => {
        expect(error.status).toBe(401); // Status code de error esperado (dependiendo de tu API)
      }
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.signin}`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' }); // Simula una respuesta de error
  });
});

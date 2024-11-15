import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;
  let router: Router;

  const mockToken = 'fake-jwt-token';
  const mockRequest = { url: 'https://api.example.com/data', method: 'GET' };

  beforeEach(() => {
    // Usamos jasmine.createSpy para crear un espía del método getToken
    const authServiceMock = {
      getToken: jasmine.createSpy('getToken').and.returnValue(mockToken)  // Creamos el espía y configuramos su valor
    };
    
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: AuthService, useValue: authServiceMock }, // Usamos el mock del servicio
        { provide: Router, useValue: routerMock },
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should add Authorization header with token if token is present', () => {
    // Llamar a un servicio HTTP
    httpClient.get(mockRequest.url).subscribe();

    // Verificar que el token se haya agregado a las cabeceras de la solicitud
    const req = httpMock.expectOne(mockRequest.url);
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    // Asegúrate de que la solicitud continúe
    req.flush({ data: 'response' });
  });

  

  
});

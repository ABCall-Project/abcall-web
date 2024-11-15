import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthUserRequest } from 'src/app/models/auth/authUserRequest';
import { AuthUserResponse } from 'src/app/models/auth/authUserResponse';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockEncryptionKey = environment.key;
  const testUserData = {
    userId: 'test-id',
    name: 'Test User',
    customerId: 'test-customer-id',
    userName: 'test@example.com',
    customerName: 'Test Customer',
    token: 'fake-jwt-token'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule para pruebas HTTP
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController); // Mock de las peticiones HTTP
  });

  afterEach(() => {
    // Verifica que no haya peticiones HTTP pendientes
    httpMock.verify();
    sessionStorage.clear();  // Limpiar sessionStorage después de cada test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Prueba para signIn y la petición HTTP
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
      token: 'fake-jwt-token',
      customer_id:'1'
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

  // Prueba para manejar una respuesta de error
  it('should handle error response gracefully', () => {
    const mockRequest: AuthUserRequest = { email: 'test@example.com', password: 'wrongpassword' };

    service.signIn(mockRequest).subscribe({
      next: () => fail('expected an error, not success'),
      error: (error) => {
        expect(error.status).toBe(401); // Status code de error esperado
      }
    });

    const req = httpMock.expectOne(`${environment.ApiBase}${environment.signin}`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' }); // Simula una respuesta de error
  });

  // Test para el método getToken()
  describe('getToken', () => {
    it('should return the token when valid encrypted data is stored in sessionStorage', () => {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(testUserData), mockEncryptionKey).toString();
      sessionStorage.setItem('ref', encryptedData);

      const token = service.getToken();

      expect(token).toBe(testUserData.token);  // Verifica que el token retornado sea el esperado
    });

    it('should return null when there is no data in sessionStorage', () => {
      sessionStorage.removeItem('ref');  // Asegúrate de que no haya datos en sessionStorage

      const token = service.getToken();

      expect(token).toBeNull();  // Verifica que el método retorne null
    });

    it('should return null when data in sessionStorage is invalid or corrupted', () => {
      const invalidEncryptedData = 'invalidEncryptedData';
      sessionStorage.setItem('ref', invalidEncryptedData);  // Establece datos corruptos en sessionStorage
    
      const token = service.getToken();
    
      expect(token).toBeNull();  // El token debe ser null ya que los datos no se pueden desencriptar
    });

    it('should return null if decryption fails due to incorrect encryption key', () => {
      const wrongEncryptionKey = 'wrong-encryption-key';
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(testUserData), mockEncryptionKey).toString();
      sessionStorage.setItem('ref', encryptedData);  // Guarda los datos cifrados

      // Mock de CryptoJS con una clave incorrecta
      const spy = spyOn(CryptoJS.AES, 'decrypt').and.callFake(() => {
        throw new Error('Decryption failed');
      });

      const token = service.getToken();

      expect(token).toBeNull();  // Debe retornar null en caso de error en la desencriptación
      expect(spy).toHaveBeenCalled();  // Verifica que el método de desencriptación fue llamado
    });
  });

  // Test para el método isAuthenticated()
  describe('isAuthenticated', () => {
    it('should return true if valid encrypted data exists in sessionStorage', () => {
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(testUserData), mockEncryptionKey).toString();
      sessionStorage.setItem('ref', encryptedData);

      const isAuthenticated = service.isAuthenticated();

      expect(isAuthenticated).toBeTrue();  // Verifica que la autenticación es exitosa
    });

    it('should return false if sessionStorage is empty', () => {
      sessionStorage.removeItem('ref');  // Elimina cualquier dato de sessionStorage

      const isAuthenticated = service.isAuthenticated();

      expect(isAuthenticated).toBeFalse();  // Verifica que el método retorne false
    });

    it('should return false if the decrypted data does not contain a userId', () => {
      const invalidData = { invalid: true };
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(invalidData), mockEncryptionKey).toString();
      sessionStorage.setItem('ref', encryptedData);

      const isAuthenticated = service.isAuthenticated();

      expect(isAuthenticated).toBeFalse();  // Verifica que el método retorne false
    });

    it('should return false if decryption fails', () => {
      const invalidEncryptedData = 'invalidEncryptedData';
      sessionStorage.setItem('ref', invalidEncryptedData);  // Datos inválidos en sessionStorage

      const isAuthenticated = service.isAuthenticated();

      expect(isAuthenticated).toBeFalse();  // Verifica que el método retorne false
    });
  });
});

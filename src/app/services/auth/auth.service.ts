import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUserResponse } from 'src/app/models/auth/authUserResponse';
import { AuthUserRequest } from 'src/app/models/auth/authUserRequest';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private encryptionKey = environment.key;

  constructor(private readonly http: HttpClient) { }

  signIn(signRequest: AuthUserRequest): Observable<AuthUserResponse> {
    
    return this.http.post<AuthUserResponse>(`${environment.ApiBase}${environment.signin}`, signRequest);
  }

  isAuthenticated(): boolean {
    const encryptedData = sessionStorage.getItem('ref'); 

    if (!encryptedData) {
      return false;  
    }

    try {

      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (decryptedData && decryptedData.userId) {
        console.log('retorno verdadero');
        return true;  
      } else {
        console.log('retorno falso');
        return false;  
      }
    } catch (error) {
      console.log('retorno falso por error '+ error);
      return false;
    }
  }

  getToken(): string | null {
    const encryptionKey = environment.key;
    console.log(encryptionKey);
    const encryptedData = sessionStorage.getItem('ref');
  
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  
        console.log('Datos desencriptados:', decryptedData);
  
        console.log('Customer ID:', decryptedData.customerId);
        console.log('Token:', decryptedData.token);
  
        return decryptedData.token;
      } catch (error) {
        console.log('Error al desencriptar o analizar los datos:', error);
        return null; // Si ocurre un error, retornamos null
      }
    }
    return null;
  }
  


}

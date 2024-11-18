import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    let encrypted_password=this.encryptData(signRequest.password,environment.PHRASE_KEY);
    signRequest.password=encrypted_password;
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
      return !!(decryptedData && decryptedData.userId);
    } catch (error) {
      console.error('Error during authentication check:', error);
      return false;
    }
  }

  getToken(): string | null {
    const encryptedData = sessionStorage.getItem('ref');
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData.token || null;
      } catch (error) {
        console.error('Error decrypting token:', error);
        return null;
      }
    }
    return null;
  }

  deriveKeyFromPassphrase(passphrase: string): string {
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    return CryptoJS.PBKDF2(passphrase, salt, {
      keySize: 256 / 32,
      iterations: 100000
    }).toString();
  }

  encryptData(data: string, passphrase: string): string {
    const hash = CryptoJS.HmacSHA256(data, passphrase).toString(CryptoJS.enc.Base64);
    return hash;
  }
}

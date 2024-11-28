import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUserResponse } from 'src/app/models/auth/authUserResponse';
import { AuthUserRequest } from 'src/app/models/auth/authUserRequest';
import { SignUpRequest } from 'src/app/models/auth/signUpRequest';
import { SignUpResponse } from 'src/app/models/auth/signUpResponse';
import {
  encryptData,
  decryptData,
  encryptDataWithPhrase,
} from 'src/utils/encryption';
import Role from 'src/app/models/Role';
import Plan from 'src/app/models/Plan';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private encryptionKey = environment.key;

  constructor(private readonly http: HttpClient) {}

  signIn(signRequest: AuthUserRequest): Observable<AuthUserResponse> {
    let encrypted_password = encryptData(
      signRequest.password,
      environment.PHRASE_KEY
    );
    signRequest.password = encrypted_password;
    return this.http.post<AuthUserResponse>(
      `${environment.ApiBase}${environment.signin}`,
      signRequest
    );
  }

  isAuthenticated(): boolean {
    const encryptedData = sessionStorage.getItem('ref');
    if (!encryptedData) {
      return false;
    }
    try {
      const decryptedData = JSON.parse(
        decryptData(encryptedData, this.encryptionKey)
      );
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
        const decryptedData = JSON.parse(
          decryptData(encryptedData, this.encryptionKey)
        );
        return decryptedData.token || null;
      } catch (error) {
        console.error('Error decrypting token:', error);
        return null;
      }
    }
    return null;
  }

  signUp(customerUser: SignUpRequest): Observable<SignUpResponse> {
    const request = {
      name: customerUser.name,
      last_name: customerUser.lastname,
      password: encryptDataWithPhrase(
        customerUser.password,
        environment.PHRASE_KEY
      ),
      phone_number: customerUser.phoneNumber,
      email: customerUser.email,
      address: customerUser.address,
      birthdate: customerUser.birthdate,
      role_id: Role.COMPANY_ADMIN,
      document: customerUser.document,
      plan_id: customerUser.planId,
    };
    return this.http.post<SignUpResponse>(
      `${environment.ApiBase}/auth/signup`,
      request
    );
  }
}

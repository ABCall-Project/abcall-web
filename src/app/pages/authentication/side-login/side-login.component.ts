import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthUserRequest } from 'src/app/models/auth/authUserRequest';
import { AuthUserResponse } from 'src/app/models/auth/authUserResponse';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule,NgForOf],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.scss']
})
export class AppSideLoginComponent {

  public selectedLanguage: any = {
    language: 'Español',
    code: 'es',
    type: 'ES',
    icon: '/assets/images/flag/spanish.svg',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/english.svg',
    },
    {
      language: 'Español',
      code: 'es',
      icon: '/assets/images/flag/spanish.svg',
    }
  ];

  options = this.settings.getOptions();
  private snackBarRef: MatSnackBarRef<any>;

  constructor(private settings: CoreService, private router: Router,private authService :AuthService,private snackBar: MatSnackBar) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const authRequest: AuthUserRequest = {
        email: this.form.get('uname')?.value || '', 
        password: this.form.get('password')?.value || '', 
      };
      this.authService.signIn(authRequest).subscribe(response => {
        console.log('la respuesta');
        console.log(response)
        this.router.navigate(['/starter']);
      },
      error => {
        if (error.status === 401) {
          this.snackBarRef = this.snackBar.open('Contraseña incorrecta', 'Cerrar', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
          this.closeSnackbarOnClickOutside();
        } else {
          console.error('Otro error:', error);
        }
      });

    } else {
      console.log('Formulario no válido');
    }

    
    
  }

  changeLanguage(lang: any): void {
    //this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  private closeSnackbarOnClickOutside() {
    // Escuchar el clic en el documento para cerrar el snackbar
    const listener = () => {
      this.snackBarRef.dismiss();
      document.removeEventListener('click', listener);
    };
    document.addEventListener('click', listener);
  }


}


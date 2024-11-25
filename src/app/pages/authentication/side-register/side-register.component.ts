import { Component, ViewEncapsulation } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';
import type { SignUpRequest } from 'src/app/models/auth/signUpRequest';
import { AuthService  } from 'src/app/services/auth/auth.service'
import { ModalMessageComponent } from 'src/app/pages/app/modal-message/modal-message.component';
@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
  styleUrls: ['./side-register.component.scss']
})
export class AppSideRegisterComponent {

  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router) { }

  form = new FormGroup({
    nombres: new FormControl('', [Validators.required, Validators.minLength(6)]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(6)]),
    nit: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    lastname: new FormControl('', []),
  });

  get f() {
    return this.form.controls;
  }

  openModal(title: string, message: string, buttonCloseTitle: string) {
    this.dialog.open(ModalMessageComponent, {
      data: {
        title,
        message,
        buttonCloseTitle
      },
    });
  }

  submit() {
    const signUpRequest: SignUpRequest = {
      name: this.form.value.nombres ? this.form.value.nombres : '',
      phoneNumber: this.form.value.telefono ? this.form.value.telefono : '',
      email: this.form.value.email ? this.form.value.email : '',
      password: this.form.value.password ? this.form.value.password : '',
      document: this.form.value.nit,
      lastname: this.form.value.lastname,
    };

    this.authService.signUp(signUpRequest).subscribe((response) => {
      if (response && response.message) {
        this.openModal('Notificación', 'Usuario registrado correctamente', 'Aceptar');
        this.router.navigate(['/side-login']);
      }
      else {
        this.openModal('Error', 'Error al registrar usuario', 'Aceptar');
      }
    });

  }
}

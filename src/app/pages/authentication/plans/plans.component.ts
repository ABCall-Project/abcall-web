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
  selector: 'app-plans',
  standalone: true,
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent {

  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router) { }

}

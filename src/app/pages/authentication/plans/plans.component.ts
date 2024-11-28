import { Component, ViewEncapsulation } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButton } from '@angular/material/button';
import type { SignUpRequest } from 'src/app/models/auth/signUpRequest';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ModalMessageComponent } from 'src/app/pages/app/modal-message/modal-message.component';
import Plan from 'src/app/models/Plan';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent {
  private planId: string = Plan.ENTREPRENEUR;
  version: string = environment.VERSION;
  constructor(private authService: AuthService, private router: Router) {}

  private navigate() {
    this.router.navigate(['/sign-up', this.planId]);
  }

  public onEntrepreneurClick(): void {
    this.planId = Plan.ENTREPRENEUR;
    this.navigate();

  }

  public onBusinessClick(): void {
    this.planId = Plan.BUSINESS;
    this.navigate();
  }

  public onBusinessPlusClick(): void {
    this.planId = Plan.BUSINESS_PLUS;
    this.navigate();
  }
}

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

  constructor(private settings: CoreService, private router: Router) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    this.router.navigate(['/starter']);
  }

  changeLanguage(lang: any): void {
    //this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }
}

import { NgIf } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CoreService } from 'src/app/services/core.service';
import { IssuesService } from 'src/app/services/issues.service';
import { ModalMessageComponent } from '../../app/modal-message/modal-message.component';
import { ModalIssueDetailComponent } from './modal-issue-detail/modal-issue-detail.component';

@Component({
  selector: 'app-get-issue',
  templateUrl: './get-issue.component.html',
  styleUrls: ['./get-issue.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule],
})
export class GetIssueComponent {
  public options = this.settings.getOptions();
  public form: FormGroup;

  constructor(private dialog: MatDialog, private settings: CoreService, private issuesService: IssuesService) {
    this.form = new FormGroup({
      issueId: new FormControl('', [Validators.required]),
    });
    this.options = this.settings.getOptions();
  }

  openModalCustomErrorValidate(message: string) {
    this.dialog.open(ModalMessageComponent, {
      data: {
        title: 'Incidente',
        message,
        buttonCloseTitle: 'Aceptar'
      },
    });
  }

  submit() {
    if (this.form.valid) {
      this.issuesService.getIssueById(this.form.get('issueId')?.value).subscribe(response => {
        this.dialog.open(ModalIssueDetailComponent, {
          width: '80%',
          data: {
            issue: response,
          },
        });
      }, error => {
        if (error.status === 404) {
          this.openModalCustomErrorValidate('Incidente no encontrado');
        } else {
          this.openModalCustomErrorValidate('Ocurrio un error inesperado');
        }
        console.error('Error submitting data', error);
      });

    } else {
      this.openModalCustomErrorValidate('Favor ingresar un numero de radicado!');

    }
  }
}

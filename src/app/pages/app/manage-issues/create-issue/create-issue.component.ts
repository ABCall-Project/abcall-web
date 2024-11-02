import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { IInvoice } from '../../../../models/invoice';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ModalMessageComponent } from '../../modal-message/modal-message.component';
import { ModalIssueAiAnswerComponent } from '../modal-issue-ai-answer/modal-issue-ai-answer.component';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { Customer } from 'src/app/models/customer/customer';
import { Channel } from 'src/app/models/channel/channel';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/user/user';
import { IssuesService } from 'src/app/services/issues.service';

export const ROLES = {
  Agent: 'e4f78f9c-4e24-4588-9315-92dd601c8caa'
}import { ModalPredictiveAnswerComponent } from '../modal-predictive-answer/modal-predictive-answer.component';

@Component({
  selector: 'app-create-issue',
  standalone: true,
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    RouterModule,
    TablerIconsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})

export class CreateIssueComponent implements OnInit {

  public customers: Customer[] = [];
  public channels: Channel[] = [];
  public agents: User[] = [];
  public fileName: string = '';
  public file: File

  constructor(public dialog: MatDialog, public customersService: CustomersService, public usersService: UsersService, public issuesService: IssuesService, private router: Router) { }

  form: FormGroup = new FormGroup({
    subject: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(300)]),
    agentId: new FormControl('', [Validators.required]),
    customerId: new FormControl('', [Validators.required]),
    channelId: new FormControl('', [Validators.required]),
    file: new FormControl(null),
  });


  ngOnInit(): void {
    this.loadCustomers();
    this.loadUsers(ROLES.Agent)
  }

  openModalIAAnswer() {
    const valorDescripcion = this.form.get('description')?.value;
    console.log(valorDescripcion)

    if (valorDescripcion && valorDescripcion.trim() !== '') {
      this.dialog.open(ModalIssueAiAnswerComponent, {
        width: '80%',
        data: {
          question: valorDescripcion,
        },
      });
    } else {
      this.openModalErrorDescriptionEmpty();
    }
  }

  openModalErrorDescriptionEmpty() {
    this.dialog.open(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Debe ingresar una descripción para continuar',
        buttonCloseTitle: 'Aceptar'
      },
    });
  }

  openModalErrorValidate() {
    this.dialog.open(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Favor ingresar todos los campos',
        buttonCloseTitle: 'Aceptar'
      },
    });
  }


  openPredictiveAnswer() {
      this.dialog.open(ModalPredictiveAnswerComponent, {
        width: '70%',
        data: {
          context: '',
        },
      });    
  }

  loadCustomers(): void {
    this.customersService.getCustomers().subscribe((data: Customer[]) => {
      this.customers = data;
    }, error => {
      console.error('Error al cargar los clientes', error);
    });
  }

  loadChannels(planId: string): void {
    this.customersService.getChannelByPlan(planId).subscribe((data: Channel[]) => {
      this.channels = data;
    }, error => {
      console.error('Error al cargar los Canales', error);
    });
  }


  loadUsers(roleId: string): void {
    this.usersService.getUsersByRole(roleId).subscribe((data: User[]) => {
      this.agents = data;
    }, error => {
      console.error('Error al cargar los Asesores', error);
    });
  }

  onCustomerSelect(customerId: string): void {
    this.loadChannels(customerId);
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.form.get('file')?.setValue(input.files[0]);
      this.file = file
    }
  }

  onCancel() {
    this.router.navigate(['/starter']);
  }

  submit() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('auth_user_id', this.form.get('customerId')?.value);
      formData.append('description', this.form.get('description')?.value);
      formData.append('subject', this.form.get('subject')?.value);
      formData.append('auth_user_agent_id', this.form.get('agentId')?.value);
      formData.append('file', this.file);

      this.issuesService.createIssue(formData).subscribe(response => {
        this.dialog.open(ModalMessageComponent, {
          data: {
            title: 'Incidentes',
            message: response.message,
            buttonCloseTitle: 'Aceptar'
          },
        });
        console.log('Data submitted successfully', response);
      }, error => {
        this.dialog.open(ModalMessageComponent, {
          data: {
            title: 'Incidentes',
            message: 'Ocurrio un error inesperado',
            buttonCloseTitle: 'Aceptar'
          },
        });
        console.error('Error submitting data', error);
      });


    } else {
      console.error('Form is invalid');
      this.openModalErrorValidate();
    }
  }
}

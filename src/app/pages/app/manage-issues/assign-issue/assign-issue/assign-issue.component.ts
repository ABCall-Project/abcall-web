import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Customer } from 'src/app/models/customer/customer';
import { Issue } from 'src/app/models/issue/issue';
import { User } from 'src/app/models/user/user';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { IssuesService } from 'src/app/services/issues.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ModalMessageComponent } from '../../../modal-message/modal-message.component';

@Component({
  selector: 'app-assign-issue',
  templateUrl: './assign-issue.component.html',
  styleUrls: ['./assign-issue.component.scss'],
  standalone: true,
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
export class AssignIssueComponent {

  public issues: Issue[] = [];
  public agents: User[] = [];
  public customers: Customer[] = [];

  constructor(public dialog: MatDialog, private usersService: UsersService, private issuesService: IssuesService, private router: Router) { }

  form: FormGroup = new FormGroup({
    issueId: new FormControl('', [Validators.required]),
    agentId: new FormControl('', [Validators.required]),
  });


  ngOnInit(): void {
    this.loadIssues();

    this.agents = [
      {
        "id": "e120f5a3-9444-48b6-88b0-26e2a21b1957",
        "name": "DANNA",
        "last_name": "LOPEZ",
        "phone_number": "55555555",
        "email": "danna@yopmail.com",
        "address": "Calle luna",
        "birthdate": "1983-11-19",
        "role_id": "e4f78f9c-4e24-4588-9315-92dd601c8caa"
      }
    ]

  }

  openModalErrorValidate(message: string) {
    this.dialog.open(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message,
        buttonCloseTitle: 'Aceptar'
      },
    });
  }

  openModalErrorUserEmpty() {
    this.dialog.open(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Debe seleccionar un cliente ',
        buttonCloseTitle: 'Aceptar'
      },
    });
  }

  loadIssues(): void {
    this.issuesService.getAll().subscribe((data: Issue[]) => {
      this.loadCustomers()
      this.issues = data.map((issue: Issue) => {
        const customerName: string = this.customers.find((ele) => ele.id === issue.auth_user_id)?.name ?? 'Usuario Chatbot'
        return {
          id: issue.id,
          auth_user_id: `${customerName} - ${issue.id} `,
          status: issue.status,
          subject: issue.subject,
          description: issue.description,
          created_at: issue.created_at,
          closed_at: issue.closed_at,
          channel_plan_id: issue.channel_plan_id
        }
      })
    }, error => {
      console.error('Error al cargar los incidentes', error);
    });
  }

  loadCustomers(): void {
    this.customers = [
      {
        "id": "090b9b2f-c79c-41c1-944b-9d57cca4d582",
        "name": "MIGUEL TOVAR",
        "plan_id": "845eb227-5356-4169-9799-95a97ec5ce33",
        "date_suscription": "2024-10-12T00:00:00+00:00"
      },
      {
        "id": "9c6ace24-775e-4af2-bd95-480c2c540ae9",
        "name": "MIGUEL VEGA",
        "plan_id": "845eb227-5356-4169-9799-95a97ec5ce33",
        "date_suscription": "2024-10-12T00:00:00+00:00"
      }
    ]
  }
  loadUsers(roleId: string): void {
    this.usersService.getUsersByRole(roleId).subscribe((data: User[]) => {
      this.agents = data;
      console.log(data)
    }, error => {
      console.error('Error al cargar los Asesores', error);
    });
  }

  onCancel() {
    this.router.navigate(['/starter']);
  }

  validate() {
    if (!this.form.get('issueId')?.valid) {
      this.openModalErrorValidate('El incidente es obligatorio')
    }
    if (!this.form.get('agentId')?.valid) {
      this.openModalErrorValidate('El gestor es obligatorio')
    }
  }

  submit() {

    this.validate();
    if (this.form.valid) {
      const issueId = this.form.get('issueId')?.value;
      const data = {
        auth_user_agent_id: this.form.get('agentId')?.value
      };

      this.issuesService.assignIssue(issueId, data).subscribe(response => {
        this.dialog.open(ModalMessageComponent, {
          data: {
            title: 'Incidentes',
            message: response.message,
            buttonCloseTitle: 'Aceptar'
          },
        });
        this.loadIssues()
        console.log('Respuesta de la API:', response);
      }, error => {
        console.error('Error al enviar los datos:', error);
      });
    }
  }
}

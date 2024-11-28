import { Component, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { ModalMessageComponent } from '../modal-message/modal-message.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-load-customers',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  templateUrl: './load-customers.component.html',
  styleUrls: ['./load-customers.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoadCustomersComponent {
  selectedFile: File | null = null;
  fileContent: string | null = null;
  fileError: string | null = null;
  confirmationMessage: string | null = null;

  constructor(public dialog: MatDialog, private customersService: CustomersService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.validateFile();
    }
  }

  validateFile(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.fileContent = content;
        if (this.isValidStructure(content)) {
          this.fileError = null;
        } else {
          this.fileError = 'La estructura del archivo es incorrecta. Cada línea debe contener dos valores separados por "|".';
        }
      };
      reader.readAsText(this.selectedFile);
    }
  }

  isValidStructure(content: string): boolean {
    const lines = content.split('\n');
    return lines.every(line => {
      const parts = line.split('|');
      return parts.length === 2;
    });
  }

  onSubmit(): void {
    if (this.selectedFile && !this.fileError && this.fileContent) {
      const planId = '845eb227-5356-4169-9799-95a97ec5ce33';
      const customers = this.fileContent.split('\n').map(line => {
        const [document, name] = line.split('|');
        return { document: document.trim(), name: name.trim() };
      });

      this.customersService.addCustomers(planId, customers).subscribe({
        next: (response) => {
          this.dialog.open(ModalMessageComponent, {
            data: {
              title: 'Mensaje de Confirmación',
              message: 'Los clientes han sido cargados correctamente',
              buttonCloseTitle: 'Aceptar'
            },
          });
          setTimeout(() => {
            this.confirmationMessage = null;
            this.resetForm();
          }, 3000);
        },
        error: (err) => {
          this.dialog.open(ModalMessageComponent, {
            data: {
              title: 'Ha ocurrido un error',
              message: 'Error al cargar los clientes, por favor contacta al administrador',
              buttonCloseTitle: 'Aceptar'
            },
          });          
        }
      });
    } else {
      this.confirmationMessage = null;
    }
  }

  onCancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.fileContent = null;
    this.fileError = null;
    this.confirmationMessage = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
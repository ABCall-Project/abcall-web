import { Component, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CustomersService } from 'src/app/services/customers/customers.service';

@Component({
  selector: 'app-knowledge-base',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss'],
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
export class KnowledgeBaseComponent {
  selectedFile: File | null = null;
  fileContent: string | null = null;
  fileError: string | null = null;
  confirmationMessage: string | null = null;

  constructor(private customersService: CustomersService) {}

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
      const customerId = '845eb227-5356-4169-9799-95a97ec5ce33';
      const entries = this.fileContent.split('\n').map(line => {
        const [topic, content] = line.split('|');
        return { topic: topic.trim(), content: content.trim() };
      });

      this.customersService.loadCustomerDatabaseEntries(customerId, entries).subscribe({
        next: (response) => {
          this.confirmationMessage = 'La base de conocimiento ha sido cargada correctamente';
          setTimeout(() => {
            this.confirmationMessage = null;
            this.resetForm();
          }, 3000);
        },
        error: (err) => {
          this.confirmationMessage = 'Error al cargar la base de conocimiento';
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

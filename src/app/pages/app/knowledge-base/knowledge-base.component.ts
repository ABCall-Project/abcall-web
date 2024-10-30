import { Component, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


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
  fileError: string | null = null;

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
        if (this.isValidStructure(content)) {
          this.fileError = null;
        } else {
          this.fileError = 'La estructura del archivo es incorrecta.';
        }
      };
      reader.readAsText(this.selectedFile);
    }
  }

  isValidStructure(content: string): boolean {
    const lines = content.split('\n');
    return lines.every(line => line.split(',').length === 3);
  }

  onSubmit(): void {
    if (this.selectedFile && !this.fileError) {
      console.log("Archivo cargado correctamente:", this.selectedFile.name);
    }
  }
}


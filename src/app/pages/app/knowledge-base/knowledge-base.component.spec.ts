import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { By } from '@angular/platform-browser';

describe('KnowledgeBaseComponent', () => {
  let component: KnowledgeBaseComponent;
  let fixture: ComponentFixture<KnowledgeBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KnowledgeBaseComponent]  // Cambiado a imports
    });
    fixture = TestBed.createComponent(KnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedFile and call validateFile on file selection', () => {
    spyOn(component, 'validateFile');

    const file = new File(['valid content'], 'test.csv', { type: 'text/csv' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
    expect(component.validateFile).toHaveBeenCalled();
  });

  it('should set fileError for a file with invalid structure', (done) => {
    const file = new File(['row1,field2\nrow2,field2,field3'], 'test.csv', { type: 'text/csv' });
    component.selectedFile = file;
  
    spyOn(component, 'isValidStructure').and.returnValue(false);
  
    const mockFileReader = {
      onload: null as unknown as ((event: ProgressEvent<FileReader>) => void) | null,
      readAsText: function () {
        if (this.onload) {
          this.onload({ target: { result: 'row1,field2\nrow2,field2,field3' } } as ProgressEvent<FileReader>);
        }
      }
    };
  
    spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);
  
    component.validateFile();
  
    fixture.whenStable().then(() => {
      expect(component.fileError).toBe('La estructura del archivo es incorrecta.');
      done();
    });
  });

  it('should return true for valid file structure in isValidStructure', () => {
    const validContent = 'row1,field2,field3\nrow2,field2,field3';
    expect(component.isValidStructure(validContent)).toBeTrue();
  });

  it('should return false for invalid file structure in isValidStructure', () => {
    const invalidContent = 'row1,field2\nrow2,field2,field3';
    expect(component.isValidStructure(invalidContent)).toBeFalse();
  });

  it('should log success message on valid file submit', () => {
    const file = new File(['row1,field2,field3\nrow2,field2,field3'], 'test.csv', { type: 'text/csv' });
    component.selectedFile = file;
    component.fileError = null;

    spyOn(console, 'log');
    component.onSubmit();

    expect(console.log).toHaveBeenCalledWith("Archivo cargado correctamente:", file.name);
  });

  it('should not log success message on submit if fileError is present', () => {
    const file = new File(['row1,field2,field3\nrow2,field2'], 'test.csv', { type: 'text/csv' });
    component.selectedFile = file;
    component.fileError = 'La estructura del archivo es incorrecta.';

    spyOn(console, 'log');
    component.onSubmit();

    expect(console.log).not.toHaveBeenCalled();
  });
  
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { of } from 'rxjs';

describe('KnowledgeBaseComponent', () => {
  let component: KnowledgeBaseComponent;
  let fixture: ComponentFixture<KnowledgeBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KnowledgeBaseComponent, HttpClientTestingModule],
      providers: [CustomersService]
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

    const file = new File(['valid content'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);

    expect(component.selectedFile).toBe(file);
    expect(component.validateFile).toHaveBeenCalled();
  });

  it('should set fileError for a file with invalid structure', (done) => {
    const file = new File(['row1|field2\nrow2|field2|field3'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = file;

    spyOn(component, 'isValidStructure').and.returnValue(false);

    const mockFileReader = {
      onload: null as unknown as ((event: ProgressEvent<FileReader>) => void) | null,
      readAsText: function () {
        if (this.onload) {
          this.onload({ target: { result: 'row1|field2\nrow2|field2|field3' } } as ProgressEvent<FileReader>);
        }
      }
    };

    spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

    component.validateFile();

    fixture.whenStable().then(() => {
      expect(component.fileError).toBe('La estructura del archivo es incorrecta. Cada línea debe contener dos valores separados por "|".');
      done();
    });
  });

  it('should return true for valid file structure in isValidStructure', () => {
    const validContent = 'row1|field2\nrow2|field2';
    expect(component.isValidStructure(validContent)).toBeTrue();
  });

  it('should return false for invalid file structure in isValidStructure', () => {
    const invalidContent = 'row1|field2\nrow2|field2|field3';
    expect(component.isValidStructure(invalidContent)).toBeFalse();
  });

  it('should not log success message on submit if fileError is present', () => {
    const file = new File(['row1|field2\nrow2'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = file;
    component.fileError = 'La estructura del archivo es incorrecta. Cada línea debe contener dos valores separados por "|".';

    spyOn(console, 'log');
    component.onSubmit();

    expect(console.log).not.toHaveBeenCalled();
  });
  
  it('should reset all fields on cancel', () => {
    component.selectedFile = new File(["dummy content"], "dummy.txt");
    component.fileContent = "dummy content";
    component.fileError = "Error message";
    component.confirmationMessage = "Confirmation message";

    component.onCancel();

    expect(component.selectedFile).toBeNull();
    expect(component.fileContent).toBeNull();
    expect(component.fileError).toBeNull();
    expect(component.confirmationMessage).toBeNull();
  });

  it('should disable the submit button if fileError is present', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    component.fileError = 'File error present';
    fixture.detectChanges();

    expect(button.disabled).toBeTrue();

    component.fileError = null;
    component.selectedFile = new File(['valid content'], 'test.txt', { type: 'text/plain' });
    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });  

  it('should set confirmationMessage, clear it after 3 seconds, and reset form on successful submit', (done) => {
    const file = new File(['topic1|content1\n topic2|content2'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = file;
    component.fileContent = 'topic1|content1\n topic2|content2';
    component.fileError = null;
  
    const serviceSpy = spyOn(component['customersService'], 'loadCustomerDatabaseEntries').and.returnValue(of({}));
  
    component.onSubmit();
    fixture.detectChanges();
  
    expect(component.confirmationMessage).toBe('La base de conocimiento ha sido cargada correctamente');
  
    setTimeout(() => {
      expect(component.confirmationMessage).toBeNull();
      expect(component.selectedFile).toBeNull();
      expect(component.fileContent).toBeNull();
      expect(component.fileError).toBeNull();
      done();
    }, 3000);
  });
});

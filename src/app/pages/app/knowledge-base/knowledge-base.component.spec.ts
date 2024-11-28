import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('KnowledgeBaseComponent', () => {
  let component: KnowledgeBaseComponent;
  let fixture: ComponentFixture<KnowledgeBaseComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let customersServiceSpy: jasmine.SpyObj<CustomersService>;

  beforeEach(() => {
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const customersServiceMock = jasmine.createSpyObj('CustomersService', ['loadCustomerDatabaseEntries']);

    TestBed.configureTestingModule({
      imports: [KnowledgeBaseComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: CustomersService, useValue: customersServiceMock }
      ]
    });

    fixture = TestBed.createComponent(KnowledgeBaseComponent);
    component = fixture.componentInstance;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    customersServiceSpy = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;

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

  it('should set fileError for a file with invalid structure', fakeAsync(() => {
    const file = new File(['topic1|content1\ninvalid'], 'test.txt', { type: 'text/plain' });
    component.selectedFile = file;

    spyOn(component, 'isValidStructure').and.returnValue(false);

    const mockFileReader = {
      onload: null as unknown as ((event: ProgressEvent<FileReader>) => void) | null,
      readAsText: function () {
        if (this.onload) {
          this.onload({ target: { result: 'topic1|content1\ninvalid' } } as ProgressEvent<FileReader>);
        }
      }
    };

    spyOn(window as any, 'FileReader').and.returnValue(mockFileReader);

    component.validateFile();
    tick();

    expect(component.fileError).toBe('La estructura del archivo es incorrecta. Cada línea debe contener dos valores separados por "|".');
  }));

  it('should return true for valid file structure in isValidStructure', () => {
    const validContent = 'topic1|content1\ntopic2|content2';
    expect(component.isValidStructure(validContent)).toBeTrue();
  });

  it('should return false for invalid file structure in isValidStructure', () => {
    const invalidContent = 'topic1|content1\ninvalid';
    expect(component.isValidStructure(invalidContent)).toBeFalse();
  });

  it('should reset all fields on cancel', () => {
    component.selectedFile = new File(['dummy content'], 'dummy.txt');
    component.fileContent = 'dummy content';
    component.fileError = 'Error message';
    component.confirmationMessage = 'Confirmation message';

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

  it('should open dialog with success message on successful submit', fakeAsync(() => {
    const fileContent = 'topic1|content1\ntopic2|content2';
    component.fileContent = fileContent;
    component.selectedFile = new File([fileContent], 'test.txt', { type: 'text/plain' });
    component.fileError = null;

    customersServiceSpy.loadCustomerDatabaseEntries.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(customersServiceSpy.loadCustomerDatabaseEntries).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        title: 'Mensaje de Confirmación',
        message: 'La base de conocimiento ha sido cargada correctamente',
        buttonCloseTitle: 'Aceptar',
      },
    });

    tick(3000);

    expect(component.selectedFile).toBeNull();
    expect(component.fileContent).toBeNull();
    expect(component.fileError).toBeNull();
  }));

  it('should open dialog with error message on failed submit', fakeAsync(() => {
    const fileContent = 'topic1|content1\ntopic2|content2';
    component.fileContent = fileContent;
    component.selectedFile = new File([fileContent], 'test.txt', { type: 'text/plain' });
    component.fileError = null;

    customersServiceSpy.loadCustomerDatabaseEntries.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();
    tick();

    expect(customersServiceSpy.loadCustomerDatabaseEntries).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        title: 'Ha ocurrido un error',
        message: 'Error al cargar la base de conocimiento, por favor contacta al administrador',
        buttonCloseTitle: 'Aceptar',
      },
    });
  }));
});

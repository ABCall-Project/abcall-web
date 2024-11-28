import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoadCustomersComponent } from './load-customers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

describe('LoadCustomersComponent', () => {
  let component: LoadCustomersComponent;
  let fixture: ComponentFixture<LoadCustomersComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let customersServiceSpy: jasmine.SpyObj<CustomersService>;

  beforeEach(() => {
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const customersServiceMock = jasmine.createSpyObj('CustomersService', ['addCustomers']);

    TestBed.configureTestingModule({
      imports: [LoadCustomersComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: CustomersService, useValue: customersServiceMock }
      ]
    });

    fixture = TestBed.createComponent(LoadCustomersComponent);
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
    tick();

    expect(component.fileError).toBe('La estructura del archivo es incorrecta. Cada línea debe contener dos valores separados por "|".');
  }));

  it('should open dialog with success message on successful submit', fakeAsync(() => {
    const fileContent = 'row1|field1\nrow2|field2';
    component.fileContent = fileContent;
    component.selectedFile = new File([fileContent], 'test.txt', { type: 'text/plain' });
    component.fileError = null;

    customersServiceSpy.addCustomers.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(customersServiceSpy.addCustomers).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        title: 'Mensaje de Confirmación',
        message: 'Los clientes han sido cargados correctamente',
        buttonCloseTitle: 'Aceptar',
      },
    });

    tick(3000);

    expect(component.selectedFile).toBeNull();
    expect(component.fileContent).toBeNull();
    expect(component.fileError).toBeNull();
  }));

  it('should open dialog with error message on failed submit', fakeAsync(() => {
    const fileContent = 'row1|field1\nrow2|field2';
    component.fileContent = fileContent;
    component.selectedFile = new File([fileContent], 'test.txt', { type: 'text/plain' });
    component.fileError = null;

    customersServiceSpy.addCustomers.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();
    tick();

    expect(customersServiceSpy.addCustomers).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        title: 'Ha ocurrido un error',
        message: 'Error al cargar los clientes, por favor contacta al administrador',
        buttonCloseTitle: 'Aceptar',
      },
    });
  }));
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

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

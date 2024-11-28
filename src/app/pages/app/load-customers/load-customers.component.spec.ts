import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoadCustomersComponent } from './load-customers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomersService } from 'src/app/services/customers/customers.service';
import { of, throwError } from 'rxjs';

describe('LoadCustomersComponent', () => {
  let component: LoadCustomersComponent;
  let fixture: ComponentFixture<LoadCustomersComponent>;
  let customersService: jasmine.SpyObj<CustomersService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('CustomersService', ['addCustomers']);

    TestBed.configureTestingModule({
      imports: [LoadCustomersComponent, HttpClientTestingModule], // Cambiado a imports
      providers: [{ provide: CustomersService, useValue: serviceSpy }]
    });

    fixture = TestBed.createComponent(LoadCustomersComponent);
    component = fixture.componentInstance;
    customersService = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;

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
});

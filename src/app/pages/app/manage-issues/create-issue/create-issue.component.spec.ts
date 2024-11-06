
import { CreateIssueComponent } from './create-issue.component';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModalMessageComponent } from '../../modal-message/modal-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalIssueAiAnswerComponent } from '../modal-issue-ai-answer/modal-issue-ai-answer.component';
import { Router } from '@angular/router';
import { IssuesService } from 'src/app/services/issues.service';
import { ModalPredictiveAnswerComponent } from '../modal-predictive-answer/modal-predictive-answer.component';
import { UsersService } from 'src/app/services/users/users.service';
import { CustomersService } from 'src/app/services/customers/customers.service';


describe('CreateIssueComponent', () => {
  let component: CreateIssueComponent;
  let fixture: ComponentFixture<CreateIssueComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockIssuesService: jasmine.SpyObj<IssuesService>;  
  let usersService: UsersService;
  let customersService: CustomersService;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockIssuesService = jasmine.createSpyObj('IssuesService', ['createIssue']);


    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, CreateIssueComponent,
        RouterTestingModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        CommonModule, TablerIconsModule.pick({ eye: 'eye' }),
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: mockRouter },
        { provide: IssuesService, useValue: mockIssuesService },
        { provide: CustomersService, useValue: { getCustomers: () => of([]), getChannelByPlan: () => of([]) } },
      ]
    }).compileComponents();    

    usersService = TestBed.inject(UsersService);
    customersService = TestBed.inject(CustomersService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the AI answer modal if description is not empty', () => {
    component.form.get('description')?.setValue('Una descripción válida');

    component.openModalIAAnswer();

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalIssueAiAnswerComponent, {
      width: '80%',
      data: { question: 'Una descripción válida' },
    });
  });

  it('should not open the AI answer modal if description is empty and should open error modal', () => {
    component.form.get('description')?.setValue('');

    component.openModalIAAnswer();

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Debe ingresar una descripción para continuar',
        buttonCloseTitle: 'Aceptar'
      },
    });
  });

  it('should trim whitespace and open error modal if description only contains spaces', () => {
    component.form.get('description')?.setValue('   ');

    component.openModalIAAnswer();

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Debe ingresar una descripción para continuar',
        buttonCloseTitle: 'Aceptar'
      },
    });
  });

  it('should trim whitespace and open error modal if customerId only contains spaces', () => {
    component.form.get('customerId')?.setValue('   ');

    component.openModalErrorValidate()

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Favor ingresar todos los campos',
        buttonCloseTitle: 'Aceptar'
      },
    });
  });

  it('should trim whitespace and open error modal if subject only contains spaces', () => {
    component.form.get('subject')?.setValue('   ');

    component.openModalErrorValidate()

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Favor ingresar todos los campos',
        buttonCloseTitle: 'Aceptar'
      },
    });
  });

  it('should trim whitespace and open error modal if agentId only contains spaces', () => {
    component.form.get('agentId')?.setValue('   ');

    component.openModalErrorValidate()

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Favor ingresar todos los campos',
        buttonCloseTitle: 'Aceptar'
      },
    });
  });

  it('should navigate to /starter on cancel', () => {
    component.onCancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/starter']);
  });

  it('should set file and fileName on file selection', () => {
    const file = new File([''], 'test-file.txt');
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.fileName).toBe('test-file.txt');
    expect(component.file).toBe(file);
    expect(component.form.get('file')?.value).toBe(file);
  });

  it('should handle error on createIssue failure', () => {
    component.form.setValue({
      subject: 'Test Subject',
      description: 'Test Description',
      agentId: '1',
      customerId: '2',
      channelId: '3',
      file: null
    });

    mockIssuesService.createIssue.and.returnValue(throwError('Error'));

    component.submit();

    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Object));
  });

  it('should call createIssue and open success modal on valid form submission', () => {
    component.form.setValue({
      subject: 'Test Subject',
      description: 'Test Description',
      agentId: '1',
      customerId: '2',
      channelId: '3',
      file: null
    });

    const response = { message: 'Issue created' };
    mockIssuesService.createIssue.and.returnValue(of(response));

    component.submit();

    expect(mockIssuesService.createIssue).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Object));
  });

  it('should open validation error modal on invalid form submission', () => {
    component.form.setValue({
      subject: '',
      description: '',
      agentId: '',
      customerId: '',
      channelId: '',
      file: null
    });

    component.submit();

    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Object));
  });

  it('should call loadChannels with the correct customerId on onCustomerSelect', () => {
    const mockCustomerId = '12345';
    component.onCustomerSelect(mockCustomerId);
  });

  // it('should open ModalPredictiveAnswerComponent if customerId is valid', () => {
  //   const validClientId = '12345';
  //   component.form.get('customerId')?.setValue(validClientId);
    
  //   component.openPredictiveAnswer();
  
  //   expect(dialogSpy.open).toHaveBeenCalledWith(ModalPredictiveAnswerComponent, {
  //     width: '70%',
  //     data: { userId: validClientId },
  //   });
  // });
  

  // it('should open error modal if customerId is empty', () => {
  //   component.form.get('customerId')?.setValue('');

  //   spyOn(component, 'openModalErrorUserEmpty').and.callThrough();
  //   component.openPredictiveAnswer();

  //   expect(component.openModalErrorUserEmpty).toHaveBeenCalled();
  //   expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
  //     width: '70%',
  //     data: {
  //       userId: '090b9b2f-c79c-41c1-944b-9d57cca4d582',
  //     },
  //   });
  // });

  // it('should open error modal if customerId contains only spaces', () => {
  //   component.form.get('customerId')?.setValue('   ');

  //   spyOn(component, 'openModalErrorUserEmpty').and.callThrough();
  //   component.openPredictiveAnswer();

  //   expect(component.openModalErrorUserEmpty).toHaveBeenCalled();
  //   expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
  //     width: '70%',
  //     data: {
  //       userId: '090b9b2f-c79c-41c1-944b-9d57cca4d582',
  //     },
  //   });
  // });
  it('should open ModalPredictiveAnswerComponent with default userId on openPredictiveAnswer', () => {
    component.openPredictiveAnswer();

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalPredictiveAnswerComponent, {
      width: '70%',
      data: {
        userId: '090b9b2f-c79c-41c1-944b-9d57cca4d582',
      },
    });
  });

  it('should open ModalMessageComponent with correct data on openModalErrorUserEmpty', () => {
    component.openModalErrorUserEmpty();

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Debe seleccionar un cliente ',
        buttonCloseTitle: 'Aceptar',
      },
    });
  });

  it('should handle error when loading channels', () => {
    const consoleSpy = spyOn(console, 'error');
    spyOn(customersService, 'getChannelByPlan').and.returnValue(throwError('Error'));

    component.loadChannels('somePlanId');

    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar los Canales', 'Error');
  });
  
  it('should handle error when loading users', () => {
    const consoleSpy = spyOn(console, 'error');
    spyOn(usersService, 'getUsersByRole').and.returnValue(throwError('Error'));

    component.loadUsers('someRoleId');

    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar los Asesores', 'Error');
  });
});

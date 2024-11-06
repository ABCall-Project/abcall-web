import { CommonModule, NgIf } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TablerIconsModule } from 'angular-tabler-icons';
import { of, throwError } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { CoreService } from 'src/app/services/core.service';
import { IssuesService } from 'src/app/services/issues.service';
import { ModalMessageComponent } from '../../app/modal-message/modal-message.component';
import { GetIssueComponent } from './get-issue.component';
import { ModalIssueDetailComponent } from './modal-issue-detail/modal-issue-detail.component';

describe('GetIssueComponent', () => {
  let component: GetIssueComponent;
  let fixture: ComponentFixture<GetIssueComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockIssuesService: jasmine.SpyObj<IssuesService>;
  let mockService: jasmine.SpyObj<CoreService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockIssuesService = jasmine.createSpyObj('IssuesService', ['getIssueById']);
    mockService = jasmine.createSpyObj('CoreService', ['getOptions']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        GetIssueComponent,
        RouterTestingModule.withRoutes([]),
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        CommonModule,
        TablerIconsModule.pick({ eye: 'eye' }),
        HttpClientTestingModule,
        RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule
      ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: IssuesService, useValue: mockIssuesService },
        { provide: CoreService, useValue: { getOptions: () => [] } },

      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with issueId as empty and required validator', () => {
    const issueIdControl = component.form.get('issueId');

    expect(issueIdControl).toBeTruthy();
    expect(issueIdControl?.value).toBe('');
    expect(issueIdControl?.hasError('required')).toBeTrue();
  });

  it('should trigger form submit correctly if valid form', () => {
    component.form.controls['issueId'].setValue('123');

    expect(component.form.valid).toBeTrue();
  });

  it('should trigger form validation error if no issueId is provided', () => {
    component.form.controls['issueId'].setValue('');
    const issueIdControl = component.form.get('issueId');

    expect(component.form.invalid).toBeTrue();
    expect(issueIdControl?.hasError('required')).toBeTrue();
  });
  // it('should not open the dialog if the form is invalid', () => {
  //   // Arrange: Deja el formulario vacío o en un estado no válido
  //   const mockIssue = {
  //     id: '1',
  //     description: 'Test Issue',
  //     subject: 'Subject of the Issue',
  //   };
  //   component.form.controls['issueId'].setValue('123');
  //   mockIssuesService.getIssueById.and.returnValue(of(mockIssue));

  //   component.submit()
  //   expect(dialogSpy.open).not.toHaveBeenCalled();


  //   expect(mockIssuesService.getIssueById).toHaveBeenCalledWith('123');

  //   // Assert: Asegura que el diálogo no fue abierto si el formulario es inválido
  //   expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
  //     data: {
  //       title: 'Incidentes',
  //       message: 'Debe ingresar una descripción para continuar',
  //       buttonCloseTitle: 'Aceptar'
  //     },
  //   });
  // });


  // it('should handle error on getissue failure', () => {
  //   component.form.setValue({
  //     issueId: '1'
  //   });

  //   mockIssuesService.getIssueById.and.returnValue(throwError('Error'));

  //   component.submit();
  //   component.openModalCustomErrorValidate('')

  //   expect(dialogSpy.open).toHaveBeenCalledWith(ModalIssueDetailComponent, {
  //     data: {
  //       title: 'Incidentes',
  //       message: 'Favor ingresar todos los campos',
  //       buttonCloseTitle: 'Aceptar'
  //     },
  //   });
  // });

});
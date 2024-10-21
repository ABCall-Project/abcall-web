
import { CreateIssueComponent } from './create-issue.component';


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
import { of } from 'rxjs';

import { IInvoice } from '../../models/invoice';
import { IInvoiceDetail } from '../../models/invoice-detail';

import { ModalMessageComponent } from '../../modal-message/modal-message.component';

import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { ModalIssueAiAnswerComponent } from '../modal-issue-ai-answer/modal-issue-ai-answer.component';


describe('CreateIssueComponent', () => {
  let component: CreateIssueComponent;
  let fixture: ComponentFixture<CreateIssueComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, CreateIssueComponent, 
        RouterTestingModule,   
        MatDialogModule,       
        MatPaginatorModule,   
        MatSortModule,       
        MatTableModule,      
        CommonModule, TablerIconsModule.pick({ eye: 'eye' }) ,
        HttpClientTestingModule 
        ],
      providers: [
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();
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
    component.descripcion.setValue('Una descripción válida');
    
    component.openModalIAAnswer();

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalIssueAiAnswerComponent, {
      data: { question: 'Una descripción válida' },
    });
  });

  it('should not open the AI answer modal if description is empty and should open error modal', () => {
    component.descripcion.setValue('');

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
    component.descripcion.setValue('   ');

    component.openModalIAAnswer();

    expect(dialogSpy.open).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        title: 'Incidentes',
        message: 'Debe ingresar una descripción para continuar',
        buttonCloseTitle: 'Aceptar'
      },
    });
  });

});

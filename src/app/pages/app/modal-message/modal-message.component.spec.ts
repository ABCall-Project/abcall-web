
import { ModalMessageComponent } from './modal-message.component';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; 
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatSortModule } from '@angular/material/sort'; 
import { MatTableModule } from '@angular/material/table'; 
import { CommonModule } from '@angular/common'; 
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ModalMessageComponent', () => {
  let component: ModalMessageComponent;
  let fixture: ComponentFixture<ModalMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        ModalMessageComponent, 
        RouterTestingModule,   
        MatDialogModule,       
        MatPaginatorModule,   
        MatSortModule,       
        MatTableModule,      
        CommonModule, TablerIconsModule.pick({ eye: 'eye' }) ,
        HttpClientTestingModule ,
        BrowserAnimationsModule 
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA, 
          useValue: { title: 'Test Title', message: 'Test Message', buttonCloseTitle: 'Close' }
        }
      ]
    });
    fixture = TestBed.createComponent(ModalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

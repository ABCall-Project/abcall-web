
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceListComponent } from './invoice-list.component';
import { RouterTestingModule } from '@angular/router/testing'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatSortModule } from '@angular/material/sort'; 
import { MatTableModule } from '@angular/material/table'; 
import { CommonModule } from '@angular/common'; 
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('InvoiceListComponent', () => {
  let component: InvoiceListComponent;
  let fixture: ComponentFixture<InvoiceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        InvoiceListComponent, 
        RouterTestingModule,   
        MatDialogModule,       
        MatPaginatorModule,   
        MatSortModule,       
        MatTableModule,      
        CommonModule, TablerIconsModule.pick({ eye: 'eye' }) ,
        HttpClientTestingModule ,
        BrowserAnimationsModule 
      ]
    });
    fixture = TestBed.createComponent(InvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

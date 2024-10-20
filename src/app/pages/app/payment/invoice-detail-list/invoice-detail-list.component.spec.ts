import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDetailListComponent } from './invoice-detail-list.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InvoiceDetailListComponent', () => {
  let component: InvoiceDetailListComponent;
  let fixture: ComponentFixture<InvoiceDetailListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InvoiceDetailListComponent,
        TablerIconsModule.pick({ eye: 'eye' }),
        HttpClientTestingModule  ,
        BrowserAnimationsModule 
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA, 
          useValue: { title: 'Test Title', message: 'Test Message', buttonCloseTitle: 'Close' }
        }
      ]
    });
    fixture = TestBed.createComponent(InvoiceDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

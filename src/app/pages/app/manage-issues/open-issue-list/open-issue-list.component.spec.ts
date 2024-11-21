import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TablerIconsModule } from 'angular-tabler-icons';
import { of } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';
import { IssuesService } from 'src/app/services/issues.service';
import { OpenIssueListComponent } from './open-issue-list.component';
import { ModalMessageComponent } from '../../modal-message/modal-message.component';  // Ensure this path is correct

describe('OpenIssuesListComponent', () => {
  let component: OpenIssueListComponent;
  let fixture: ComponentFixture<OpenIssueListComponent>;
  let issueService: IssuesService;
  let dialogSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        TablerIconsModule.pick({ eye: 'eye' }),
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        UsersService,
        IssuesService,
        { provide: MatDialog, useValue: { open: () => { } } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenIssueListComponent);
    component = fixture.componentInstance;
    issueService = TestBed.inject(IssuesService);
    dialogSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callFake(() => ({
      afterClosed: () => of(true),
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load issues and customers on init', () => {
    const issuesSpy = spyOn(component, 'loadOpenIssues').and.callThrough();
    const customersSpy = spyOn(component, 'loadCustomers').and.callThrough();

    component.ngOnInit();

    expect(issuesSpy).toHaveBeenCalled();
    expect(customersSpy).toHaveBeenCalled();
  });

  it('should correctly toggle row selection when checkbox is clicked', () => {
    const mockIssue = { id: '1', subject: 'Test Issue' };
    component.onCheckboxChange(mockIssue);

    expect(component.selectedRow).toEqual(mockIssue);
    component.onCheckboxChange(mockIssue);
    expect(component.selectedRow).toBeNull();
  });

  it('should open the modal dialog when openInvoiceDetails is called', () => {
    const mockIssue = { id: '1', generationDate: '2024-11-20' };
    component.openInvoiceDetails(mockIssue);

    expect(dialogSpy).toHaveBeenCalledWith(ModalMessageComponent, {
      data: {
        invoice: mockIssue.id,
        generationDate: mockIssue.generationDate
      }
    });
  });

  it('should call loadOpenIssues when pagination changes', () => {
    const loadOpenIssuesSpy = spyOn(component, 'loadOpenIssues').and.callThrough();
    const event = { pageIndex: 1, pageSize: 5 };

    component.onPageChange(event);

    expect(loadOpenIssuesSpy).toHaveBeenCalled();
    expect(component.page).toEqual(1);
    expect(component.limit).toEqual(5);
  });

  it('should populate issues with correct data', () => {
    component.loadOpenIssues();

    fixture.detectChanges();

    expect(component.issues.length).toBeGreaterThan(0);
    expect(component.issues[0].subject).toBe('Test Issue');
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });


});

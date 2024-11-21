import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common'; // <-- Ensure CommonModule is imported
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
import { OpenIssueListComponent } from './open-issue-list.component';


describe('OpenIssuesListComponent', () => {
  let component: OpenIssueListComponent;
  let fixture: ComponentFixture<OpenIssueListComponent>;
  let userService: UsersService;
  let dialogSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule, // <-- CommonModule is required for ngIf
        RouterTestingModule,
        MatDialogModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        TablerIconsModule.pick({ eye: 'eye' }),
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [UsersService, { provide: MatDialog, useValue: { open: () => { } } }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenIssueListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UsersService);

    dialogSpy = spyOn<any>(TestBed.inject(MatDialog), 'open').and.callFake(() => ({
      afterClosed: () => of(true),
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

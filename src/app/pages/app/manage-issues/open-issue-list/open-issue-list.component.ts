import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Customer } from 'src/app/models/customer/customer';
import { Issue } from 'src/app/models/issue/issue';
import { IssueList } from 'src/app/models/issue/issue-list';
import { User } from 'src/app/models/user/user';
import { IssuesService } from 'src/app/services/issues.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ModalMessageComponent } from '../../modal-message/modal-message.component';

@Component({
  selector: 'app-open-issue-list',
  standalone: true,
  templateUrl: './open-issue-list.component.html',
  styleUrls: ['./open-issue-list.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    RouterModule,
    TablerIconsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ]
})
export class OpenIssueListComponent implements OnInit {
  constructor(public dialog: MatDialog, private issueService: IssuesService) { }


  ngOnInit(): void {
    this.loadOpenIssues();
    this.loadCustomers();

  }
  public issues: Array<Issue> = [];
  public customers: Customer[] = [];
  public dataSource = new MatTableDataSource(this.issues);
  public displayedColumns: string[] = ['chk', 'issueId', 'subject', 'client', 'created_at', 'status'];
  public totalRows: number | undefined;
  public selectedRow: any;
  public isLoading: boolean = false;
  public page: number = 1;
  public limit: number = 5;

  onCheckboxChange(element: any) {
    if (this.selectedRow === element) {
      this.selectedRow = null;
    } else {
      this.selectedRow = element;
    }
  }

  isRowSelected(element: any): boolean {
    return this.selectedRow === element;
  }

  openInvoiceDetails(element: any) {

    this.dialog.open(ModalMessageComponent, {
      data: {
        invoice: element.id,
        generationDate: element.generationDate
      },
    });
  }

  loadOpenIssues(page: number = this.page, limit: number = this.limit) {
    this.isLoading = true;
    this.issueService.getOpenIssues(page, limit).subscribe((resp: IssueList) => {
      this.issues = resp.data.map((issue) => {
        const customerName: string = this.customers.find((ele) => ele.id === issue.authUserId)?.name ?? 'Usuario Chatbot';
        return {
          id: issue.id.toUpperCase().split('-').pop() ?? '',
          auth_user_id: issue.authUserId,
          status: issue.status,
          subject: issue.subject,
          description: issue.description,
          created_at: issue.createdAt,
          closed_at: issue.closedAt,
          channel_plan_id: issue.channelPlanId,
          customer: customerName
        }
      })
      this.totalRows = resp.totalPages * resp.limit;;
      this.dataSource.data = this.issues;

      this.isLoading = false;
    })

  }

  loadCustomers(): void {
    this.customers = [
      {
        "id": "090b9b2f-c79c-41c1-944b-9d57cca4d582",
        "name": "MIGUEL TOVAR",
        "plan_id": "845eb227-5356-4169-9799-95a97ec5ce33",
        "date_suscription": "2024-10-12T00:00:00+00:00"
      },
      {
        "id": "9c6ace24-775e-4af2-bd95-480c2c540ae9",
        "name": "MIGUEL VEGA",
        "plan_id": "845eb227-5356-4169-9799-95a97ec5ce33",
        "date_suscription": "2024-10-12T00:00:00+00:00"
      }
    ]
  }

  onPageChange(event: any) {
    console.log(event)
    if (event.pageIndex == 0) event.pageIndex = 1;
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.loadOpenIssues();
  }

}

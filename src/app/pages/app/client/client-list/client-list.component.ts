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
import { User } from 'src/app/models/user/user';
import { UsersService } from 'src/app/services/users/users.service';
import { ModalMessageComponent } from '../../modal-message/modal-message.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
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
export class ClientListComponent implements OnInit {
  constructor(public dialog: MatDialog, private usersService: UsersService) { }
  ngOnInit(): void {
    this.loadUsers('beaa72b1-a7d3-4035-b4b3-bba0cd0c4d5d');

  }
  users: Array<User> = [];
  dataSource = new MatTableDataSource(this.users);
  displayedColumns: string[] = ['chk', 'userId', 'name', 'lastName', 'phoneNumber', 'email'];
  totalRows: number | undefined;
  selectedRow: any;
  isLoading: boolean = false;

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

  loadUsers(roleId: string) {
    this.isLoading = true;
    this.usersService.getUsersByRolePaginated(roleId).subscribe((resp) => {
      this.users = resp.data
      this.totalRows = this.users.length;
      this.dataSource.data = this.users;
      this.isLoading = false;
    })

  }

}

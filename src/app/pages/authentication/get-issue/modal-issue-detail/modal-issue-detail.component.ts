import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Issue } from 'src/app/models/issue/issue';
import { Nl2brPipe } from 'src/app/pipe/nl2br.pipe';

export interface DialogData {
  issue: Issue;
}
@Component({
  selector: 'app-modal-issue-detail',
  templateUrl: './modal-issue-detail.component.html',
  styleUrls: ['./modal-issue-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule, MatTableModule, MatSortModule, TablerIconsModule, MatPaginatorModule, MatProgressSpinnerModule, Nl2brPipe],
  providers: [DatePipe]

})
export class ModalIssueDetailComponent implements OnInit {
  isLoading: boolean = true;
  public issue: Issue;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }

  ngOnInit(): void {
    console.log(this.data)
    this.issue = this.data.issue

  }

}
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-issue-state',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  templateUrl: './issue-state.component.html',
  styleUrls: ['./issue-state.component.scss']
})
export class IssueStateComponent {
  close(): void {
    console.log("Cerrando el diálogo");
  }
}

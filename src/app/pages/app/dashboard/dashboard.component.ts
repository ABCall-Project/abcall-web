import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { IssuesService } from 'src/app/services/issues.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardComponent implements OnInit {

  customerId: string;

  /*Guid from Channel Type*/
  callId: string;
  mailId: string;
  chatboId: string;
  /*Guid from State*/
  createdId: string;
  inProgressId: string;
  closedId: string;

  selectedState: string | null = null;
  selectedOrigen: string | null = null;
  initialDate: Date | null = null;
  endDate: Date | null = null;

  totalCreated = 0;
  totalClosed = 0;
  totalInProgress = 0;
  totalIssues = 0;
  totalCalls = 0;
  totalMails = 0;
  totalChatbot = 0;

  dateForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });

  constructor(private issuesServices: IssuesService) {
    this.customerId = '845eb227-5356-4169-9799-95a97ec5ce33';

    this.callId = '6938edfe-9f4b-445b-8dd5-fbaa570a273a';
    this.mailId = 'd256f4b9-f970-4222-9a7b-3e83def73038';
    this.chatboId = '3a46cc3e-b2ee-4aa0-8498-163e04eb1430';

    this.createdId = '574408a7-3aa0-4eab-b279-62ed10e6107e';
    this.inProgressId = '18e7d7dd-247b-4e27-aa0e-4f15e8ba5930';
    this.closedId = '791353c6-3899-4d35-bcd9-af8775e240bf';
  }

  ngOnInit(): void {
    this.issuesServices.getIssuesDasboard(this.customerId).subscribe((issues) => {
      this.totalCreated = issues.filter((issue: any) => issue.status === this.createdId).length;
      this.totalClosed = issues.filter((issue: any) => issue.status === this.closedId).length;
      this.totalInProgress = issues.filter((issue: any) => issue.status === this.inProgressId).length;

      this.totalCalls = issues.filter((issue: any) => issue.channel_plan_id === this.callId).length;
      this.totalMails = issues.filter((issue: any) => issue.channel_plan_id === this.mailId).length;
      this.totalChatbot = issues.filter((issue: any) => issue.channel_plan_id === this.chatboId).length;

      this.totalIssues = issues.length;

      this.createEstadoCasosChart(issues);
      this.createVariacionMensualChart(issues);
      this.createDistribucionCanalChart(issues);
      this.createEvolucionAcumuladaChart(issues);
    });

    this.dateForm.valueChanges.subscribe(() => {
      this.onDateChange();
    });
  }

  createEstadoCasosChart(response: any, type?: string) {
    const ctx = document.getElementById('estadoCasosChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const isWithinDateRange = (issueDate: Date): boolean => {
      if (this.initialDate && this.endDate) {
        return issueDate >= this.initialDate && issueDate <= this.endDate;
      } else if (this.initialDate) {
        return issueDate >= this.initialDate;
      } else if (this.endDate) {
        return issueDate <= this.endDate;
      }
      return true;
    };

    const registrados = response.filter((issue: any) => issue.status === this.createdId && isWithinDateRange(new Date(issue.created_at))).length;
    const cerrados = response.filter((issue: any) => issue.status === this.closedId && isWithinDateRange(new Date(issue.created_at))).length;
    const enCurso = response.filter((issue: any) => issue.status === this.inProgressId && isWithinDateRange(new Date(issue.created_at))).length;

    this.totalCreated = registrados;
    this.totalClosed = cerrados;
    this.totalInProgress = enCurso;
    
    const data = type
      ? [
        type === this.createdId ? registrados : 0,
        type === this.closedId ? cerrados : 0,
        type === this.inProgressId ? enCurso : 0
      ]
      : [registrados, cerrados, enCurso];

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Registrados', 'Solucionados', 'En progreso'],
        datasets: [{
          data: data,
          backgroundColor: ['#090041', '#272860', '#6563ff']
        }]
      },
      options: {
        cutout: '50%' 
      }
    });
  }

  createVariacionMensualChart(response: any, type?: string) {
    const ctx = document.getElementById('variacionMensualChart') as HTMLCanvasElement;

    const existingChart = Chart.getChart(ctx);

    const registrados = response.filter((issue: any) => issue.status === this.createdId).length;
    const cerrados = response.filter((issue: any) => issue.status === this.closedId).length;
    const enCurso = response.filter((issue: any) => issue.status === this.inProgressId).length;

    this.totalCreated = registrados;
    this.totalClosed = cerrados;
    this.totalInProgress = enCurso;

    if (existingChart) {
      existingChart.destroy();
    }

    const isWithinDateRange = (issueDate: Date): boolean => {
      if (this.initialDate && this.endDate) {
        return issueDate >= this.initialDate && issueDate <= this.endDate;
      } else if (this.initialDate) {
        return issueDate >= this.initialDate;
      } else if (this.endDate) {
        return issueDate <= this.endDate;
      }
      return true;
    };

    const uniqueMonths = [...new Set(
      response
        .filter((issue: any) => isWithinDateRange(new Date(issue.created_at)))
        .map((issue: any) => {
          const mes = new Date(issue.created_at).getMonth();
          return typeof mes === 'number' ? mes : null;
        })
    )].filter(mes => mes !== null) as number[];

    uniqueMonths.sort((a, b) => a - b);

    let monthNames = uniqueMonths.map(mes => new Date(0, mes).toLocaleString('es-ES', { month: 'long' }));

    const dataPorMes = (mes: number) => {
      return response.filter((issue: any) =>
        new Date(issue.created_at).getMonth() === mes &&
        isWithinDateRange(new Date(issue.created_at))
      );
    };

    const datasets = [
      {
        label: 'Registrados',
        data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === this.createdId).length),
        borderColor: '#090041',
        hidden: type ? type !== this.createdId : false
      },
      {
        label: 'Solucionados',
        data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === this.closedId).length),
        borderColor: '#272860',
        hidden: type ? type !== this.closedId : false
      },
      {
        label: 'En progreso',
        data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === this.inProgressId).length),
        borderColor: '#6563ff',
        hidden: type ? type !== this.inProgressId : false
      }
    ];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthNames,
        datasets: datasets
      }
    });
  }

  createDistribucionCanalChart(response: any, type?: string) {
    const ctx = document.getElementById('distribucionCanalChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const calls = response.filter((issue: any) => issue.channel_plan_id === this.callId).length;
    const chats = response.filter((issue: any) => issue.channel_plan_id === this.chatboId).length;
    const mails = response.filter((issue: any) => issue.channel_plan_id === this.mailId).length;

    this.totalCalls = calls;
    this.totalChatbot = chats;
    this.totalMails = mails;

    const isWithinDateRange = (issueDate: Date): boolean => {
      if (this.initialDate && this.endDate) {
        return issueDate >= this.initialDate && issueDate <= this.endDate;
      } else if (this.initialDate) {
        return issueDate >= this.initialDate;
      } else if (this.endDate) {
        return issueDate <= this.endDate;
      }
      return true;
    };

    const uniqueMonths = [...new Set(
      response
        .filter((issue: any) => isWithinDateRange(new Date(issue.created_at)))
        .map((issue: any) => {
          const mes = new Date(issue.created_at).getMonth();
          return typeof mes === 'number' ? mes : null;
        })
    )].filter(mes => mes !== null) as number[];

    uniqueMonths.sort((a, b) => a - b);

    let monthNames = uniqueMonths.map(mes => new Date(0, mes).toLocaleString('es-ES', { month: 'long' }));

    const dataPorMes = (mes: number) => {
      return response.filter((issue: any) =>
        new Date(issue.created_at).getMonth() === mes &&
        isWithinDateRange(new Date(issue.created_at))
      );
    };

    const datasets = [
      {
        label: 'Llamadas',
        data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.callId).length),
        backgroundColor: '#090041',
        hidden: type ? type !== this.callId : false
      },
      {
        label: 'Correos',
        data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.mailId).length),
        backgroundColor: '#272860',
        hidden: type ? type !== this.mailId : false
      },
      {
        label: 'Chatbot',
        data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.chatboId).length),
        backgroundColor: '#6563ff',
        hidden: type ? type !== this.chatboId : false
      }
    ];

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthNames,
        datasets: datasets
      }
    });
  }

  createEvolucionAcumuladaChart(response: any, type?: string) {
    const ctx = document.getElementById('evolucionAcumuladaChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const calls = response.filter((issue: any) => issue.channel_plan_id === this.callId).length;
    const chats = response.filter((issue: any) => issue.channel_plan_id === this.chatboId).length;
    const mails = response.filter((issue: any) => issue.channel_plan_id === this.mailId).length;

    this.totalCalls = calls;
    this.totalChatbot = chats;
    this.totalMails = mails;

    const isWithinDateRange = (issueDate: Date): boolean => {
      if (this.initialDate && this.endDate) {
        return issueDate >= this.initialDate && issueDate <= this.endDate;
      } else if (this.initialDate) {
        return issueDate >= this.initialDate;
      } else if (this.endDate) {
        return issueDate <= this.endDate;
      }
      return true;
    };

    const uniqueMonths = [...new Set(
      response
        .filter((issue: any) => isWithinDateRange(new Date(issue.created_at)))
        .map((issue: any) => {
          const mes = new Date(issue.created_at).getMonth();
          return typeof mes === 'number' ? mes : null;
        })
    )].filter(mes => mes !== null) as number[];

    uniqueMonths.sort((a, b) => a - b);

    let monthNames = uniqueMonths.map(mes => new Date(0, mes).toLocaleString('es-ES', { month: 'long' }));

    const dataPorMes = (mes: number) => {
      return response.filter((issue: any) =>
        new Date(issue.created_at).getMonth() === mes &&
        isWithinDateRange(new Date(issue.created_at))
      );
    };

    const acumularDatos = (meses: number[], channelType?: string) => {
      let acumulado = 0;
      return meses.map(mes => {
        const count = dataPorMes(mes).filter((issue: any) => !channelType || issue.channel_plan_id === channelType).length;
        acumulado += count;
        return acumulado;
      });
    };

    const datasets = [
      {
        label: 'Llamadas',
        data: acumularDatos(uniqueMonths, this.callId),
        backgroundColor: '#090041',
        borderColor: '#090041',
        hidden: type ? type !== this.callId : false
      },
      {
        label: 'Correos',
        data: acumularDatos(uniqueMonths, this.mailId),
        backgroundColor: '#272860',
        borderColor: '#272860',
        hidden: type ? type !== this.mailId : false
      },
      {
        label: 'Chatbot',
        data: acumularDatos(uniqueMonths, this.chatboId),
        backgroundColor: '#6563ff',
        borderColor: '#6563ff',
        hidden: type ? type !== this.chatboId : false
      }
    ];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthNames,
        datasets: datasets
      }
    });
  }

  OnSelectionState(event: MatSelectChange) {
    this.selectedState = event.value;
    this.issuesServices.getIssuesDasboard(this.customerId).subscribe((issues) => {
      this.createEstadoCasosChart(issues, event.value);
      this.createVariacionMensualChart(issues, event.value);
    });
  }

  OnSelectionChange(event: MatSelectChange) {
    this.selectedOrigen = event.value;
    this.issuesServices.getIssuesDasboard(this.customerId).subscribe((issues) => {
      this.createDistribucionCanalChart(issues, event.value);
      this.createEvolucionAcumuladaChart(issues, event.value);
    });
  }

  onDateChange() {   
    const startDateValue = this.dateForm.get('startDate')?.value;
    const endDateValue = this.dateForm.get('endDate')?.value;

    const startDate = startDateValue ? new Date(startDateValue) : undefined;
    const endDate = endDateValue ? new Date(endDateValue) : undefined;

    this.issuesServices.getIssuesDasboard(this.customerId, undefined, undefined, startDate, endDate).subscribe((issues) => {
      this.createEstadoCasosChart(issues, this.selectedState ?? '');
      this.createVariacionMensualChart(issues, this.selectedState ?? '');
      this.createDistribucionCanalChart(issues, this.selectedOrigen ?? '');
      this.createEvolucionAcumuladaChart(issues, this.selectedOrigen ?? '');
    });        
  }

  resetForm() {      
    this.dateForm.reset();
      
    this.selectedState = null;
    this.selectedOrigen = null;  
  }
}
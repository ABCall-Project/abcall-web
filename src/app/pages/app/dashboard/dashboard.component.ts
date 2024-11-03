import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { IssuesService } from 'src/app/services/issues.service';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

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

    const encryptionKey = environment.key;
    const encryptedData = sessionStorage.getItem('ref');

    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.customerId=decryptedData.customerId;
    }

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

      this.issuesServices.getIssuesDasboard(this.customerId).subscribe((issues) => {
        this.createEstadoCasosChart(issues);
        this.createVariacionMensualChart(issues);
        this.createDistribucionCanalChart(issues);
        this.createEvolucionAcumuladaChart(issues);
      });
    });

    this.dateForm.get('startDate')?.valueChanges.subscribe(value => {
      this.onDateChange();
    });

    this.dateForm.get('endDate')?.valueChanges.subscribe(value => {
      this.onDateChange();
    });
  }

  createEstadoCasosChart(response: any, type?: string) {
    const ctx = document.getElementById('estadoCasosChart') as HTMLCanvasElement;

    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const registrados = response.filter((issue: any) => issue.status === this.createdId).length;
    const cerrados = response.filter((issue: any) => issue.status === this.closedId).length;
    const enCurso = response.filter((issue: any) => issue.status === this.inProgressId).length;

    //Created
    if (type === this.createdId) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Registrados'],
          datasets: [{
            data: [registrados],
            backgroundColor: ['#090041']
          }]
        }
      });
      return;
    }
    //Solved
    else if (type === this.closedId) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Solucionados'],
          datasets: [{
            data: [cerrados],
            backgroundColor: ['#272860']
          }]
        }
      });
      return;
    }
    //In Progress
    else if (type === this.inProgressId) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['En progreso'],
          datasets: [{
            data: [cerrados],
            backgroundColor: ['#6563ff']
          }]
        }
      });
      return;
    }

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Registrados', 'Solucionados', 'En progreso'],
        datasets: [{
          data: [registrados, cerrados, enCurso],
          backgroundColor: ['#090041', '#272860', '#6563ff']
        }]
      }
    });
  }

  createVariacionMensualChart(response: any, type?: string) {
    const ctx = document.getElementById('variacionMensualChart') as HTMLCanvasElement;

    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const uniqueMonths = [...new Set(
      response.map((issue: any) => {
        const mes = new Date(issue.created_at).getMonth();
        return typeof mes === 'number' ? mes : null;
      })
    )].filter(mes => mes !== null) as number[];

    uniqueMonths.sort((a, b) => a - b);

    var monthNames = uniqueMonths.map(mes => new Date(0, mes).toLocaleString('es-ES', { month: 'long' }));

    monthNames = uniqueMonths.map(month => monthNames[month]);

    const dataPorMes = (mes: unknown) => {
      if (typeof mes === 'number') {
        return response.filter((issue: any) => new Date(issue.created_at).getMonth() === mes);
      } else {
        return [];
      }
    };

    //Created
    if (type === this.createdId) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Registrados',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === type).length),
              borderColor: '#090041'
            }
          ]
        }
      });
      return;
    }
    //Solved
    else if (type === this.closedId) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Solucionados',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === type).length),
              borderColor: '#272860'
            }
          ]
        }
      });
      return;
    }
    //In Progress
    else if (type === this.inProgressId) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'En progreso',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === type).length),
              borderColor: '#6563ff'
            }
          ]
        }
      });
      return;
    }
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthNames,  // Labels dinámicos según los meses encontrados
        datasets: [
          {
            label: 'Registrados',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === this.createdId).length),
            borderColor: '#090041'
          },
          {
            label: 'Solucionados',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === this.closedId).length),
            borderColor: '#272860'
          },
          {
            label: 'En progreso',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === this.inProgressId).length),
            borderColor: '#6563ff'
          }
        ]
      }
    });
  }

  createDistribucionCanalChart(response: any, type?: string) {
    const ctx = document.getElementById('distribucionCanalChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const uniqueMonths = [...new Set(
      response.map((issue: any) => {
        const mes = new Date(issue.created_at).getMonth();
        return typeof mes === 'number' ? mes : null;
      })
    )].filter(mes => mes !== null) as number[];

    uniqueMonths.sort((a, b) => a - b);

    var monthNames = uniqueMonths.map(mes => new Date(0, mes).toLocaleString('es-ES', { month: 'long' }));

    monthNames = uniqueMonths.map(month => monthNames[month]);
    const dataPorMes = (mes: unknown) => {
      if (typeof mes === 'number') {
        return response.filter((issue: any) => new Date(issue.created_at).getMonth() === mes);
      } else {
        return [];
      }
    };

    //Calls
    if (type === this.callId) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Llamadas',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === type).length),
              backgroundColor: '#090041'
            }
          ]
        }
      });
      return;
    }
    //Mail
    else if (type === this.mailId) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Correos',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === type).length),
              backgroundColor: '#272860'
            }
          ]
        }
      });
      return;
    }
    //Chatbot
    else if (type === this.chatboId) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Chatbot',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === type).length),
              backgroundColor: '#6563ff'
            }
          ]
        }
      });
      return;
    }
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthNames,  // Labels dinámicos según los meses encontrados
        datasets: [
          {
            label: 'Llamadas',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.callId).length),
            backgroundColor: '#090041'
          },
          {
            label: 'Correos',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.mailId).length),
            backgroundColor: '#272860'
          },
          {
            label: 'Chatbot',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.chatboId).length),
            backgroundColor: '#6563ff'
          }
        ]
      }
    });
  }

  createEvolucionAcumuladaChart(response: any, type?: string) {
    const ctx = document.getElementById('evolucionAcumuladaChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const uniqueMonths = [...new Set(
      response.map((issue: any) => {
        const mes = new Date(issue.created_at).getMonth();
        return typeof mes === 'number' ? mes : null;
      })
    )].filter(mes => mes !== null) as number[];

    uniqueMonths.sort((a, b) => a - b);

    var monthNames = uniqueMonths.map(mes => new Date(0, mes).toLocaleString('es-ES', { month: 'long' }));

    monthNames = uniqueMonths.map(month => monthNames[month]);
    const dataPorMes = (mes: unknown) => {
      if (typeof mes === 'number') {
        return response.filter((issue: any) => new Date(issue.created_at).getMonth() === mes);
      } else {
        return [];
      }
    };

    const acumularDatos = (meses: number[]) => {
      let acumulado = 0;
      return meses.map(mes => {
        acumulado += response.filter((issue: any) => new Date(issue.created_at).getMonth() === mes).length;
        return acumulado;
      });
    };

    //Calls
    if (type === this.callId) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Llamadas',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === type).length),
              backgroundColor: '#090041',
              borderColor: '#090041'
            }
          ]
        }
      });
      return;
    }
    //Mail
    else if (type === this.mailId) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Correos',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === type).length),
              backgroundColor: '#272860',
              borderColor: '#272860'
            }
          ]
        }
      });
      return;
    }
    //Chatbot
    else if (type === this.chatboId) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Chatbot',
              data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === type).length),
              backgroundColor: '#6563ff',
              borderColor: '#6563ff'
            }
          ]
        }
      });
      return;
    }
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthNames,  // Labels dinámicos según los meses encontrados
        datasets: [
          {
            label: 'Llamadas',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.callId).length),
            backgroundColor: '#090041',
            borderColor: '#090041'
          },
          {
            label: 'Correos',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.mailId).length),
            backgroundColor: '#272860',
            borderColor: '#272860'
          },
          {
            label: 'Chatbot',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.channel_plan_id === this.chatboId).length),
            backgroundColor: '#6563ff',
            borderColor: '#6563ff'
          }
        ]
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
    const endDate = endDateValue ? new Date(endDateValue) :undefined;

    this.issuesServices.getIssuesDasboard(this.customerId, undefined, undefined, startDate, endDate).subscribe((issues) => {
      this.createEstadoCasosChart(issues, this.selectedState ?? '');
      this.createVariacionMensualChart(issues, this.selectedState ?? '');
      this.createDistribucionCanalChart(issues, this.selectedOrigen ?? '');
      this.createEvolucionAcumuladaChart(issues, this.selectedOrigen ?? '');
    });
  }
}
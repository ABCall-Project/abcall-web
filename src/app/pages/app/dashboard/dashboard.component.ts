import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { IssuesService } from 'src/app/services/issues.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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
    FormsModule
  ]
})
export class DashboardComponent implements OnInit {

  customerId: string;

  selectedState: string | null = null;
  selectedOrigen: string | null = null;
  initialDate: Date | null = null;
  endDate: Date | null = null;

  totalRegistrados = 0;
  totalCerrados = 0;
  totalEnCurso = 0;
  totalHistorico = 0;
  totalLlamadas = 0;
  totalCorreos = 0;
  totalChatbot = 0;

  constructor(private issuesServices: IssuesService) {
    this.customerId = '845eb227-5356-4169-9799-95a97ec5ce33';
  }

  ngOnInit(): void {
    this.issuesServices.getIssuesDasboard(this.customerId).subscribe((issues) => {
      this.totalRegistrados = issues.filter((issue: any) => issue.status === '574408a7-3aa0-4eab-b279-62ed10e6107e').length;
      this.totalCerrados = issues.filter((issue: any) => issue.status === '791353c6-3899-4d35-bcd9-af8775e240bf').length;
      this.totalEnCurso = issues.filter((issue: any) => issue.status === '18e7d7dd-247b-4e27-aa0e-4f15e8ba5930').length;

      this.totalLlamadas = issues.filter((issue: any) => issue.channel_plan_id === '6938edfe-9f4b-445b-8dd5-fbaa570a273a').length;
      this.totalCorreos = issues.filter((issue: any) => issue.channel_plan_id === 'd256f4b9-f970-4222-9a7b-3e83def73038').length;
      this.totalChatbot = issues.filter((issue: any) => issue.channel_plan_id === '3a46cc3e-b2ee-4aa0-8498-163e04eb1430').length;

      this.totalHistorico = issues.length;

      this.issuesServices.getIssuesDasboard(this.customerId).subscribe((issues) => {
        this.createEstadoCasosChart(issues);
        this.createVariacionMensualChart(issues);
        this.createDistribucionCanalChart(issues);
        this.createEvolucionAcumuladaChart(issues);
      });
    });
  }

  createEstadoCasosChart(response: any, type?: string) {
    const ctx = document.getElementById('estadoCasosChart') as HTMLCanvasElement;

    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    const registrados = response.filter((issue: any) => issue.status === '574408a7-3aa0-4eab-b279-62ed10e6107e').length;
    const cerrados = response.filter((issue: any) => issue.status === '791353c6-3899-4d35-bcd9-af8775e240bf').length;
    const enCurso = response.filter((issue: any) => issue.status === '18e7d7dd-247b-4e27-aa0e-4f15e8ba5930').length;

    //Created
    if (type === "574408a7-3aa0-4eab-b279-62ed10e6107e") {
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
    else if (type === "791353c6-3899-4d35-bcd9-af8775e240bf") {
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
    else if (type === "18e7d7dd-247b-4e27-aa0e-4f15e8ba5930") {
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

    const monthNames = uniqueMonths.map(mes => new Date(0, mes).toLocaleString('es-ES', { month: 'long' }));
    const dataPorMes = (mes: unknown) => {
      if (typeof mes === 'number') {
        return response.filter((issue: any) => new Date(issue.created_at).getMonth() === mes);
      } else {
        return [];
      }
    };

    //Created
    if (type === "574408a7-3aa0-4eab-b279-62ed10e6107e") {
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
    else if (type === "791353c6-3899-4d35-bcd9-af8775e240bf") {
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
    else if (type === "18e7d7dd-247b-4e27-aa0e-4f15e8ba5930") {
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
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === '574408a7-3aa0-4eab-b279-62ed10e6107e').length), 
            borderColor: '#090041'
          },
          {
            label: 'Solucionados',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === '791353c6-3899-4d35-bcd9-af8775e240bf').length),  
            borderColor: '#272860'
          },
          {
            label: 'En progreso',
            data: uniqueMonths.map((mes): number => dataPorMes(mes).filter((issue: any) => issue.status === '18e7d7dd-247b-4e27-aa0e-4f15e8ba5930').length),  
            borderColor: '#6563ff'
          }
        ]
      }
    });
  }

  createDistribucionCanalChart(response: any, type?: string) {
    const ctx = document.getElementById('distribucionCanalChart') as HTMLCanvasElement;

    const llamadas = response.filter((issue: any) => issue.channel_plan_id === '6938edfe-9f4b-445b-8dd5-fbaa570a273a').length;
    const correos = response.filter((issue: any) => issue.channel_plan_id === 'd256f4b9-f970-4222-9a7b-3e83def73038').length;
    const chatbots = response.filter((issue: any) => issue.channel_plan_id === '3a46cc3e-b2ee-4aa0-8498-163e04eb1430').length;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          { label: 'Llamada', data: [llamadas], backgroundColor: '#090041' },
          { label: 'Correo', data: [correos], backgroundColor: '#272860' },
          { label: 'Chatbot', data: [chatbots], backgroundColor: '#6563ff' }
        ]
      }
    });
  }

  createEvolucionAcumuladaChart(response: any, type?: string) {
    const ctx = document.getElementById('evolucionAcumuladaChart') as HTMLCanvasElement;

    const acumularDatos = (meses: number[]) => {
      let acumulado = 0;
      return meses.map(mes => {
        acumulado += response.filter((issue: any) => new Date(issue.created_at).getMonth() === mes).length;
        return acumulado;
      });
    };

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          { label: 'Llamada', data: acumularDatos([0, 1, 2, 3, 4, 5]), backgroundColor: '#090041', fill: true },
          { label: 'Correo', data: acumularDatos([0, 1, 2, 3, 4, 5]), backgroundColor: '#272860', fill: true },
          { label: 'Chatbot', data: acumularDatos([0, 1, 2, 3, 4, 5]), backgroundColor: '#6563ff', fill: true }
        ]
      }
    });
  }

  OnSelectionState(event: MatSelectChange) {
    this.issuesServices.getIssuesDasboard(this.customerId).subscribe((issues) => {
      this.createEstadoCasosChart(issues, event.value);
      this.createVariacionMensualChart(issues, event.value);
    });
  }

  OnSelectionChange(event: MatSelectChange) {
    this.issuesServices.getIssuesDasboard(this.customerId).subscribe((issues) => {
      this.createDistribucionCanalChart(issues, event.value);
      this.createEvolucionAcumuladaChart(issues, event.value);
    });
  }
}
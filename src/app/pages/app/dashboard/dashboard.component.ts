import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
  
  // Propiedades que faltaban
  selectedEstado: string | null = null;
  selectedOrigen: string | null = null;
  fechaInicial: Date | null = null;
  fechaFinal: Date | null = null;

  // Propiedades de resumen
  totalRegistrados = 60;
  totalCerrados = 30;
  totalEnCurso = 10;
  totalHistorico = 350;
  totalLlamadas = 200;
  totalCorreos = 5;
  totalChatbot = 40;

  constructor(private issuesServices: IssuesService) {

  }

  ngOnInit(): void {
    this.createEstadoCasosChart();
    this.createVariacionMensualChart();
    this.createDistribucionCanalChart();
    this.createEvolucionAcumuladaChart();

    this.issuesServices.getIssuesDasboard('845eb227-5356-4169-9799-95a97ec5ce33').subscribe((response)=>{console.log(response)});
  }

  createEstadoCasosChart() {
    const ctx = document.getElementById('estadoCasosChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Registrados', 'Cerrados', 'En curso'],
        datasets: [{
          data: [60, 30, 10],
          backgroundColor: ['#090041', '#272860', '#6563ff']
        }]
      }
    });
  }

  createVariacionMensualChart() {
    const ctx = document.getElementById('variacionMensualChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          { label: 'Registrados', data: [10, 20, 30, -10, 50], borderColor: '#090041' },
          { label: 'Cerrados', data: [5, -10, 20, 40, 10], borderColor: '#272860' },
          { label: 'En curso', data: [-10, 15, 0, 20, 30], borderColor: '#6563ff' }
        ]
      }
    });
  }

  createDistribucionCanalChart() {
    const ctx = document.getElementById('distribucionCanalChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          { label: 'Llamada', data: [60, 50, 70, 60, 80, 70], backgroundColor: '#090041' },
          { label: 'Correo', data: [10, 15, 20, 10, 5, 15], backgroundColor: '#272860' },
          { label: 'Chatbot', data: [5, 10, 20, 30, 40, 30], backgroundColor: '#6563ff' }
        ]
      }
    });
  }

  createEvolucionAcumuladaChart() {
    const ctx = document.getElementById('evolucionAcumuladaChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
          { label: 'Llamada', data: [60, 110, 180, 240, 320, 390], backgroundColor: '#090041', fill: true },
          { label: 'Correo', data: [10, 25, 45, 55, 60, 75], backgroundColor: '#272860', fill: true },
          { label: 'Chatbot', data: [5, 15, 35, 65, 105, 135], backgroundColor: '#6563ff', fill: true }
        ]
      }
    });
  }
}
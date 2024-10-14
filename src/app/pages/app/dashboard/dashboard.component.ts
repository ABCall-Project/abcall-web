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

  constructor() {}

  ngOnInit(): void {
    this.createEstadoCasosChart();
    this.createVariacionMensualChart();
    this.createDistribucionCanalChart();
    this.createEvolucionAcumuladaChart();
  }

  createEstadoCasosChart() {
    const ctx = document.getElementById('estadoCasosChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Registrados', 'Cerrados', 'En curso'],
        datasets: [{
          data: [60, 30, 10],
          backgroundColor: ['#3f51b5', '#6200ea', '#00bcd4']
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
          { label: 'Registrados', data: [10, 20, 30, -10, 50], borderColor: '#3f51b5' },
          { label: 'Cerrados', data: [5, -10, 20, 40, 10], borderColor: '#6200ea' },
          { label: 'En curso', data: [-10, 15, 0, 20, 30], borderColor: '#00bcd4' }
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
          { label: 'Llamada', data: [60, 50, 70, 60, 80, 70], backgroundColor: '#3f51b5' },
          { label: 'Correo', data: [10, 15, 20, 10, 5, 15], backgroundColor: '#6200ea' },
          { label: 'Chatbot', data: [5, 10, 20, 30, 40, 30], backgroundColor: '#00bcd4' }
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
          { label: 'Llamada', data: [60, 110, 180, 240, 320, 390], backgroundColor: '#3f51b5', fill: true },
          { label: 'Correo', data: [10, 25, 45, 55, 60, 75], backgroundColor: '#6200ea', fill: true },
          { label: 'Chatbot', data: [5, 15, 35, 65, 105, 135], backgroundColor: '#00bcd4', fill: true }
        ]
      }
    });
  }
}
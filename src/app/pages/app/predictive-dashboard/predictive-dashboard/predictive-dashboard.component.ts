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
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../../environments/environment';
import { Issue } from 'src/app/models/issue/issue';

@Component({
  selector: 'app-predictive-dashboard',
  standalone: true,
  templateUrl: './predictive-dashboard.component.html',
  styleUrls: ['./predictive-dashboard.component.scss'],
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
export class PredictiveDashboardComponent {

  selectedIssueType: string | null = null;
  selectedWeekDay: string|null=null;
  topIssueList: Array<Issue> = [];


  constructor(private issuesServices: IssuesService) {}
  

  ngOnInit(): void {
    this.renderCharts();
    this.getTopSevenIssues();
  }

  getTopSevenIssues(){
    this.issuesServices.getTopSevenIssues().subscribe((issues) =>{
      this.topIssueList=issues;
    });
  }

  renderCharts(){
    console.log(this.selectedWeekDay);
    //issues by day
    const realDatabyDay = [5, 8, 10, 6, 7, 4, 3]; 
    const predictedDatabyDay = [4, 7, 9, 6, 6, 5, 4]; 
    this.createChartIssuesByDay(realDatabyDay, predictedDatabyDay,this.selectedWeekDay || '');
    //issues by type
    const realDataIssuesType = [5, 8, 10, 6, 7, 4, 13]; 
    const predictedDataIssuesType = [4, 7, 9, 6, 50, 5, 14]; 
    this.createChartWaitingTime(realDataIssuesType, predictedDataIssuesType);

    //issues probability
    const issueTypes = ['Falla Técnica', 'Error Humano', 'Interrupción', 'Incidente de Seguridad','Fallo en la red','Fallo sistema operativo', 'Otro'];
    const issueQuantity = [12, 8, 5, 15, 3,3,5]; 
    this.createProbabilityChart(issueTypes,issueQuantity);

  }

 

  resetForm() {
    this.selectedIssueType=null;
    this.selectedWeekDay=null;
    this.renderCharts();
  }

  OnSelectionIssueType(event: MatSelectChange) {
    this.selectedIssueType = event.value;
    this.renderCharts();
   
  }

  OnSelectionWeekDay(event: MatSelectChange) {
    this.selectedWeekDay = event.value;
    this.renderCharts();
   
  }

  createChartIssuesByDay(realData: number[], predictedData: number[], selectedDay?: string): void {
    const ctx = document.getElementById('quantityIssues') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);
  
    if (existingChart) {
      existingChart.destroy();
    }
  
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    let filteredLabels = daysOfWeek;
    let filteredRealData = realData;
    let filteredPredictedData = predictedData;

    if (selectedDay) {

      const dayIndex = daysOfWeek.indexOf(selectedDay);
      if (dayIndex !== -1) {
        filteredLabels = [daysOfWeek[dayIndex]];
        filteredRealData = [realData[dayIndex]];
        filteredPredictedData = [predictedData[dayIndex]];
      }
    }
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: filteredLabels, // Etiquetas filtradas
        datasets: [
          {
            label: 'Incidentes Reales',
            data: filteredRealData, // Datos reales filtrados
            borderColor: '#090041',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Incidentes Predichos',
            data: filteredPredictedData, // Datos predichos filtrados
            borderColor: '#6563ff',
            fill: false,
            tension: 0.4,
            borderDash: [5, 5] // Línea punteada
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: selectedDay ? `Día: ${selectedDay}` : 'Días de la Semana' // Cambiar título del eje X según el filtro
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cantidad de Incidentes'
            },
            beginAtZero: true
          }
        }
      }
    });
  }


  createChartWaitingTime(realData: number[], predictedData: number[]): void {
    const ctx = document.getElementById('waitingTime') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);
  
    if (existingChart) {
      existingChart.destroy();
    }
  
    const daysOfWeek = ['Falla Técnica', 'Error Humano', 'Interrupción', 'Incidente de Seguridad','Fallo en la red','Fallo sistema operativo', 'Otro'];
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: daysOfWeek,
        datasets: [
          {
            label: 'Incidentes Reales',
            data: realData,
            borderColor: '#090041',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Incidentes Predichos',
            data: predictedData,
            borderColor: '#6563ff',
            fill: false,
            tension: 0.4,
            borderDash: [5, 5] 
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tipos de incidentes'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cantidad de Incidentes'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
  

  createProbabilityChart(labels: string[], data: number[]): void {
    const ctx = document.getElementById('probability') as HTMLCanvasElement;
    const existingChart = Chart.getChart(ctx);
  
    if (existingChart) {
      existingChart.destroy();
    }
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, 
        datasets: [{
          label: 'Cantidad de Incidentes',
          data: data, 
          backgroundColor: [
            '#090041',
            '#272860',
            '#6563ff',
            '#9b9bff',
            '#c3c3ff'
          ],
          borderColor: '#000000',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tipos de Incidentes'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cantidad de Incidentes'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
  

}

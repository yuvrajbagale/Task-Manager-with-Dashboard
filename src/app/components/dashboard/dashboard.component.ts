import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Chart, registerables } from 'chart.js';
import { selectDashboardStats, selectAllTasks } from '../../store/task.selectors';
import { loadTasks } from '../../store/task.actions';
import { Subscription } from 'rxjs';
import { Task } from '../../models/task.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('statusChart') statusChartRef!: ElementRef;
  @ViewChild('priorityChart') priorityChartRef!: ElementRef;
  @ViewChild('trendChart') trendChartRef!: ElementRef;

  private store = inject(Store);

  stats$ = this.store.select(selectDashboardStats);
  tasks$ = this.store.select(selectAllTasks);

  statusChart: Chart | null = null;
  priorityChart: Chart | null = null;
  trendChart: Chart | null = null;
  stats: any = {};

  private sub!: Subscription;
  private taskSub!: Subscription;

  ngOnInit() {
    this.store.dispatch(loadTasks());

    this.sub = this.stats$.subscribe(s => {
      this.stats = s;
      this.updateStatusChart();
    });

    this.taskSub = this.tasks$.subscribe((tasks: Task[]) => {
      this.updatePriorityChart(tasks);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initCharts(), 100);
  }

  initCharts() {
    this.statusChart = new Chart(this.statusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'In Progress', 'Completed', 'Overdue'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    this.priorityChart = new Chart(this.priorityChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
          label: 'Tasks by Priority',
          data: [0, 0, 0],
          backgroundColor: ['#34d399', '#fbbf24', '#f87171'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });

    this.trendChart = new Chart(this.trendChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Completed',
            data: [2, 4, 3, 5, 6, 4, 7],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Added',
            data: [3, 5, 4, 6, 5, 3, 8],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });

    this.updateStatusChart();
  }

  updateStatusChart() {
    if (this.statusChart && this.stats) {
      this.statusChart.data.datasets[0].data = [
        this.stats.pending || 0,
        this.stats.inProgress || 0,
        this.stats.completed || 0,
        this.stats.overdue || 0
      ];
      this.statusChart.update();
    }
  }

  updatePriorityChart(tasks: Task[]) {
    if (this.priorityChart) {
      this.priorityChart.data.datasets[0].data = [
        tasks.filter(t => t.priority === 'low').length,
        tasks.filter(t => t.priority === 'medium').length,
        tasks.filter(t => t.priority === 'high').length
      ];
      this.priorityChart.update();
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.taskSub?.unsubscribe();
    this.statusChart?.destroy();
    this.priorityChart?.destroy();
    this.trendChart?.destroy();
  }
}

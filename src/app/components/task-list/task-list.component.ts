import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Task } from '../../models/task.model';
import { selectAllTasks, selectLoading } from '../../store/task.selectors';
import { loadTasks, addTask, updateTask, deleteTask } from '../../store/task.actions';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  private store = inject(Store);

  tasks$ = this.store.select(selectAllTasks);
  loading$ = this.store.select(selectLoading);

  showForm = false;
  editingTask: Task | null = null;
  filterStatus = 'all';
  filterPriority = 'all';
  searchText = '';

  ngOnInit() {
    this.store.dispatch(loadTasks());
  }

  openAddForm() {
    this.editingTask = null;
    this.showForm = true;
  }

  openEditForm(task: Task) {
    this.editingTask = { ...task };
    this.showForm = true;
  }

  onSave(task: Task) {
    if (this.editingTask) {
      this.store.dispatch(updateTask({ task }));
    } else {
      this.store.dispatch(addTask({ task }));
    }
    this.showForm = false;
  }

  onDelete(id: string) {
    if (confirm('Delete this task?')) {
      this.store.dispatch(deleteTask({ id }));
    }
  }

  filterTasks(tasks: Task[]): Task[] {
    return tasks.filter(t => {
      const s = this.filterStatus === 'all' || t.status === this.filterStatus;
      const p = this.filterPriority === 'all' || t.priority === this.filterPriority;
      const q = t.title.toLowerCase().includes(this.searchText.toLowerCase());
      return s && p && q;
    });
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return classes[priority] || '';
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700'
    };
    return classes[status] || '';
  }
}

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');
export const selectAllTasks = createSelector(selectTaskState, s => s.tasks);
export const selectLoading = createSelector(selectTaskState, s => s.loading);

export const selectDashboardStats = createSelector(selectAllTasks, tasks => ({
  total: tasks.length,
  pending: tasks.filter(t => t.status === 'pending').length,
  inProgress: tasks.filter(t => t.status === 'in-progress').length,
  completed: tasks.filter(t => t.status === 'completed').length,
  overdue: tasks.filter(t => t.status === 'overdue').length,
}));

import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import * as TaskActions from './task.actions';

export const loadTasksEffect = createEffect(
  (actions$ = inject(Actions), taskService = inject(TaskService)) =>
    actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() => taskService.getTasks().pipe(
        map(tasks => TaskActions.loadTasksSuccess({ tasks })),
        catchError(err => of(TaskActions.loadTasksFailure({ error: err.message })))
      ))
    ),
  { functional: true }
);

export const addTaskEffect = createEffect(
  (actions$ = inject(Actions), taskService = inject(TaskService)) =>
    actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(({ task }) => taskService.addTask(task).pipe(
        map(t => TaskActions.addTaskSuccess({ task: t })),
        catchError(err => of(TaskActions.loadTasksFailure({ error: err.message })))
      ))
    ),
  { functional: true }
);

export const updateTaskEffect = createEffect(
  (actions$ = inject(Actions), taskService = inject(TaskService)) =>
    actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ task }) => taskService.updateTask(task).pipe(
        map(t => TaskActions.updateTaskSuccess({ task: t })),
        catchError(err => of(TaskActions.loadTasksFailure({ error: err.message })))
      ))
    ),
  { functional: true }
);

export const deleteTaskEffect = createEffect(
  (actions$ = inject(Actions), taskService = inject(TaskService)) =>
    actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) => taskService.deleteTask(id).pipe(
        map(() => TaskActions.deleteTaskSuccess({ id })),
        catchError(err => of(TaskActions.loadTasksFailure({ error: err.message })))
      ))
    ),
  { functional: true }
);

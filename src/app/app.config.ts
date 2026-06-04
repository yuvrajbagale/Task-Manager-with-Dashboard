import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { taskReducer } from './store/task.reducer';
import * as TaskEffects from './store/task.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ tasks: taskReducer }),
    provideEffects({
      ...TaskEffects
    }),
    provideStoreDevtools({ maxAge: 25 })
  ]
};

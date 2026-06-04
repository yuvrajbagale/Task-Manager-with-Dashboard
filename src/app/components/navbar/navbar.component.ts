import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div class="flex items-center gap-3">
        <span class="text-2xl">✅</span>
        <span class="text-xl font-bold tracking-wide">TaskFlow</span>
      </div>
      <div class="flex gap-6 text-sm font-medium">
        <a routerLink="/dashboard" routerLinkActive="underline"
           class="hover:text-indigo-200 transition">Dashboard</a>
        <a routerLink="/tasks" routerLinkActive="underline"
           class="hover:text-indigo-200 transition">Tasks</a>
      </div>
    </nav>
  `
})
export class NavbarComponent {}

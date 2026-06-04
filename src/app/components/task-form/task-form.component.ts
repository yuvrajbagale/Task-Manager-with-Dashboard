import { Component, Output, EventEmitter, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  @Input() editTask: Task | null = null;
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  task: Partial<Task> = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  };

  ngOnInit() {
    if (this.editTask) {
      this.task = { ...this.editTask };
    }
  }

  onSubmit() {
    const newTask: Task = {
      id: this.editTask?.id || uuidv4(),
      title: this.task.title!,
      description: this.task.description || '',
      status: this.task.status as TaskStatus,
      priority: this.task.priority as TaskPriority,
      dueDate: this.task.dueDate || '',
      createdAt: this.editTask?.createdAt || new Date().toISOString()
    };
    this.save.emit(newTask);
  }
}

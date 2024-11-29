import { Component, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectionList } from '@angular/material/list';
import { TodosStore } from '../../store/todo.store';

@Component({
  selector: 'todos-list',
  standalone: true,
  imports: [MatFormField, MatInputModule, MatIconModule, MatSelectionList],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss',
})
export class TodosListComponent {
  store = inject(TodosStore)
}
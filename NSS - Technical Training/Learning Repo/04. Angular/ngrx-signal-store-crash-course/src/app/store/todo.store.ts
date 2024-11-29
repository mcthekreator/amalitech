import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Todo } from '../model/todo.model';
import { TodosService } from '../services/todos.service';
import { inject } from '@angular/core';

export type TodosFilter = 'all' | 'pending' | 'complete';

type TodosState = {
  todos: Todo[];
  loading: boolean;
  filter: TodosFilter;
};

const initialState: TodosState = {
  todos: [],
  loading: false,
  filter: 'all',
};

export const TodosStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, todoService = inject(TodosService)) => ({
    async loadAll() {
      patchState(store, { loading: true });
      const todos = await todoService.getTodos();
      patchState(store, { todos, loading: false });
    },
  }))
);


 






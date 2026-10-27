// ---- State ----
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentFilter = 'all';

// ---- DOM refs ----
const form       = document.getElementById('todo-form');
const input      = document.getElementById('todo-input');
const list       = document.getElementById('todo-list');
const itemsLeft  = document.getElementById('items-left');
const clearBtn   = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// ---- Helpers ----
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getFiltered() {
  if (currentFilter === 'active')    return todos.filter(t => !t.completed);
  if (currentFilter === 'completed') return todos.filter(t =>  t.completed);
  return todos;
}

function render() {
  const filtered = getFiltered();
  list.innerHTML = '';

  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty-state">No todos here yet ✨</li>`;
  } else {
    filtered.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.completed ? ' completed' : '');
      li.dataset.id = todo.id;

      li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}
               aria-label="Mark as ${todo.completed ? 'incomplete' : 'complete'}" />
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="delete-btn" aria-label="Delete todo">✕</button>
      `;

      list.appendChild(li);
    });
  }

  const active = todos.filter(t => !t.completed).length;
  itemsLeft.textContent = `${active} item${active !== 1 ? 's' : ''} left`;

  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ---- Event listeners ----

// Add todo
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: Date.now(), text, completed: false });
  saveTodos();
  render();
  input.value = '';
  input.focus();
});

// Toggle / delete via event delegation
list.addEventListener('click', e => {
  const item = e.target.closest('.todo-item');
  if (!item) return;
  const id = Number(item.dataset.id);

  if (e.target.classList.contains('todo-checkbox')) {
    const todo = todos.find(t => t.id === id);
    if (todo) { todo.completed = e.target.checked; saveTodos(); render(); }
  }

  if (e.target.classList.contains('delete-btn')) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
  }
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Clear completed
clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  render();
});

// ---- Initial render ----
render();

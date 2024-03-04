const tbody = document.querySelector('tbody');
const addForm = document.querySelector('.add-form')
const inputText = document.querySelector('.input-task')

const fetchTasks = async () => {
    const response = await fetch('http://localhost:3333/task');
    const tasks = await response.json();
    return tasks;
};

const addTask = async (event) => {
    event.preventDefault()

    const task = { title: inputText.value }

    await fetch('http://localhost:3333/task', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    })


    loadTasks()
    inputText.value = ""
}

const deleteTask = async (id) => {
    await fetch(`http://localhost:3333/task/${id}`, {
        method: 'delete'
    })

    loadTasks();
}

const updateTask = async ({ id, title, status }) => {
    await fetch(`http://localhost:3333/task/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'put',
        body: JSON.stringify({ title, status })
    })

    loadTasks();
}

const createElement = (tag, innerText = "", innerHTML = "") => {
    const element = document.createElement(tag);
    if (innerHTML) {
        element.innerHTML = innerHTML
    }
    if (innerText) {
        element.innerText = innerText
    }
    return element
};

const createSelect = (value) => {
    const options = `<option value="Pendente">Pendente</option>
    <option value="Em Andamento">Em andamento</option>
    <option value="Finalizado">Finalizado</option>`

    const select = createElement('select', "", options);
    select.value = value;

    return select
}

const createRow = (task) => {
    const { id, title, created_at, status } = task;

    const tr = createElement('tr');
    const tdTitle = createElement('td', title);
    const tdCreatedAt = createElement('td', formatDate(created_at));
    const tdStatus = createElement('td');
    const tdActions = createElement('td');

    const editButton = createElement('button', '', '<span class="material-symbols-outlined"> edit </span>');
    const excludeButton = createElement('button', '', '<span class="material-symbols-outlined"> delete </span>');

    const editForm = createElement('form');
    const editInput = createElement('input');

    editInput.value = title;
    editForm.appendChild(editInput);

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        updateTask({
            id,
            title: editInput.value,
            status
        })
    })

    editButton.addEventListener('click', () => {
        tdTitle.innerText = ""
        tdTitle.appendChild(editForm)
    })

    const select = createSelect(status);

    select.addEventListener('change', ({ target }) => updateTask({ ...task, status: target.value }))

    editButton.classList.add('btn-action')
    excludeButton.classList.add('btn-action')

    excludeButton.addEventListener('click', () =>
        deleteTask(id))

    tdStatus.appendChild(select)

    tdActions.appendChild(editButton);
    tdActions.appendChild(excludeButton);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCreatedAt);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    tbody.appendChild(tr)

    return tr;
};

const loadTasks = async () => {
    const tasks = await fetchTasks();

    tbody.innerHTML = "";

    tasks.forEach((task) => {
        const tr = createRow(task);
        tbody.appendChild(tr);
    });
}

const formatDate = (dateUTC) => {
    const options = { dateStyle: 'long', timeStyle: 'short' }
    const date = new Date(dateUTC).toLocaleString('pt-br', options)
    return date;
}

addForm.addEventListener('submit', addTask);

loadTasks();


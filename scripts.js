function addTask(period) {
    const inputElement = document.getElementById(`new-${period}-task`);
    const listElement = document.getElementById(`${period}-tasks`);
    const priorityElement = document.getElementById(`${period}-priority`);

    if (priorityElement.value === "" || inputElement.value.trim() === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    const newTask = document.createElement("li");
    newTask.className = "task";
    newTask.innerHTML = `
        <span class="priority ${priorityElement.value}"></span>
        <span class="task-name">${inputElement.value}</span>
        <i class="fas fa-edit fa-xs edit-icon" onclick="editTask(event)"></i>
        <i class="fas fa-trash fa-xs trash-icon-red" onclick="confirmDelete(event)"></i>
    `;
    listElement.appendChild(newTask);

    saveTaskToLocalStorage(period, {
        name: inputElement.value,
        priority: priorityElement.value
    });

    inputElement.value = "";
    priorityElement.value = "";
}

function editTask(event) {
    const taskElement = event.target.parentElement;
    const taskNameSpan = taskElement.querySelector(".task-name");
    const prioritySpan = taskElement.querySelector(".priority");

    const newName = prompt("Digite o novo nome da tarefa:", taskNameSpan.textContent);
    if (newName !== null) {
        let newPriority = prompt("Digite a nova prioridade (baixa, média, alta):");
        newPriority = newPriority.toLowerCase();

    
        if (newPriority !== null && ["baixa", "média", "alta"].includes(newPriority)) {
            newPriority = newPriority === "baixa" ? "low" : newPriority === "média" ? "medium" : "high";
            taskNameSpan.textContent = newName;
            prioritySpan.className = `priority ${newPriority}`;
            const period = taskElement.parentElement.id.split("-")[0];
            updateTaskInLocalStorage(period, taskNameSpan.textContent, newPriority);
        } else {
            alert("Prioridade errada. Use 'baixa', 'média' ou 'alta'.");
        }
    }
}

function confirmDelete(event) {
    const confirmation = confirm("Tem certeza de que deseja excluir esta tarefa?");
    if (confirmation) {
        const taskElement = event.target.parentElement;
        const period = taskElement.parentElement.id.split("-")[0];
        const taskName = taskElement.querySelector(".task-name").textContent;
        removeTaskFromLocalStorage(period, taskName);

        taskElement.remove();
    }
}

function saveTaskToLocalStorage(period, task) {
    let tasks = JSON.parse(localStorage.getItem(period)) || [];
    tasks.push(task);
    localStorage.setItem(period, JSON.stringify(tasks));
}

function updateTaskInLocalStorage(period, taskName, newPriority) {
    let tasks = JSON.parse(localStorage.getItem(period)) || [];
    tasks.forEach(task => {
        if (task.name === taskName) {
            task.priority = newPriority;
        }
    });
    localStorage.setItem(period, JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(period, taskName) {
    let tasks = JSON.parse(localStorage.getItem(period)) || [];
    tasks = tasks.filter(task => task.name !== taskName);
    localStorage.setItem(period, JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", () => {
    loadTasksFromLocalStorage("dia");
    loadTasksFromLocalStorage("noite");
});

function loadTasksFromLocalStorage(period) {
    const tasks = JSON.parse(localStorage.getItem(period));

    if (tasks !== null) {
        tasks.forEach(task => {
            const listElement = document.getElementById(`${period}-tasks`);

            const newTask = document.createElement("li");
            newTask.className = "task";
            newTask.innerHTML = `
                <span class="priority ${task.priority}"></span>
                <span class="task-name">${task.name}</span>
                <i class="fas fa-edit fa-xs edit-icon" onclick="editTask(event)"></i>
                <i class="fas fa-trash fa-xs trash-icon-red" onclick="confirmDelete(event)"></i>
            `;
            listElement.appendChild(newTask);
        });
    }
}

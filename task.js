const allTasks = document.getElementById('all-tasks');
const add = document.getElementById('add');

// Load saved tasks
let alTasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Display function
const displayTasks = () => {
    allTasks.innerHTML = "";

    if (alTasks.length === 0) {
        allTasks.innerHTML = `
            <p class="text-center text-muted mt-3">No tasks yet 😌</p>
        `;
        return;
    }

    alTasks.forEach((task, index) => {
        const div = document.createElement("div");

        div.className = `card p-3 mb-3 shadow-sm border-0 ${
            task.completed ? "bg-light opacity-75" : ""
        }`;

        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                
                <div>
                    <h6 class="mb-1 ${task.completed ? "text-decoration-line-through text-muted" : ""}">
                        ${task.task}
                    </h6>

                    <small class="text-muted">
                        📅 ${task.date || "No date"} |
                        ⏰ ${task.time || "No time"}
                    </small><br>

                    <span class="badge ${
                        task.duration === "Daily" ? "bg-primary" :
                        task.duration === "Weekly" ? "bg-success" :
                        task.duration === "Monthly" ? "bg-warning text-dark" :
                        "bg-secondary"
                    } mt-1">
                        ${task.duration || "No duration"}
                    </span>
                </div>

                <div class="d-flex gap-2">
                    ${
                        !task.completed
                        ? `<button class="btn btn-sm btn-success complete" data-index="${index}">
                            <i class="fas fa-check"></i>
                           </button>`
                        : ""
                    }

                    <button class="btn btn-sm btn-outline-danger del" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>

            </div>
        `;

        allTasks.appendChild(div);
    });
};

// Show tasks on load
displayTasks();

// Add new task
add.addEventListener('click', () => {
    const task = document.getElementById('task').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const duration = document.getElementById('duration').value;

    if (task.trim() === "") return;

    alTasks.push({ task, date, time, duration, alerted: false, completed: false });
    localStorage.setItem('tasks', JSON.stringify(alTasks));
    displayTasks();

    document.getElementById('task').value = "";
    document.getElementById('date').value = "";
    document.getElementById('time').value = "";
    document.getElementById('duration').selectedIndex = 0;
});

// Event delegation for delete and complete buttons
allTasks.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const index = btn.dataset.index;

    if (btn.classList.contains('del')) {
        alTasks.splice(index, 1); // remove task
        localStorage.setItem('tasks', JSON.stringify(alTasks));
        displayTasks();
    }

    if (btn.classList.contains('complete')) {
        alTasks[index].completed = true; // mark as completed
        localStorage.setItem('tasks', JSON.stringify(alTasks));
        displayTasks();
        alert(`✅ Task completed: ${alTasks[index].task}`);
    }
});

// Alarm sound
const alarmSound = new Audio("fire_alarm.mp3");
let audioUnlocked = false;

document.body.addEventListener('click', () => {
    if (!audioUnlocked) {
        alarmSound.play()
            .then(() => {
                alarmSound.pause();
                alarmSound.currentTime = 0;
                audioUnlocked = true;
                console.log("Audio unlocked ✅");
            })
            .catch(() => {});
    }
});

// Alarm checker
const checkAlarm = () => {
    const now = new Date();

    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');

    const currentTime = `${currentHours}:${currentMinutes}`;

    alTasks.forEach(item => {
        if (item.alerted === undefined) item.alerted = false;

        if (item.time === currentTime && !item.alerted) {
            console.log("ALARM TRIGGERED 🔔");

            alarmSound.currentTime = 0;
            alarmSound.play()
                .then(() => console.log("Playing sound ✅"))
                .catch(err => console.log("Audio blocked ❌", err));

            item.alerted = true;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(alTasks));
};

// Check every second
setInterval(checkAlarm, 1000);
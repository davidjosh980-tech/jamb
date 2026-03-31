const allTasks = document.getElementById('all-tasks');
const add = document.getElementById('add');

// Load saved tasks
let alTasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Display function
const displayTasks = () => {
    let html = "";
    alTasks.forEach((item, index) => {
        html += `
            <div class="text-primary p-2 m-2 rounded" style="${item.completed ? 'text-decoration: line-through; opacity:0.6;' : ''}">
                <strong>${item.task}</strong><br>
                ${item.date} | ${item.time} | ${item.duration}
                <button class="del btn btn-danger text-white ms-2" data-index="${index}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <button class="complete btn btn-success ms-2" data-index="${index}">
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
        `;
    });
    allTasks.innerHTML = html;
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
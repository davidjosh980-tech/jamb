const allTasks = document.getElementById('all-tasks');
const add = document.getElementById('add');

// load saved tasks
const alTasks = JSON.parse(localStorage.getItem('tasks')) || [];

// display function
const displayTasks = () => {
    let html = "";

    alTasks.forEach(item => {
        html += `
            <div class="text-primary p-2 m-2 rounded">
                <strong>${item.task}</strong><br>
                ${item.date} | ${item.time} | ${item.duration}
                <button class="del btn btn-danger text-white ms-2">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <button class="complete btn btn-success ms-2">
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
        `;
    });

    allTasks.innerHTML = html;
};

// show tasks on load
displayTasks();

// add new task
add.addEventListener('click', () => {
    const task = document.getElementById('task').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const duration = document.getElementById('duration').value;

    if (task.trim() === "") return;

    // ✅ FIX: add alerted flag
    alTasks.push({ task, date, time, duration, alerted: false });

    localStorage.setItem('tasks', JSON.stringify(alTasks));

    displayTasks();
});

// alarm sound
const alarmSound = new Audio("fire_alarm.mp3");

// ✅ IMPORTANT: unlock audio properly
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

// alarm checker
const checkAlarm = () => {
    const now = new Date();

    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');

    const currentTime = `${currentHours}:${currentMinutes}`;

    alTasks.forEach(item => {

        // ✅ FIX: make sure alerted exists
        if (item.alerted === undefined) item.alerted = false;

        if (item.time === currentTime && !item.alerted) {

            console.log("ALARM TRIGGERED 🔔");

            alarmSound.currentTime = 0;

            alarmSound.play()
                .then(() => {
                    console.log("Playing sound ✅");
                })
                .catch(err => {
                    console.log("Audio blocked ❌", err);
                });

            item.alerted = true;
        }
    });

    localStorage.setItem('tasks', JSON.stringify(alTasks));
};

// check every second
setInterval(checkAlarm, 1000);
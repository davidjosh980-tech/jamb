const dailyTasksContainer = document.getElementById('comp-tasks');

// Function to render daily tasks
const renderDailyTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let html = "";

    tasks.forEach((item, index) => {
        if (item.duration === "monthly" || item.duration === "daily" || item.duration === "weekly" ) {
            html += `
                <div class="text-primary p-2 m-2 rounded">
                    <strong>${item.task}</strong><br>
                    ${item.date} | ${item.time} | ${item.duration}
                </div>
            `;
        }
    });

    dailyTasksContainer.innerHTML = html;
};

// Initial render
renderDailyTasks();

// Event delegation for delete and complete buttons
dailyTasksContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const index = btn.dataset.index;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (btn.classList.contains('del')) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderDailyTasks();
    }

    if (btn.classList.contains('complete')) {
        alert(`✅ Task completed: ${tasks[index].task}`);
    }
});
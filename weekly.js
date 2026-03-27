const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let html = "";

tasks.forEach(item => {
    if (item.duration === "weekly") {
        html += `
            <div class="bg-dark text-white p-2 m-2 d-flex flex-row align-items-center rounded">
                <strong>${item.task}</strong>
                ${item.date} | ${item.time}
                <div style="margin-right: 10px;">
                    <button class="del btn btn-danger text-white ms-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <button class="complete btn btn-success ms-2">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </div>
        `;
    }
});

document.getElementById('weekly-tasks').innerHTML = html;



  document.getElementById("taskForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const member = document.getElementById("member").value;
    const task = document.getElementById("task").value;
    const dueDate = document.getElementById("due-date").value;
  
    const taskId = new Date().getTime().toString();
    addTask(taskId, member, task, dueDate);
    addTaskToCalendar(taskId, member, task, dueDate);
    saveTasksToLocalStorage(); // Add this line
    clearForm();
  });


function clearForm() {
  document.getElementById("member").value = "";
  document.getElementById("task").value = "";
  document.getElementById("due-date").value = "";
}

function calculateRemainingTime(deadline) {
  // ...
}

// 残り時間を表示する関数
function displayRemainingTime(remainingTime, countdownElement) {
  // 残り時間を適切な形式に変換して表示
  // 例: カウントダウンタイマーや進捗バーの更新
  countdownElement.textContent = `残り時間: ${remainingTime}`;
}

// 残り時間を定期的に更新する関数
function updateRemainingTime(deadline, countdownElement) {
  setInterval(() => {
    const remainingTime = calculateRemainingTime(deadline);
    displayRemainingTime(remainingTime, countdownElement);
  }, 1000); // 1000ミリ秒ごとに更新
}

function addTask(taskId, member, task, dueDate) {
  const taskContainer = document.createElement("div");
  taskContainer.className = "task";
  taskContainer.id = taskId;

  const taskDetails = document.createElement("div");
  taskDetails.innerHTML = `<p><strong>メンバー:</strong> ${member}</p><p><strong>タスク:</strong> ${task}</p><p><strong>期日:</strong> ${dueDate}</p>`;
  taskContainer.appendChild(taskDetails);

  // メンバーの色を取得し、タスク要素に適用
  const memberColor = getColorForMember(member);
  taskDetails.style.color = memberColor;

  const countdown = document.createElement("p");
  countdown.className = "countdown";
  const countdownLabel = document.createElement("span");
  countdownLabel.className = "countdown-label";
  countdownLabel.textContent = "残り時間:";
  const countdownValue = document.createElement("span");
  countdown.appendChild(countdownValue);
  countdown.appendChild(countdownLabel);
  taskDetails.appendChild(countdown);

  // 期日までの残り時間を表示
  const remainingTime = calculateRemainingTime(new Date(dueDate));
  displayRemainingTime(remainingTime, countdown);
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "削除";


  // 期日までの残り時間を定期的に更新
  updateRemainingTime(new Date(dueDate), countdownValue);

    deleteButton.addEventListener("click", function () {
      taskContainer.remove();
      deleteTaskFromCalendar(taskId);
      saveTasksToLocalStorage(); // Add this line
  });

  taskContainer.appendChild(deleteButton);
  document.getElementById("tasks-container").appendChild(taskContainer);
}

function addTaskToCalendar(taskId, member, task, dueDate) {
  const calendar = document.getElementById("calendar");

  const dueDateObj = new Date(dueDate);
  const year = dueDateObj.getFullYear();
  const month = dueDateObj.getMonth();

  if (!calendar.querySelector(`.calendar-table[data-year="${year}"][data-month="${month}"]`)) {
    createCalendarTable(year, month);
  }

  const calendarTable = calendar.querySelector(`.calendar-table[data-year="${year}"][data-month="${month}"]`);
  const cell = calendarTable.querySelector(`.day[data-date="${dueDate}"]`);

  const taskElement = document.createElement("p");
  taskElement.textContent = `${member}: ${task}`;
  taskElement.dataset.taskId = taskId;

  // メンバーの色を取得し、タスク要素に適用
  const memberColor = getColorForMember(member);
  taskElement.style.color = memberColor;
  


  cell.appendChild(taskElement);
  
  // タスクがあるセルの背景色を設定
  cell.classList.add("has-task");
}


  

function deleteTaskFromCalendar(taskId) {
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskElement) {
    taskElement.remove();
  }
}

function calculateRemainingTime(deadline) {
  const now = new Date();
  const remainingTime = deadline.getTime() - now.getTime();

  if (remainingTime < 0) {
    return "期限切れ";
  }

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  

  return `${days}日 ${hours}時間 ${minutes}分 `;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const memberColors = {};

function getColorForMember(member) {
  if (!memberColors[member]) {
    memberColors[member] = getRandomColor();
    saveMemberColorsToLocalStorage();
  }
  return memberColors[member];
}

function saveMemberColorsToLocalStorage() {
  localStorage.setItem("memberColors", JSON.stringify(memberColors));
}

function loadMemberColorsFromLocalStorage() {
  const storedMemberColors = JSON.parse(localStorage.getItem("memberColors"));
  if (storedMemberColors) {
    for (const member in storedMemberColors) {
      memberColors[member] = storedMemberColors[member];
    }
  }
}

loadMemberColorsFromLocalStorage();


function createCalendarTable(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const calendarTable = document.createElement("table");
  calendarTable.className = "calendar-table";
  calendarTable.dataset.year = year;
  calendarTable.dataset.month = month;

  const caption = document.createElement("caption");
  const monthName = new Intl.DateTimeFormat('ja-JP', { month: 'long' }).format(new Date(year, month));
  caption.textContent = `${year}年 ${monthName}`;
  calendarTable.appendChild(caption);

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  for (const day of days) {
    const th = document.createElement("th");
    th.textContent = day;
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  calendarTable.appendChild(thead);

  const tbody = document.createElement("tbody");
  let trBody = document.createElement("tr");
  for (let i = 0; i < startDay; i++) {
    const td = document.createElement("td");
    trBody.appendChild(td);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    if (trBody.children.length === 7) {
      tbody.appendChild(trBody);
      trBody = document.createElement("tr");
    }
      
    const td = document.createElement("td");
    td.className = "day";
    td.dataset.date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    td.textContent = i;
    if (new Date(year, month, i).getDay() === 6) {
      td.classList.add("saturday");
    } else if (new Date(year, month, i).getDay() === 0) {
      td.classList.add("sunday");
    }

    if (isToday(year, month, i)) {
      td.classList.add("today");
    }

    trBody.appendChild(td);
  }

  tbody.appendChild(trBody);
  calendarTable.appendChild(tbody);
  document.getElementById("calendar").appendChild(calendarTable);
}

function isToday(year, month, day) {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

function saveTasksToLocalStorage() {
  const tasks = [];

  const taskElements = document.querySelectorAll(".task");
  taskElements.forEach((taskElement) => {
    const taskId = taskElement.id;
    const member = taskElement.querySelector("p:nth-child(1)").textContent.replace("メンバー: ", "");
    const task = taskElement.querySelector("p:nth-child(2)").textContent.replace("タスク: ", "");
    const dueDate = taskElement.querySelector("p:nth-child(3)").textContent.replace("期日: ", "");

    tasks.push({ taskId, member, task, dueDate });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (tasks) {
    tasks.forEach((task) => {
      addTask(task.taskId, task.member, task.task, task.dueDate);
      addTaskToCalendar(task.taskId, task.member, task.task, task.dueDate);
    });
  }
}

function toggleLayout() {
  const tasksContainer = document.getElementById("tasks-container");
  tasksContainer.classList.toggle("horizontal-layout");
}

document.getElementById("toggle-layout").addEventListener("click", function () {
  toggleLayout();
});


loadTasksFromLocalStorage();

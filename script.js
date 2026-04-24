const API = "http://localhost:3000/tasks"

async function loadTasks(){

const res = await fetch(API)
const tasks = await res.json()

render(tasks)
}

function render(tasks){

const list = document.getElementById("taskList")
list.innerHTML=""

let completed=0

tasks.forEach(task=>{

if(task.isDone) completed++

let li=document.createElement("li")

if(task.isDone) li.classList.add("completed")

li.innerHTML=`
<div>
<input type="checkbox"
${task.isDone ? "checked":""}
onclick="toggleStatus(${task.id})">

${task.title}

<span class="${task.priority.toLowerCase()}">${task.priority}</span>
</div>

<div>
<button onclick="editTask(${task.id},'${task.title}','${task.priority}')">Edit</button>
<button onclick="deleteTask(${task.id})">Delete</button>
</div>
`

list.appendChild(li)

})

document.getElementById("counter").innerText=
`Completed ${completed} / Total ${tasks.length}`
}

async function addTask(){

const title=document.getElementById("taskInput").value
const priority=document.getElementById("priority").value

if(title==="") return alert("Task cannot be empty")

await fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({title,priority})
})

document.getElementById("taskInput").value=""

loadTasks()
}

async function deleteTask(id){

await fetch(`${API}/${id}`,{
method:"DELETE"
})

loadTasks()
}

async function toggleStatus(id){

await fetch(`${API}/${id}/status`,{
method:"PATCH"
})

loadTasks()
}

async function editTask(id,title,priority){

let newTitle=prompt("Edit task",title)

if(!newTitle) return

await fetch(`${API}/${id}`,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({title:newTitle,priority})
})

loadTasks()
}

async function filterTasks(type){

const res = await fetch(API)
let tasks = await res.json()

if(type==="active")
tasks=tasks.filter(t=>!t.isDone)

if(type==="completed")
tasks=tasks.filter(t=>t.isDone)

render(tasks)
}

loadTasks()

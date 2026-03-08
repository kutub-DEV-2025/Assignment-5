// ==============================
// LOGIN FUNCTION
// ==============================

function login(){

const username = document.getElementById("username").value
const password = document.getElementById("password").value

// simple login check
if(username === "admin" && password === "admin123"){

// login save করা localStorage এ
localStorage.setItem("login",true)

// dashboard page এ redirect
window.location.href="dashboard.html"

}else{

alert("Wrong credentials")

}

}



// ==============================
// TAB CHANGE FUNCTION
// ==============================

function changeTab(btn,type){

// সব tab select
const tabs = document.querySelectorAll(".tab")

// আগের color remove
tabs.forEach(tab=>{
tab.classList.remove(
"bg-blue-700",
"bg-green-500",
"bg-purple-500",
"text-white"
)
})

// active tab color
if(type === "all"){
btn.classList.add("bg-blue-700","text-white")
}

if(type === "open"){
btn.classList.add("bg-green-500","text-white")
}

if(type === "closed"){
btn.classList.add("bg-purple-500","text-white")
}

// issue load
loadIssues(type)

}



// ==============================
// API URL
// ==============================

const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues"

// HTML element select
const container = document.getElementById("issueContainer")
const loader = document.getElementById("loader")



// ==============================
// LOAD ISSUES
// ==============================

async function loadIssues(type){

// loader show
loader.classList.remove("hidden")

try{

const res = await fetch(API)
const data = await res.json()

let issues = data.data

// filter open
if(type === "open"){
issues = issues.filter(issue => issue.status.toLowerCase() === "open")
}

// filter closed
if(type === "closed"){
issues = issues.filter(issue => issue.status.toLowerCase() === "closed")
}

// display card
displayIssues(issues)

}catch(err){

console.log("API error:",err)

}

// loader hide
loader.classList.add("hidden")

}



// ==============================
// ISSUE COUNT UPDATE
// ==============================

function updateCounts(issues){

const all = issues.length
const open = issues.filter(i => i.status.toLowerCase() === "open").length
const closed = issues.filter(i => i.status.toLowerCase() === "closed").length

const allEl = document.getElementById("allCount")
const openEl = document.getElementById("openCount")
const closedEl = document.getElementById("closedCount")

if(allEl) allEl.innerText = all
if(openEl) openEl.innerText = open
if(closedEl) closedEl.innerText = closed

}



// ==============================
// DISPLAY ISSUES
// ==============================

function displayIssues(issues){

  if(!container) return

  container.innerHTML=""

  issues.forEach(issue=>{

    // ============================
    // STATUS ICON
    // ============================
    let statusIcon = "./assets/Open-Status.png"
    if(issue.status.toLowerCase() === "closed"){
      statusIcon = "./assets/Closed- Status .png"
    }

    const borderColor =
      issue.status.toLowerCase() === "open"
      ? "border-green-500"
      : "border-purple-500"


    let priorityColor = ""

    if(issue.priority === "high"){
      priorityColor = "bg-red-100 text-red-500"
    }
    else if(issue.priority === "medium"){
      priorityColor = "bg-yellow-100 text-yellow-600"
    }
    else{
      priorityColor = "bg-gray-200 text-gray-600"
    }


    // ===== label fix =====
    let labelsHTML = ""
    if(issue.labels && issue.labels.length > 0){
      issue.labels.forEach(label=>{
        labelsHTML += `
          <span class="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-500">
            ${label}
          </span>
        `
      })
    }

    // ===== category =====
    const categoryHTML = issue.category ? `
      <span class="px-3 py-1 text-xs rounded-full bg-red-100 text-red-500">
        ${issue.category}
      </span>
    ` : ""


    // ===== card html =====
    const card = `
      <div class="bg-white rounded-xl shadow border-t-4 ${borderColor} p-5">

        <div class="flex justify-between items-center mb-3">

          <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <img src="${statusIcon}">
          </div>

          <span class="px-3 py-1 text-sm rounded-full ${priorityColor} font-semibold">
            ${issue.priority ? issue.priority.toUpperCase() : ""}
          </span>

        </div>

        <h2 onclick="openModal('${issue.id}')"
            class="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600">
          ${issue.title || ""}
        </h2>

        <p class="text-gray-500 text-sm mb-4">
          ${issue.description || ""}
        </p>

        <div class="flex gap-2 mb-4">
          ${categoryHTML}
          ${labelsHTML}
        </div>

        <div class="text-sm text-gray-400 border-t pt-3">
          <p>#${issue.id} by ${issue.author || ""}</p>
          <p>${issue.createdAt || ""}</p>
        </div>

      </div>
    `

    container.innerHTML += card

  })

  updateCounts(issues)

}



// ==============================
// MODAL OPEN
// ==============================

async function openModal(id){

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
)

const data = await res.json()

const issue = data.data

document.getElementById("modalTitle").innerText = issue.title
document.getElementById("modalDesc").innerText = issue.description
document.getElementById("modalAuthor").innerText = issue.author
document.getElementById("modalCategory").innerText = issue.category
document.getElementById("modalPriority").innerText = issue.priority
document.getElementById("modalDate").innerText = issue.createdAt

document.getElementById("issueModal").showModal()

}



// ==============================
// SEARCH FUNCTION
// ==============================

async function searchIssue(){

const text = document.getElementById("searchInput").value

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
)

const data = await res.json()

displayIssues(data.data)

}



// ==============================
// INITIAL LOAD
// ==============================

loadIssues("all")
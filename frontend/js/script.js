let jobs = []

function inferCategory(title = "", skillsArr = []) {
  const t = title.toLowerCase()
  const s = skillsArr.map(x => String(x).toLowerCase())

  const hasAny = (arr, keys) => arr.some(v => keys.some(k => v.includes(k)))

  if (t.includes("frontend")) {
    return "frontend"
  }
  if (t.includes("backend")) {
    return "backend"
  }
  if (t.includes("data") || t.includes("applied")) {
    return "data"
  }
  if (t.includes("android")) {
    return "mobile"
  }
  if (t.includes("cloud") || t.includes("devops")) {
    return "cloud"
  }
  return "software"
}

fetch("http://127.0.0.1:8000/api/jobs/", { credentials: "include" })
  .then((res) => res.json())
  .then((data) => {
    jobs = data.map((j) => {
      const skillsArray = Array.isArray(j.skills)
        ? j.skills
        : j.skills
          ? String(j.skills).split(",").map((s) => s.trim()).filter(Boolean)
          : []

      const category = j.category && j.category.trim()
        ? j.category.trim().toLowerCase()
        : inferCategory(j.title, skillsArray)

      return {
        ...j,
        skills: skillsArray,
        salary: j.salary || "Not disclosed",
        category, // normalized/inferred
      }
    })

    renderJobs(jobs)
    renderCategories()
  })
  .catch((err) => {
    console.error("Error fetching jobs:", err)
    document.getElementById("jobsContainer").innerHTML = "<p class='text-center col-12'>Error loading jobs</p>"
  })

const categories = [
  { id: "all", name: "All Jobs" },
  { id: "software", name: "Software" },
  { id: "frontend", name: "Frontend" },
  { id: "backend", name: "Backend" },
  { id: "data", name: "Data Science" },
  { id: "mobile", name: "Mobile" },
  { id: "cloud", name: "Cloud" },
]

let selectedCategory = "all"

const jobsContainer = document.getElementById("jobsContainer")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")

function renderJobs(jobsToRender) {
  if (!jobsToRender || jobsToRender.length === 0) {
    jobsContainer.innerHTML = "<p class='text-center col-12'>No jobs found</p>"
    return
  }

  jobsContainer.innerHTML = ""
  jobsToRender.forEach((job) => {
    const skillTags = (job.skills || [])
      .map((skill) => `<span class="badge bg-light text-dark skill-tag">${skill}</span>`)
      .join("")

    const jobCard = `
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="job-card card h-100">
          <div class="card-body">
            <h2 class="card-title">${job.title ?? ""}</h2>
            <p class="company">${job.company ?? ""}</p>
            <p class="location">📍 ${job.location ?? ""}</p>
            <p class="salary">💰 ${job.salary ?? "Not disclosed"}</p>
            <div class="skills">Skills: ${skillTags}</div>
            <a href="${job.link || '#'}" class="btn btn-success apply-btn" target="_blank" rel="noopener">Apply Now</a>
          </div>
        </div>
      </div>
    `
    jobsContainer.insertAdjacentHTML("beforeend", jobCard)
  })
}

function renderCategories() {
  const categoriesContainer = document.getElementById("categories")
  categoriesContainer.innerHTML = ""

  categories.forEach((category) => {
    const categoryItem = `
      <div class="category-item ${category.id === selectedCategory ? "active" : ""}" 
           onclick="filterByCategory('${category.id}')">
        ${category.name}
      </div>
    `
    categoriesContainer.insertAdjacentHTML("beforeend", categoryItem)
  })
}

function filterJobs() {
  const query = (searchInput?.value || "").toLowerCase()
  let filtered = [...jobs]

  if (selectedCategory !== "all") {
    filtered = filtered.filter((job) => (job.category || "software").toLowerCase() === selectedCategory)
  }

  if (query) {
    filtered = filtered.filter(
      (job) =>
        (job.title || "").toLowerCase().includes(query) ||
        (job.company || "").toLowerCase().includes(query) ||
        (job.skills || []).some((skill) => String(skill).toLowerCase().includes(query)),
    )
  }

  renderJobs(filtered)
}

function filterByCategory(category) {
  selectedCategory = category
  renderCategories()
  filterJobs()
}

renderJobs(jobs)
renderCategories()

searchBtn?.addEventListener("click", filterJobs)
searchInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") filterJobs()
})

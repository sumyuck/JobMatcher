let jobs = [];

// fetch("http://127.0.0.1:8000/api/jobs/")
//   .then(res => res.json())
//   .then(data => {
//     renderJobs(data);
// });

fetch("http://127.0.0.1:8000/api/jobs/", { credentials: "include" })
  .then(res => res.json())
  .then(data => {
    jobs = data.map(j => ({
      ...j,
      skills: Array.isArray(j.skills)
        ? j.skills
        : (j.skills ? j.skills.split(",").map(s => s.trim()) : []),
      salary: j.salary || "Not disclosed",
      category: j.category || "software",
    }));
    renderJobs(jobs);
    renderCategories();
  })
  .catch(err => {
    console.error("Error fetching jobs:", err);
    document.getElementById("jobsContainer").innerHTML =
      "<p style='text-align:center;'>Error loading jobs</p>";
});


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
  if (jobsToRender.length === 0) {
    jobsContainer.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>No jobs found</p>"
    return
  }

  jobsContainer.innerHTML = ""
  jobsToRender.forEach((job) => {
    const skillTags = job.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")

    const jobCard = `
      <div class="job-card">
        <h2>${job.title}</h2>
        <p class="company">${job.company}</p>
        <p class="location">📍 ${job.location}</p>
        <p class="salary">💰 ${job.salary}</p>
        <div class="skills">Skills: ${skillTags}</div>
        <a href="#" class="apply-btn">Apply Now</a>
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
  const query = searchInput.value.toLowerCase()
  let filtered = jobs

  if (selectedCategory !== "all") {
    filtered = filtered.filter((job) => job.category === selectedCategory)
  }

  if (query) {
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.skills.some((skill) => skill.toLowerCase().includes(query)),
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

searchBtn.addEventListener("click", filterJobs)
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") filterJobs()
})

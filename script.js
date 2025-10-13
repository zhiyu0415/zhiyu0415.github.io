const username = "zhiyu0415";
const projectsListEl = document.getElementById("projects-list");

const categories = {
  "AI / ML 專案": ["AI", "ML", "bert", "flower", "skin", "medical", "llm"],
  "網站 / 系統開發": ["web", "html", "css", "fastapi", "system", "project", "wix", "hospital", "care"],
  "APP / 遊戲開發": ["android", "app", "pygame", "game", "pacman"],
  "程式語言練習": ["c", "cpp", "java", "asm", "ubuntu", "practice"]
};

// === 建立分類區塊 ===
function createCategoryBlock(title) {
  const section = document.createElement("section");
  section.className = "category-block";

  const header = document.createElement("h3");
  header.className = "category-title";
  header.textContent = title;
  section.appendChild(header);

  const ul = document.createElement("ul");
  ul.className = "projects";
  section.appendChild(ul);

  projectsListEl.appendChild(section);
  return ul;
}

// === 建立專案卡片 ===
async function createProjectCard(repo) {
  const li = document.createElement("li");
  li.className = "project-card";

  const title = document.createElement("h3");
  title.textContent = repo.name;
  li.appendChild(title);

  if (repo.description) {
    const desc = document.createElement("p");
    desc.textContent = repo.description;
    li.appendChild(desc);
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  const lang = repo.language || "─";
  const updated = new Date(repo.updated_at).toLocaleDateString();
  meta.textContent = `語言: ${lang} · 最後更新：${updated}`;
  li.appendChild(meta);

  // === 按鈕區 ===
  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";

  // 專案介紹按鈕
  const infoBtn = document.createElement("a");
  infoBtn.className = "btn info-btn";
  infoBtn.textContent = "專案介紹";
  const infoURL = `/projects/${repo.name}.html`;

  try {
    // 嘗試確認是否存在該 HTML 頁面
    const res = await fetch(infoURL, { method: "HEAD" });
    if (res.ok) {
      infoBtn.href = infoURL;
      infoBtn.target = "_blank";
    } else {
      infoBtn.classList.add("disabled");
      infoBtn.textContent = "尚未建立";
    }
  } catch {
    infoBtn.classList.add("disabled");
    infoBtn.textContent = "尚未建立";
  }

  // GitHub 按鈕
  const gitBtn = document.createElement("a");
  gitBtn.className = "btn github-btn";
  gitBtn.textContent = "GitHub";
  gitBtn.href = repo.html_url;
  gitBtn.target = "_blank";

  btnContainer.appendChild(infoBtn);
  btnContainer.appendChild(gitBtn);
  li.appendChild(btnContainer);

  return li;
}

// === 判斷分類 ===
function getCategory(repo) {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(k => name.includes(k) || desc.includes(k))) {
      return category;
    }
  }
  return "其他專案";
}

// === 載入 GitHub 專案 ===
async function loadProjects() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!response.ok) throw new Error("GitHub API 回應錯誤 " + response.status);

    const repos = await response.json();
    projectsListEl.innerHTML = "";

    if (repos && repos.length > 0) {
      const grouped = {};

      for (const repo of repos) {
        const cat = getCategory(repo);
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(repo);
      }

      for (const catName of Object.keys(categories).concat("其他專案")) {
        if (grouped[catName] && grouped[catName].length > 0) {
          const ul = createCategoryBlock(catName);
          for (const repo of grouped[catName]) {
            const card = await createProjectCard(repo);
            ul.appendChild(card);
          }
        }
      }
    } else {
      projectsListEl.innerHTML = "<li>目前沒有公開專案</li>";
    }
  } catch (err) {
    console.error("抓專案發生錯誤：", err);
    projectsListEl.innerHTML = `<li class="loading">無法載入專案（${err.message}）</li>`;
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);

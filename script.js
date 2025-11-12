const username = "zhiyu0415";
const projectsListEl = document.getElementById("projects-list");

const categories = {
  "AI / ML 專案": ["medical_platform", "tensorflow-render", "皮膚影像分類模型"],
  "網站 / 系統開發": ["Medical-Helper", "WIX", "ithome2023", "medicalHelper"],
  "APP / 遊戲開發": ["APP_AddressBook", "money", "mealapp", "App_PaperScissorStone", "App_Riddle"],
  "程式語言練習": ["CPractice", "MASM", "Vulnerability-scanning", "myproject2", "myproject9", "order", "box", "myproject"]
};

const projectPages = {
  "WIX": "https://yvonneli0415.wixsite.com/website",
  "ithome2023": "https://ithelp.ithome.com.tw/users/20162525/ironman/6902",
};

const excludeRepos = ["BIgData"];

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
  let infoURL = projectPages[repo.name] || `/projects/${repo.name}.html`;

  if (projectPages[repo.name]) {
    infoBtn.href = infoURL;
    infoBtn.target = "_blank";
  } else {
    try {
      const res = await fetch(infoURL, { method: "HEAD" });
      if (res.ok) {
        infoBtn.href = infoURL;
      } else {
        infoBtn.classList.add("disabled");
        infoBtn.textContent = "尚未建立";
      }
    } catch {
      infoBtn.classList.add("disabled");
      infoBtn.textContent = "尚未建立";
    }
  }
  // GitHub 按鈕
  const gitBtn = document.createElement("a");
  gitBtn.className = "btn github-btn";
  if (repo.html_url) {
    gitBtn.textContent = "GitHub";
    gitBtn.href = repo.html_url;
    gitBtn.target = "_blank";
  } else {
    gitBtn.textContent = "沒有公開專案";
    gitBtn.classList.add("disabled");
    gitBtn.href = "#";
    gitBtn.onclick = (e) => e.preventDefault(); // 防止點擊
  }

  btnContainer.appendChild(infoBtn);
  btnContainer.appendChild(gitBtn);
  li.appendChild(btnContainer);

  return li;
}

// === 判斷分類 ===
function getCategory(repo) {
  const name = repo.name; // 保留原始大小寫比對（可依需求改為小寫）
  for (const [category, exactNames] of Object.entries(categories)) {
    if (exactNames.includes(name)) {
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
    const validRepos = repos.filter(repo => !excludeRepos.includes(repo.name));

    projectsListEl.innerHTML = "";

    // 建立 repo 名稱對應表
    const repoMap = {};
    for (const repo of repos) {
      repoMap[repo.name] = repo;
    }

    let hasAnyProject = false;

    // 處理 categories 中的每個分類
    for (const [categoryName, projectNames] of Object.entries(categories)) {
      const ul = createCategoryBlock(categoryName);
      let hasValidCard = false;

      for (const name of projectNames) {
        const repo = repoMap[name];

        const card = await createProjectCard(repo || {
          name: name,
          description: "",
          updated_at: new Date().toISOString(),
          language: null,
          html_url: null
        });

        ul.appendChild(card);
        hasValidCard = true;
        hasAnyProject = true;
      }

      if (!hasValidCard) {
        ul.innerHTML = "<li>沒有對應的公開專案</li>";
      }
    }

    // 處理「其他專案」
    const usedNames = new Set(Object.values(categories).flat());
    const otherRepos = validRepos
      .filter(repo => !usedNames.has(repo.name))
      .filter(repo => !repo.html_url.includes("github.io"));

    if (otherRepos.length > 0) {
      const ul = createCategoryBlock("其他專案");
      for (const repo of otherRepos) {
        const card = await createProjectCard(repo);
        ul.appendChild(card);
      }
      hasAnyProject = true;
    }

    if (!hasAnyProject) {
      projectsListEl.innerHTML = "<li>目前沒有公開專案</li>";
    }
  } catch (err) {
    console.error("抓專案發生錯誤：", err);
    projectsListEl.innerHTML = `<li class="loading">無法載入專案（${err.message}）</li>`;
  }
}


document.addEventListener("DOMContentLoaded", loadProjects);

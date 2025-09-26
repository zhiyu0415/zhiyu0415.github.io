const username = "zhiyu0415";
const projectsListEl = document.getElementById("projects-list");

function createProjectItem(repo) {
  const li = document.createElement("li");

  const a = document.createElement("a");
  a.href = repo.html_url;
  a.target = "_blank";
  a.textContent = repo.name;
  li.appendChild(a);

  if (repo.description) {
    const desc = document.createElement("span");
    desc.className = "description";
    desc.textContent = repo.description;
    li.appendChild(desc);
  }

  // 顯示語言、最後更新時間等 metadata
  const meta = document.createElement("div");
  meta.className = "meta";
  const lang = repo.language || "─";
  const updated = new Date(repo.updated_at).toLocaleDateString();
  meta.textContent = `語言: ${lang} · 最後更新：${updated}`;
  li.appendChild(meta);

  return li;
}

function loadProjects() {
  fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
    .then(response => {
      if (!response.ok) {
        throw new Error("GitHub API 回應錯誤 " + response.status);
      }
      return response.json();
    })
    .then(repos => {
      projectsListEl.innerHTML = "";  // 清除 loading
      if (repos && repos.length > 0) {
        // 你可以在這裡對 repos 做排序、過濾
        repos.forEach(repo => {
          const li = createProjectItem(repo);
          projectsListEl.appendChild(li);
        });
      } else {
        const li = document.createElement("li");
        li.textContent = "目前沒有公開專案";
        projectsListEl.appendChild(li);
      }
    })
    .catch(err => {
      console.error("抓專案發生錯誤：", err);
      projectsListEl.innerHTML = `<li class="loading">無法載入專案（${err.message}）</li>`;
    });
}

// 網頁 DOMContentLoaded 後再載入專案
document.addEventListener("DOMContentLoaded", loadProjects);

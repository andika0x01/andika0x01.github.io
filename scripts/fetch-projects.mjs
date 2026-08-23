import { writeFileSync } from "node:fs";

async function fetchProjects() {
  try {
    const headers = {
      "User-Agent": "andika0x01-site-build",
      Accept: "application/vnd.github.v3+json",
    };

    const token =
      process.env.PERSONAL_ACCESS_TOKEN ||
      process.env.GITHUB_TOKEN;

    if (token && token.trim() !== "") {
      headers["Authorization"] = `Bearer ${token.trim()}`;
    }

    const res = await fetch(
      "https://api.github.com/users/andika0x01/repos?type=public&sort=pushed&per_page=30",
      { headers }
    );

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    const projects = data
      .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== "andika0x01")
      .slice(0, 8)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
      }));

    writeFileSync(
      "public/projects.json",
      JSON.stringify(projects, null, 2),
      "utf-8"
    );
    console.log(`Successfully written ${projects.length} projects to public/projects.json:`);
    console.log(projects.map((p) => p.name).join(", "));
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
}

fetchProjects();

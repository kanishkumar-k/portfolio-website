import { NextResponse } from "next/server";

const GITHUB_USERNAME = "kanishkumar-k";
const REPOS = [
  "portfolio-website",
  "langgraph-fastapi-project-builder",
  "django-react-e-learning-webapp",
  "eRailway-serv",
  "college-management-backend",
  "twitter-clone-with-proactive-cyberbullying-detection"
];

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GitHub token not set" }, { status: 500 });
  }

  try {
    const repoFetches = REPOS.map(async (name) => {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${name}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json"
          }
        }
      );
      if (!res.ok) return null;
      const repo = await res.json();
      return {
        id: repo.id,
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description
      };
    });
    const results = await Promise.all(repoFetches);
    return NextResponse.json(results.filter(Boolean));
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }
}

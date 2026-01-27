import { NextRequest, NextResponse } from "next/server";

const GITHUB_USERNAME = "kanishkumar-k";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

async function fetchGitHubProfile() {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
  if (!res.ok) throw new Error("Failed to fetch GitHub profile");
  return res.json();
}

async function fetchGitHubRepos() {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=6&sort=updated`);
  if (!res.ok) throw new Error("Failed to fetch GitHub repos");
  return res.json();
}

function buildPrompt(profile: any, repos: any[]): string {
  const repoList = repos
    .map((repo) => `- ${repo.name}: ${repo.description || "No description"}`)
    .join("\n");
  return `
You are an expert GitHub profile summarizer.
Given the following GitHub profile and repositories, write a concise, professional 2-line summary of the user's GitHub profile for a portfolio website.

Profile:
Name: ${profile.name || profile.login}
Bio: ${profile.bio || "N/A"}
Public Repos: ${profile.public_repos}
Followers: ${profile.followers}
Following: ${profile.following}

Top Repositories:
${repoList}

Summary (2 lines):
`;
}

export async function GET(req: NextRequest) {
  try {
    const [profile, repos] = await Promise.all([
      fetchGitHubProfile(),
      fetchGitHubRepos(),
    ]);

    const prompt = buildPrompt(profile, repos);

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "No Gemini API key configured. Set GEMINI_API_KEY in your environment." }, { status: 500 });
    }

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errorMsg = await geminiRes.text();
      return NextResponse.json({ error: "Gemini API error: " + errorMsg }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    // Gemini returns candidates[0].content.parts[0].text
    const summary =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

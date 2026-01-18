"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

const GITHUB_USERNAME = "kanishkumar-k"; 

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
};

const fetchTopRepos = async (username: string): Promise<Repo[]> => {
  try {
    // Try to load favorite repo names from JSON
    let favoriteNames: string[] = [];
    try {
      const favRes = await fetch("/data/github-top-repos.json");
      if (favRes.ok) {
        favoriteNames = await favRes.json();
      }
    } catch {}
    if (favoriteNames && favoriteNames.length === 6) {
      // Fetch all repos and filter by favorite names
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return favoriteNames
        .map((name) => data.find((repo: any) => repo.name === name))
        .filter(Boolean)
        .slice(0, 6);
    } else {
      // Fallback: Sort by stars, take top 6
      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      const data = await res.json();
      if (!Array.isArray(data)) return [];
      return data
        .filter((repo: any) => !repo.fork)
        .sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
    }
  } catch {
    return [];
  }
};

const GitHubShowcaseSection: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopRepos(GITHUB_USERNAME).then((repos) => {
      setRepos(repos);
      setLoading(false);
    });
  }, []);

  return (
    <section
      id="github-showcase"
      className="w-full py-20 px-4 flex flex-col items-center justify-center relative bg-[var(--background)]"
    >
      <motion.div
        className="section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20 flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col items-center mb-8">
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2 bg-[#181717] text-white rounded-full font-bold shadow-lg hover:bg-[#24292f] transition-colors text-lg"
            style={{ marginBottom: 12 }}
          >
            <FaGithub size={28} />
            Visit my GitHub
          </a>
          <h2 className="text-2xl font-bold mb-2 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)]">
            Top GitHub Repositories
          </h2>
        </div>
        {loading ? (
          <div className="text-center" style={{ color: "var(--foreground)", opacity: 0.7 }}>Loading repositories...</div>
        ) : repos.length === 0 ? (
          <div className="text-center" style={{ color: "var(--foreground)", opacity: 0.7 }}>No repositories found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {repos.map((repo, idx) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/10 rounded-xl shadow-lg p-6 border border-white/10 hover:scale-105 hover:bg-white/20 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 #b3c0f7" }}
                style={{ color: "var(--foreground)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FaGithub size={22} className="text-[#b3c0f7]" />
                  <span className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>{repo.name}</span>
                </div>
                <p className="text-sm mb-2" style={{ color: "var(--foreground)", opacity: 0.9 }}>{repo.description || "No description"}</p>
                <div className="flex gap-4 text-xs mt-2" style={{ color: "var(--foreground)", opacity: 0.7 }}>
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                  {repo.language && <span>{repo.language}</span>}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default GitHubShowcaseSection;

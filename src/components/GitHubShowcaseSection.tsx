"use client";
import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { FaGithub } from "react-icons/fa";

// const GITHUB_USERNAME = "kanishkumar-k";

// type Repo = {
//   id: number;
//   name: string;
//   html_url: string;
//   description: string;
// };

// const GitHubShowcaseSection: React.FC = () => {
//   const [repos, setRepos] = useState<Repo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [active, setActive] = useState(false);


//   const topRepoNames = [
//     "portfolio-website",
//     "langgraph-fastapi-project-builder",
//     "django-react-e-learning-webapp",
//     "eRailway-serv",
//     "college-management-backend",
//     "twitter-clone-with-proactive-cyberbullying-detection"
//   ];

//   useEffect(() => {
//     async function fetchRepos() {
//       try {
//         const res = await fetch("/api/github-repos");
//         if (!res.ok) {
//           setRepos([]);
//           setLoading(false);
//           return;
//         }
//         const data = await res.json();
//         setRepos(Array.isArray(data) ? data : []);
//       } catch {
//         setRepos([]);
//       }
//       setLoading(false);
//     }
//     fetchRepos();
//   }, []);


//   return (
//   //   <section
//     //   id="github-showcase"
//     //   className="w-full pt-4 pb-20 px-4 flex flex-col items-center justify-center relative bg-[var(--background)]"
//     // >
//       //{
//         /* <motion.div
//         className={`section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20 flex flex-col items-center${active ? " section-card-active" : ""}`}
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//         tabIndex={0}
//         onClick={() => setActive(true)}
//         onFocus={() => setActive(true)}
//         onBlur={() => setActive(false)}
//       >
//         <div className="flex flex-col items-center mb-8">
//           <h2 className={`text-2xl font-bold mb-2 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)] underline underline-offset-8 section-title-variant${active ? " section-title-active" : ""}`}>
//             Top GitHub Repositories
//           </h2>
//           {/* AI-generated summary removed */
// //         </div>
// //         {repos.length === 0 ? (
// //           <div className="text-center" style={{ color: "var(--foreground)", opacity: 0.7 }}>No repositories found.</div>
// //         ) : (
// //           <div className="grid gap-6 sm:grid-cols-2">
// //             {repos.map((repo, idx) => (
// //               <motion.a
// //                 key={repo.id}
// //                 href={repo.html_url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="block bg-white/10 rounded-xl shadow-lg p-6 border border-white/10 hover:scale-105 hover:bg-white/20 transition-transform duration-300"
// //                 initial={{ opacity: 0, y: 30 }}
// //                 whileInView={{ opacity: 1, y: 0 }}
// //                 viewport={{ once: true }}
// //                 transition={{ duration: 0.5, delay: idx * 0.1 }}
// //                 whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 #b3c0f7" }}
// //                 style={{ color: "var(--foreground)" }}
// //               >
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <FaGithub size={22} className="text-[#b3c0f7]" />
// //                   <span className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>{repo.name}</span>
// //                 </div>
// //                 <p className="text-sm mb-2" style={{ color: "var(--foreground)", opacity: 0.9 }}>{repo.description || "No description"}</p>
// //               </motion.a>
// //             ))}
// //           </div>
// //         )}
// //         {/* Separated Visit my GitHub button */}
// //         <div className="flex justify-center mt-10">
// //           <a
// //             href={`https://github.com/${GITHUB_USERNAME}`}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="flex items-center gap-2 px-6 py-2 bg-[#181717] text-white rounded-full font-bold shadow-lg hover:bg-[#24292f] transition-colors text-lg"
// //             style={{ marginBottom: 0 }}
// //           >
// //             <FaGithub size={28} />
// //             Visit my GitHub
// //           </a>
// //         </div>
// //       </motion.div> */}
// //     </section>
// //   );

const GitHubShowcaseSection: React.FC = () => {
  return null
};
export default GitHubShowcaseSection;

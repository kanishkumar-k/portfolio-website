"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SiPython,
  SiJavascript,
  SiFastapi,
  SiDjango,
  SiStreamlit,
  SiNodedotjs,
  SiReact,
  SiGraphql,
  SiGithub,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiGit,
} from "react-icons/si";
import { FaCode } from "react-icons/fa";

/**
 * Skills section with glassy, dark, blurred style and white text.
 */
type SkillType = {
  name: string;
  icon: string;
};

const ICON_MAP: { [key: string]: React.ReactNode } = {
  SiPython: <SiPython size={32} color="#3776AB" title="Python" />,
  SiJavascript: <SiJavascript size={32} color="#F7DF1E" title="JavaScript" />,
  SiFastapi: <SiFastapi size={32} color="#009688" title="FastAPI" />,
  SiDjango: <SiDjango size={32} color="#092E20" title="Django" />,
  SiStreamlit: <SiStreamlit size={32} color="#FF4B4B" title="Streamlit" />,
  SiNodedotjs: <SiNodedotjs size={32} color="#339933" title="Node.js" />,
  SiReact: <SiReact size={32} color="#61DAFB" title="React.js" />,
  SiGraphql: <SiGraphql size={32} color="#E10098" title="GraphQL" />,
  SiGithub: <SiGithub size={32} color="#181717" title="GitHub" />,
  SiPostgresql: <SiPostgresql size={32} color="#336791" title="PostgreSQL" />,
  SiMongodb: <SiMongodb size={32} color="#47A248" title="MongoDB" />,
  SiMysql: <SiMysql size={32} color="#4479A1" title="MySQL" />,
  SiGit: <SiGit size={32} color="#F05032" title="Git" />,
  FaCode: <FaCode size={32} color="#4A90E2" title="Other" />,
};

const SkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSkills(data);
      });
  }, []);

  return (
    <section
      id="skills"
      className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      <motion.div
        className="section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)]">
          Skills
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-lg" style={{ color: "var(--foreground)", opacity: 0.9 }}>
          {skills.length === 0 ? (
            <li className="col-span-full text-center text-white/70">No skills data available.</li>
          ) : (
            skills.map((skill, idx) => {
              let name = "";
              let icon = "FaCode";
              if (typeof skill === "object" && skill !== null && "name" in skill && "icon" in skill) {
                name = skill.name;
                icon = skill.icon;
              } else if (typeof skill === "string") {
                name = skill;
                icon = "FaCode";
              }
              return (
                <motion.li
                  key={name + idx}
                  className="bg-white/10 rounded-lg shadow p-3 text-center border border-white/10 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="mb-2 text-2xl">
                    {ICON_MAP[icon] || <FaCode size={32} color="#4A90E2" />}
                  </span>
                  <span>{name}</span>
                </motion.li>
              );
            })
          )}
        </ul>
      </motion.div>
    </section>
  );
};

export default SkillsSection;

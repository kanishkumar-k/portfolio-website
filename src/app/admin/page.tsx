"use client";
import React, { useState, useEffect, useRef } from "react";
import * as SiIcons from "react-icons/si";
import { FaCode } from "react-icons/fa";


/**
 * Type definitions for portfolio data structure.
 */
interface Skill {
  name: string;
  icon: string;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

interface Project {
  title: string;
  description: string;
  link: string;
  image?: string;
  imageFile?: File;
  imagePreview?: string;
}

interface Blog {
  title: string;
  url: string;
  description?: string;
  image?: string;
  imageFile?: File;
  imagePreview?: string;
}

interface Contact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  textColor: string;
}

interface Home {
  greeting: string;
  name: string;
  intro: string;
  textColor: string;
}

interface About {
  description: string;
  textColor: string;
}

interface PortfolioData {
  home: Home;
  about: About;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  blogs: Blog[];
  publications: unknown[];
  contact: Contact;
  [key: string]: unknown;
}

/**
 * Dynamically generate all Si* icon options.
 * No default skills or dummy data is used anywhere in this file.
 * All data is loaded from the backend JSON files via API routes.
 */
const SKILL_ICON_OPTIONS = Object.keys(SiIcons)
  .filter((k) => k.startsWith("Si"))
  .sort()
  .map((k) => ({ label: k, value: k }));

SKILL_ICON_OPTIONS.push({ label: "Other/Generic (FaCode)", value: "FaCode" });

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (


    
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 24, minWidth: 350, maxWidth: 500, width: "90%", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 12, right: 16, background: "transparent", border: "none", fontSize: 22, cursor: "pointer"
          }}
          aria-label="Close"
        >×</button>
        {children}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [selectedResumeName, setSelectedResumeName] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setDataState] = useState<PortfolioData | null>(null);
  const [edit, setEdit] = useState<{ [key: string]: boolean }>({});
  const [tempData, setTempData] = useState<PortfolioData>({
  home: { greeting: "", name: "", intro: "", textColor: "" },
  about: { description: "", textColor: "" },
  skills: [],
  experience: [],
  projects: [],
  blogs: [],
  publications: [],
  contact: { email: "", phone: "", linkedin: "", github: "", textColor: "" }
});

  // Helper to safely get section data
  function getSection<T>(section: keyof PortfolioData): T {
    if (!data) throw new Error("Data not loaded");
    return (data[section] ?? ([] as any)) as T;
  }

  // For about (object)
  const handleAboutCancel = () => {
    setEdit({ ...edit, about: false });
    if (!data) return;
    setTempData({
      ...data,
      home: data.home,
      about: { ...(data.about ?? { description: "", textColor: "" }) },
      skills: data.skills,
      experience: data.experience,
      projects: data.projects,
      blogs: data.blogs,
      publications: data.publications,
      contact: data.contact
    });
  };
  const handleAboutReset = () => {
    if (!data) return;
    setTempData({
      ...data,
      home: data.home,
      about: { ...(data.about ?? { description: "", textColor: "" }) },
      skills: data.skills,
      experience: data.experience,
      projects: data.projects,
      blogs: data.blogs,
      publications: data.publications,
      contact: data.contact
    });
  };

  // For modal description editors
  const [expModalIdx, setExpModalIdx] = useState<number | null>(null);
  const [expModalValue, setExpModalValue] = useState<string>("");
  const [blogModalIdx, setBlogModalIdx] = useState<number | null>(null);
  const [blogModalValue, setBlogModalValue] = useState<string>("");
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
  const [expandedBlog, setExpandedBlog] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAllData() {
      const [home, about, skills, experience, projects, blogs, contact] = await Promise.all([
        fetch("/api/home").then(r => r.json()),
        fetch("/api/about").then(r => r.json()),
        fetch("/api/skills").then(r => r.json()),
        fetch("/api/experience").then(r => r.json()),
        fetch("/api/projects").then(r => r.json()),
        fetch("/api/blogs").then(r => r.json()),
        fetch("/api/contact").then(r => r.json()),
      ]);
      // Only set state if all required data is present and valid
      if (
        home && about && Array.isArray(skills) && Array.isArray(experience) &&
        Array.isArray(projects) && Array.isArray(blogs) && contact
      ) {
        const loaded: PortfolioData = {
          home,
          about,
          skills,
          experience,
          projects,
          blogs,
          publications: [],
          contact
        };
        setDataState(loaded);
        setTempData(loaded);
      } else {
        setDataState(null);
      }
    }
    fetchAllData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (username === adminUser && password === adminPass) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleEdit = (section: string) => {
    setEdit({ ...edit, [section]: true });
    if (!data) return;
    setTempData({ ...data, [section]: { ...(data[section] ?? {}) } });
  };

  const handleCancel = (section: string) => {
    setEdit({ ...edit, [section]: false });
    if (!data) return;
    setTempData({ ...data, [section]: { ...(data[section] ?? {}) } });
  };

  const handleReset = (section: string) => {
    if (!data) return;
    setTempData({ ...data, [section]: { ...(data[section] ?? {}) } });
  };

  const handleSave = async (section: string) => {
    if (!data || !tempData) return;
    const newData = { ...data, [section]: { ...(tempData[section] ?? {}) } };
    if (!tempData) return;
if (!tempData) return;
if (!tempData) return;
if (!tempData) return;
if (!tempData) return;
if (!tempData.home) tempData.home = { greeting: "", name: "", intro: "", textColor: "" };
if (!tempData.about) tempData.about = { description: "", textColor: "" };
if (!tempData.skills) tempData.skills = [];
if (!tempData.experience) tempData.experience = [];
if (!tempData.projects) tempData.projects = [];
if (!tempData.blogs) tempData.blogs = [];
if (!tempData.publications) tempData.publications = [];
if (!tempData.contact) tempData.contact = { email: "", phone: "", linkedin: "", github: "", textColor: "" };
setDataState({
  home: tempData.home,
  about: tempData.about,
  skills: tempData.skills,
  experience: tempData.experience,
  projects: tempData.projects,
  blogs: tempData.blogs,
  publications: tempData.publications,
  contact: tempData.contact
});
    setEdit({ ...edit, [section]: false });

    // Sync to backend API for about, home, etc.
    if (section === "about") {
      await fetch("/api/github-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: "data/about.json",
          json: tempData.about,
          commitMessage: "Update about.json via admin"
        }),
      });
    }
    if (section === "home") {
      await fetch("/api/github-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: "data/home.json",
          json: tempData.home,
          commitMessage: "Update home.json via admin"
        }),
      });
    }
    if (section === "contact") {
      await fetch("/api/github-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: "data/contact.json",
          json: tempData.contact,
          commitMessage: "Update contact.json via admin"
        }),
      });
    }
  };

  // For skills (array of objects)
  const handleSkillsEdit = () => {
    setEdit({ ...edit, skills: true });
  };
  const handleSkillsCancel = () => {
    setEdit({ ...edit, skills: false });
    if (!data) return;
    setTempData({ ...data, skills: [...(data.skills ?? [])] });
  };
  const handleSkillsReset = () => {
    if (!data) return;
    setTempData({ ...data, skills: [...(data.skills ?? [])] });
  };
  const handleSkillsSave = async () => {
    if (!data || !tempData) return;
    const newData: PortfolioData = {
      ...data,
      home: data.home!,
      about: data.about!,
      skills: [...tempData.skills],
      experience: data.experience!,
      projects: data.projects!,
      blogs: data.blogs!,
      publications: data.publications!,
      contact: data.contact!
    };
    setDataState(newData);
    setEdit({ ...edit, skills: false });
    await fetch("/api/github-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: "data/skills.json",
        json: tempData.skills,
        commitMessage: "Update skills.json via admin"
      }),
    });
  };
const handleSkillChange = (idx: number, field: string, value: string) => {
    if (!tempData) return;
    const updated = tempData.skills.map((s: any, i: number) =>
      i === idx ? { ...s, [field]: value } : s
    );
    setTempData({ ...tempData, skills: updated });
  };
  const handleAddSkill = () => {
    if (!tempData) return;
    setTempData({
      ...tempData,
      skills: [...tempData.skills, { name: "", icon: "FaCode" }]
    });
  };
  const handleRemoveSkill = (idx: number) => {
    if (!tempData) return;
    setTempData({
      ...tempData,
      skills: tempData.skills.filter((_: any, i: number) => i !== idx)
    });
  };

  // For projects (array of objects)
  const handleProjectsEdit = () => {
    setEdit({ ...edit, projects: true });
  };
  const handleProjectsCancel = () => {
    setEdit({ ...edit, projects: false });
    if (!data) return;
    setTempData({ ...data, projects: [...(data.projects ?? [])] });
  };
  const handleProjectsReset = () => {
    if (!data) return;
    setTempData({ ...data, projects: [...(data.projects ?? [])] });
  };
  const handleProjectsSave = async () => {
    if (!data || !tempData) return;
    // Remove transient fields before saving
    const cleanedProjects = tempData.projects.map((p: any) => {
      const { imagePreview, imageFile, ...rest } = p;
      return rest;
    });
    const newData: PortfolioData = {
      ...data,
      home: data.home!,
      about: data.about!,
      skills: data.skills!,
      experience: data.experience!,
      projects: cleanedProjects,
      blogs: data.blogs!,
      publications: data.publications!,
      contact: data.contact!
    };
    setDataState(newData);
    setEdit({ ...edit, projects: false });
    await fetch("/api/github-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: "data/projects.json",
        json: cleanedProjects,
        commitMessage: "Update projects.json via admin"
      }),
    });
  };
  const handleProjectChange = (idx: number, field: string, value: string) => {
    if (!tempData) return;
    const updated = tempData.projects.map((p: any, i: number) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setTempData({ ...tempData, projects: updated });
  };
  const handleAddProject = () => {
    if (!tempData) return;
    setTempData({
      ...tempData,
      projects: [...tempData.projects, { title: "", description: "", link: "" }]
    });
  };
  const handleRemoveProject = (idx: number) => {
    if (!tempData) return;
    setTempData({
      ...tempData,
      projects: tempData.projects.filter((_: any, i: number) => i !== idx)
    });
  };

  // For blogs (array of objects)
  const handleBlogsEdit = () => {
    setEdit({ ...edit, blogs: true });
  };
  const handleBlogsCancel = () => {
    setEdit({ ...edit, blogs: false });
    if (!data) return;
    setTempData({
      ...data,
      blogs: [...(data.blogs ?? [])],
      home: data.home,
      about: data.about,
      skills: data.skills,
      experience: data.experience,
      projects: data.projects,
      publications: data.publications,
      contact: data.contact
    });
  };
  const handleBlogsReset = () => {
    if (!data) return;
    setTempData({
      ...data,
      blogs: [...(data.blogs ?? [])],
      home: data.home,
      about: data.about,
      skills: data.skills,
      experience: data.experience,
      projects: data.projects,
      publications: data.publications,
      contact: data.contact
    });
  };
  const handleBlogsSave = async () => {
    if (!data || !tempData) return;
    // Clean blogs: only keep title, url, description, image
    const cleanedBlogs = (tempData.blogs || []).map((b: any) => ({
      title: b.title,
      url: b.url,
      description: b.description,
      image: b.image && typeof b.image === "string" && b.image.startsWith("/images/") ? b.image : "",
    }));
    const newData: PortfolioData = {
      ...data,
      home: data.home!,
      about: data.about!,
      skills: data.skills!,
      experience: data.experience!,
      projects: data.projects!,
      blogs: cleanedBlogs,
      publications: data.publications!,
      contact: data.contact!
    };
    setDataState(newData);
    setEdit({ ...edit, blogs: false });
    await fetch("/api/github-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: "data/blogs.json",
        json: cleanedBlogs,
        commitMessage: "Update blogs.json via admin"
      }),
    });
  };
  const handleExperienceSave = async () => {
    if (!data || !tempData) return;
    const newData: PortfolioData = {
      ...data,
      home: data.home!,
      about: data.about!,
      skills: data.skills!,
      experience: tempData.experience ? [...tempData.experience] : [],
      projects: data.projects!,
      blogs: data.blogs!,
      publications: data.publications!,
      contact: data.contact!
    };
    setDataState(newData);
    setEdit({ ...edit, experience: false });
    await fetch("/api/github-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filePath: "data/experience.json",
        json: tempData.experience,
        commitMessage: "Update experience.json via admin"
      }),
    });
  };
  const handleBlogChange = (idx: number, field: string, value: any) => {
    if (!tempData) return;
    const updated = tempData.blogs.map((b: any, i: number) =>
      i === idx ? { ...b, [field]: value } : b
    );
    setTempData({ ...tempData, blogs: updated });
  };
  const handleAddBlog = () => {
    if (!tempData) return;
    setTempData({
      ...tempData,
      blogs: [...tempData.blogs, { title: "", url: "" }]
    });
  };
  const handleRemoveBlog = (idx: number) => {
    if (!tempData) return;
    setTempData({
      ...tempData,
      blogs: tempData.blogs.filter((_: any, i: number) => i !== idx)
    });
  };

  // For contact
  const handleContactChange = (field: string, value: string) => {
    if (!tempData) return;
    setTempData({
      ...tempData,
      contact: { ...tempData.contact, [field]: value },
      home: tempData.home,
      about: tempData.about,
      skills: tempData.skills,
      experience: tempData.experience,
      projects: tempData.projects,
      blogs: tempData.blogs,
      publications: tempData.publications
    });
  };

  // Resume upload handler
  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeInputRef.current?.files?.[0]) {
      alert("Please select a PDF file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", resumeInputRef.current.files[0]);
    const res = await fetch("/api/resume", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      alert("Resume uploaded successfully!");
      setSelectedResumeName("");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    } else {
      alert("Failed to upload resume.");
    }
  };

  // Modal handlers for Experience
  const openExpModal = (idx: number) => {
    setExpandedExp(idx);
    setExpModalValue(
      tempData && Array.isArray(tempData.experience) && tempData.experience[idx]
        ? tempData.experience[idx].description || ""
        : ""
    );
  };
  const closeExpModal = () => {
    setExpandedExp(null);
    setExpModalValue("");
  };
  const saveExpModal = (idx: number) => {
    if (!tempData || !Array.isArray(tempData.experience)) return;
    const updated = tempData.experience.map((x: any, i: number) =>
      i === idx ? { ...x, description: expModalValue } : x
    );
    setTempData({ ...tempData, experience: updated });
    setDataState((prev: any) => ({ ...prev, experience: updated }));
    closeExpModal();
  };

  // Modal handlers for Blogs
  const openBlogModal = (idx: number) => {
    setExpandedBlog(idx);
    if (!tempData || !tempData.blogs) {
      setBlogModalValue("");
      return;
    }
    setBlogModalValue(tempData.blogs[idx]?.description || "");
  };
  const closeBlogModal = () => {
    setExpandedBlog(null);
    setBlogModalValue("");
  };
  const saveBlogModal = (idx: number) => {
    if (!tempData || !tempData.blogs) return;
    const updated = tempData.blogs.map((x: any, i: number) =>
      i === idx ? { ...x, description: blogModalValue } : x
    );
    setTempData({ ...tempData, blogs: updated });
    setDataState((prev: any) => ({ ...prev, blogs: updated }));
    closeBlogModal();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-gray-900"
      style={{
        backgroundImage: "url('/images/admin-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh"
      }}
    >
      {/* Experience Description Modal */}
      <Modal open={expandedExp !== null} onClose={closeExpModal}>
        <h4 className="text-lg font-bold mb-2">Edit Experience Description</h4>
        <textarea
          className="p-2 rounded bg-gray-100 border w-full mb-4"
          value={expModalValue}
          rows={6}
          placeholder="Description"
          onChange={e => setExpModalValue(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700" onClick={() => saveExpModal(expandedExp!)}>Save</button>
          <button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={closeExpModal}>Cancel</button>
        </div>
      </Modal>
      {/* Blog Description Modal */}
      <Modal open={expandedBlog !== null} onClose={closeBlogModal}>
        <h4 className="text-lg font-bold mb-2">Edit Blog Description</h4>
        <textarea
          className="p-2 rounded bg-gray-100 border w-full mb-4"
          value={blogModalValue}
          rows={6}
          placeholder="Description"
          onChange={e => setBlogModalValue(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700" onClick={() => saveBlogModal(expandedBlog!)}>Save</button>
          <button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={closeBlogModal}>Cancel</button>
        </div>
      </Modal>
      {!data ? (
        <div className="text-center text-lg p-8">Loading...</div>
      ) : !loggedIn ? (
        <form
          onSubmit={handleLogin}
          className="bg-white text-black dark:bg-black dark:text-white p-8 rounded-lg shadow-lg flex flex-col gap-4 w-80 transition-colors"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="p-2 rounded bg-gray-100 border"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded bg-gray-100 border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="w-full max-w-4xl p-4">
          <h2 className="text-3xl font-bold text-center mb-8">Admin Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resume Upload Section */}
<div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border md:col-span-2 section-card">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Resume Upload</h3>
              <form
                onSubmit={handleResumeUpload}
                className="flex flex-col gap-2"
              >
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={() => {
                    const file = resumeInputRef.current?.files?.[0];
                    if (file) setSelectedResumeName(file.name);
                  }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    className="bg-blue-600 px-4 py-1 rounded text-white hover:bg-blue-700"
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    Choose File
                  </button>
                  <span className="text-gray-700">
                    {selectedResumeName || "No file chosen"}
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700"
                >
                  Upload Resume
                </button>
                <a
                  href="/kanishkumar-resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline mt-2"
                >
                  View Current Resume
                </a>
              </form>
            </div>
            {/* Home Section */}
<div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border section-card">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Home Section</h3>
              {edit.home ? (
                tempData && tempData.home ? (
                  <>
                    <label className="block mb-1 font-semibold">Greeting</label>
                    <input
                      className="w-full p-2 rounded mb-2 bg-gray-100 border"
                      value={tempData.home.greeting}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          home: { ...tempData.home, greeting: e.target.value }
                        })
                      }
                    />
                    <label className="block mb-1 font-semibold">Name</label>
                    <input
                      className="w-full p-2 rounded mb-2 bg-gray-100 border"
                      value={tempData.home.name}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          home: { ...tempData.home, name: e.target.value }
                        })
                      }
                    />
                    <label className="block mb-1 font-semibold">Intro</label>
                    <textarea
                      className="w-full p-2 rounded mb-2 bg-gray-100 border"
                      value={tempData.home.intro}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          home: { ...tempData.home, intro: e.target.value }
                        })
                      }
                    />
                    <label className="block mb-1 font-semibold">Text Color</label>
                    <input
                      type="color"
                      className="w-16 h-8 mb-2"
                      style={{ background: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
                      value={tempData.home.textColor}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          home: { ...tempData.home, textColor: e.target.value }
                        })
                      }
                    />
                    <div className="flex gap-2 mt-2">
                      <button className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700" onClick={() => handleSave("home")}>Save</button>
                      <button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={() => handleCancel("home")}>Cancel</button>
                      <button className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700" onClick={() => handleReset("home")}>Reset</button>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">No home data available.</div>
                )
              ) : (
                data && data.home ? (
                  <>
                    <div style={{ color: data.home.textColor }}>
                      <div><b>Greeting:</b> {data.home.greeting}</div>
                      <div><b>Name:</b> {data.home.name}</div>
                      <div><b>Intro:</b> {data.home.intro}</div>
                    </div>
                    <button className="bg-blue-600 px-4 py-1 rounded mt-2 text-white hover:bg-blue-700" onClick={() => handleEdit("home")}>Edit</button>
                  </>
                ) : (
                  <div className="text-gray-500">No home data available.</div>
                )
              )}
            </div>
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border">
              <h3 className="text-xl font-bold mb-2 text-blue-700">About Section</h3>
              {edit.about ? (
                <>
                  <label className="block mb-1 font-semibold">Description</label>
                  <textarea
                    className="w-full p-2 rounded mb-2 bg-gray-100 border"
                    value={tempData && tempData.about ? tempData.about.description : ""}
                    onChange={(e) =>
                      tempData && tempData.about && setTempData({
                        ...tempData,
                        about: { ...tempData.about, description: e.target.value }
                      })
                    }
                  />
                  <label className="block mb-1 font-semibold">Text Color</label>
                  <input
                    type="color"
                    className="w-16 h-8 mb-2"
                    style={{ background: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
                    value={tempData.about.textColor}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        about: { ...tempData.about, textColor: e.target.value }
                      })
                    }
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700" onClick={() => handleSave("about")}>Save</button>
                    <button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={() => handleCancel("about")}>Cancel</button>
                    <button className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700" onClick={() => handleReset("about")}>Reset</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ color: data.about.textColor }}>
                    <div>{data.about.description}</div>
                  </div>
                  <button className="bg-blue-600 px-4 py-1 rounded mt-2 text-white hover:bg-blue-700" onClick={() => handleEdit("about")}>Edit</button>
                </>
              )}
            </div>
            {/* Experience Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border md:col-span-2">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Experience Section</h3>
              {edit.experience ? (
    <div key={"experience-edit-" + (tempData && Array.isArray(tempData.experience) ? tempData.experience.length : 0)}>
      {(tempData && Array.isArray(tempData.experience) ? tempData.experience : []).map((exp: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow">
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={exp.title || ""}
                        placeholder="Title"
                        onChange={(e) => {
                          const updated = tempData.experience.map((x: any, i: number) =>
                            i === idx ? { ...x, title: e.target.value } : x
                          );
                          setTempData({ ...tempData, experience: updated });
                        }}
                      />
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={exp.company || ""}
                        placeholder="Company"
                        onChange={(e) => {
                          const updated = tempData.experience.map((x: any, i: number) =>
                            i === idx ? { ...x, company: e.target.value } : x
                          );
                          setTempData({ ...tempData, experience: updated });
                        }}
                      />
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={exp.duration || ""}
                        placeholder="Duration"
                        onChange={(e) => {
                          const updated = tempData.experience.map((x: any, i: number) =>
                            i === idx ? { ...x, duration: e.target.value } : x
                          );
                          setTempData({ ...tempData, experience: updated });
                        }}
                      />
                      <div className="w-full flex flex-col">
                        <button
                          type="button"
                          className="bg-gray-200 px-3 py-1 rounded hover:bg-blue-200 text-gray-800 mb-2 text-left"
                          onClick={() => openExpModal(idx)}
                        >
                          Show Description
                        </button>
                      </div>
                      <button className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700" onClick={() => {
                        setTempData({
                          ...tempData,
                          experience: tempData.experience.filter((_: any, i: number) => i !== idx)
                        });
                      }}>Remove</button>
                    </div>
                  ))}
                  <button className="bg-blue-600 px-4 py-1 rounded mb-2 text-white hover:bg-blue-700" onClick={() => {
                    setTempData({
                      ...tempData,
                      experience: [...(tempData.experience || []), { title: "", company: "", duration: "" }]
                    });
                  }}>Add Experience</button>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700" onClick={async () => {
                      if (!tempData) return;
if (!tempData.home) tempData.home = { greeting: "", name: "", intro: "", textColor: "" };
if (!tempData.about) tempData.about = { description: "", textColor: "" };
if (!tempData.skills) tempData.skills = [];
if (!tempData.experience) tempData.experience = [];
if (!tempData.projects) tempData.projects = [];
if (!tempData.blogs) tempData.blogs = [];
if (!tempData.publications) tempData.publications = [];
if (!tempData.contact) tempData.contact = { email: "", phone: "", linkedin: "", github: "", textColor: "" };
setDataState({
  home: tempData.home,
  about: tempData.about,
  skills: tempData.skills,
  experience: tempData.experience,
  projects: tempData.projects,
  blogs: tempData.blogs,
  publications: tempData.publications,
  contact: tempData.contact
});
                      setEdit({ ...edit, experience: false });
                      await fetch("/api/github-update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          filePath: "data/experience.json",
                          json: tempData.experience,
                          commitMessage: "Update experience.json via admin"
                        }),
                      });
                    }}>Save</button>
                    <button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={() => {
setEdit({ ...edit, experience: false });
                      setTempData({
                        ...tempData,
                        experience: [...data.experience],
                        home: tempData.home,
                        about: tempData.about,
                        skills: tempData.skills,
                        projects: tempData.projects,
                        blogs: tempData.blogs,
                        publications: tempData.publications,
                        contact: tempData.contact
                      });
                    }}>Cancel</button>
                    <button className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700" onClick={() => {
setTempData({
  ...tempData,
  experience: [],
  home: tempData.home,
  about: tempData.about,
  skills: tempData.skills,
  projects: tempData.projects,
  blogs: tempData.blogs,
  publications: tempData.publications,
  contact: tempData.contact
});
                    }}>Reset</button>
                  </div>
                </div>
              ) : (
                <>
    <ul>
      {(data && Array.isArray(data.experience) ? data.experience : []).map((exp: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>
                          {exp.title} at {exp.company} ({exp.duration})
                          {exp.description && <span className="block text-gray-600 text-sm">{exp.description}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button className="bg-blue-600 px-4 py-1 rounded mt-2 text-white hover:bg-blue-700" onClick={() => setEdit({ ...edit, experience: true })}>Edit</button>
                </>
              )}
            </div>
            {/* Projects Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border md:col-span-2">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Projects Section</h3>
              {edit.projects ? (
                <div key={"projects-edit-" + (tempData.projects?.length || 0)}>
                  {(tempData.projects || []).map((proj: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow">
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={proj.title || ""}
                        placeholder="Title"
                        onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                      />
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={proj.description || ""}
                        placeholder="Description"
                        onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                      />
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={proj.link || ""}
                        placeholder="Link"
                        onChange={(e) => handleProjectChange(idx, "link", e.target.value)}
                      />
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-semibold">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="p-2 rounded bg-gray-100 border"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Show preview
                              const reader = new FileReader();
                              reader.onload = ev => {
                                handleProjectChange(idx, "imagePreview", ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);

                              // Upload image immediately
                              const formData = new FormData();
                              formData.append("image", file);
                              formData.append("title", tempData.projects[idx].title || "project");
                              const res = await fetch("/api/projects/image", {
                                method: "POST",
                                body: formData,
                              });
                              const result = await res.json();
                              if (result.image) {
                                handleProjectChange(idx, "image", result.image);
                              }
                            }
                          }}
                        />
                        {proj.imagePreview && (
                          <img src={proj.imagePreview} alt="Preview" style={{ maxWidth: 120, borderRadius: 8, marginTop: 4 }} />
                        )}
                        {proj.image && !proj.imagePreview && (
                          <img src={proj.image} alt="Current" style={{ maxWidth: 120, borderRadius: 8, marginTop: 4 }} />
                        )}
                      </div>
                      <button className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700" onClick={() => handleRemoveProject(idx)}>Remove</button>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700"
                          onClick={async () => {
                            const proj = tempData.projects[idx];
                            if (proj.imageFile) {
                              const formData = new FormData();
                              // Only send fields relevant to the API
                              const { imageFile, imagePreview, ...rest } = proj;
                              formData.append("data", JSON.stringify(rest));
                              formData.append("image", proj.imageFile);
                              const res = await fetch("/api/projects", {
                                method: "POST",
                                body: formData,
                              });
                              const saved = await res.json();
                              // Update the project in tempData and data with ONLY the returned image path
                              const updatedProjects = tempData.projects.map((p: any, i: number) =>
                                i === idx
                                  ? {
                                      ...p,
                                      image: saved.image,
                                      imageFile: undefined,
                                      imagePreview: undefined,
                                    }
                                  : p
                              );
                              setTempData((prev: any) => ({
                                ...prev,
                                projects: updatedProjects,
                              }));
                              setDataState((prev: any) => ({
                                ...prev,
                                projects: updatedProjects,
                              }));
                              setEdit((prev: any) => ({
                                ...prev,
                                projects: false,
                              }));
                            } else {
                              await handleProjectsSave();
                            }
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="bg-blue-600 px-4 py-1 rounded mb-2 text-white hover:bg-blue-700" onClick={handleAddProject}>Add Project</button>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={handleProjectsCancel}>Cancel</button>
                    <button className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700" onClick={handleProjectsReset}>Reset</button>
                  </div>
                </div>
              ) : (
                <>
                  <ul>
                    {(data.projects || []).map((proj: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>
                          {proj.title} - {proj.description} (<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Link</a>)
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button className="bg-blue-600 px-4 py-1 rounded mt-2 text-white hover:bg-blue-700" onClick={handleProjectsEdit}>Edit</button>
                </>
              )}
            </div>
            {/* Blogs Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border md:col-span-2">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Blogs Section</h3>
              {edit.blogs ? (
                <div key={"blogs-edit-" + (tempData.blogs?.length || 0)}>
                  {(tempData.blogs || []).map((blog: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow">
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={blog.title || ""}
                        placeholder="Title"
                        onChange={(e) => handleBlogChange(idx, "title", e.target.value)}
                      />
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={blog.url || ""}
                        placeholder="URL"
                        onChange={(e) => handleBlogChange(idx, "url", e.target.value)}
                      />
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-semibold">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="p-2 rounded bg-gray-100 border"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) { return; }
                            // Show preview
                            const reader = new FileReader();
                            reader.onload = ev => {
                              handleBlogChange(idx, "imagePreview", ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                            // Upload image immediately
                            const formData = new FormData();
                            formData.append("image", file);
                            formData.append("title", tempData.blogs[idx]?.title || "blog");
                            const res = await fetch("/api/blogs/image", {
                              method: "POST",
                              body: formData,
                            });
                            const result = await res.json();
                            if (result.image) {
                              handleBlogChange(idx, "image", result.image);
                            } else if (result.error) {
                              alert("Image upload failed: " + (result.error.message || JSON.stringify(result.error)));
                            }
                            handleBlogChange(idx, "imageFile", file);
                          }}
                        />
                        {blog.image && blog.image.startsWith("/images/") && (
                          <img src={blog.image} alt="Blog" style={{ maxWidth: 120, borderRadius: 8, marginTop: 4 }} />
                        )}
                      </div>
                      <button className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700" onClick={() => handleRemoveBlog(idx)}>Remove</button>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700"
                          disabled={
                            !(tempData.blogs[idx]?.image && tempData.blogs[idx].image.startsWith("/images/"))
                          }
                          title={
                            !(tempData.blogs[idx]?.image && tempData.blogs[idx].image.startsWith("/images/"))
                              ? "Please upload an image before saving."
                              : undefined
                          }
                          onClick={async () => {
                            const blog = tempData.blogs[idx];
                            if (!(blog.image && blog.image.startsWith("/images/"))) {
                              alert("Please upload an image before saving.");
                              return;
                            }
                            // Remove imageFile and imagePreview before saving
                            const updatedBlogs = tempData.blogs.map((b: any, i: number) =>
                              i === idx ? { ...b } : b
                            ).map((b: any) => {
                              const { imageFile, imagePreview, ...rest } = b;
                              return rest;
                            });
                            setTempData({
                              ...tempData,
                              blogs: updatedBlogs,
                              home: tempData.home ?? { greeting: "", name: "", intro: "", textColor: "" },
                              about: tempData.about ?? { description: "", textColor: "" },
                              skills: tempData.skills ?? [],
                              experience: tempData.experience ?? [],
                              projects: tempData.projects ?? [],
                              publications: tempData.publications ?? [],
                              contact: tempData.contact ?? { email: "", phone: "", linkedin: "", github: "", textColor: "" }
                            });
                            setDataState({
                              home: data.home ?? { greeting: "", name: "", intro: "", textColor: "" },
                              about: data.about ?? { description: "", textColor: "" },
                              skills: data.skills ?? [],
                              experience: data.experience ?? [],
                              projects: data.projects ?? [],
                              blogs: updatedBlogs,
                              publications: data.publications ?? [],
                              contact: data.contact ?? { email: "", phone: "", linkedin: "", github: "", textColor: "" }
                            });
                            setEdit({ ...edit, blogs: false });
                            // Update blogs.json via GitHub
                            await fetch("/api/github-update", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                filePath: "data/blogs.json",
                                json: updatedBlogs,
                                commitMessage: "Update blogs.json via admin"
                              }),
                            });
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="bg-blue-600 px-4 py-1 rounded mb-2 text-white hover:bg-blue-700" onClick={handleAddBlog}>Add Blog</button>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={handleBlogsCancel}>Cancel</button>
                    <button className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700" onClick={handleBlogsReset}>Reset</button>
                  </div>
                </div>
              ) : (
                <>
                  <ul>
                    {(data.blogs || []).map((blog: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>
                          {blog.title} (<a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">URL</a>)
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button className="bg-blue-600 px-4 py-1 rounded mt-2 text-white hover:bg-blue-700" onClick={handleBlogsEdit}>Edit</button>
                </>
              )}
            </div>
            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border md:col-span-2">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Skills Section</h3>
              {edit.skills ? (
                <div key={"skills-edit-" + tempData.skills.length}>
                  {tempData.skills.map((skill: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        className="p-2 rounded bg-gray-100 border"
                        value={tempData && tempData.skills && tempData.skills[idx] ? tempData.skills[idx].name : ""}
                        placeholder="Skill Name"
                        onChange={(e) => tempData && tempData.skills && handleSkillChange(idx, "name", e.target.value)}
                      />
                      <select
                        className="p-2 rounded bg-gray-100 border"
                        value={tempData && tempData.skills && tempData.skills[idx] ? tempData.skills[idx].icon : ""}
                        onChange={(e) => tempData && tempData.skills && handleSkillChange(idx, "icon", e.target.value)}
                      >
                        {SKILL_ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700" onClick={() => handleRemoveSkill(idx)}>Remove</button>
                    </div>
                  ))}
                  <button className="bg-blue-600 px-4 py-1 rounded mb-2 text-white hover:bg-blue-700" onClick={handleAddSkill}>Add Skill</button>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700" onClick={handleSkillsSave}>Save</button>
                    <button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={handleSkillsCancel}>Cancel</button>
                    <button className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700" onClick={handleSkillsReset}>Reset</button>
                  </div>
                </div>
              ) : (
                <>
                  <ul>
                    {data.skills.map((skill: any, idx: number) => (
                      <li key={typeof skill === "string" ? skill : (skill.name || idx)} className="flex items-center gap-2">
                        <span>{typeof skill === "string" ? "" : skill.icon}</span>
                        <span>{typeof skill === "string" ? skill : skill.name}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="bg-blue-600 px-4 py-1 rounded mt-2 text-white hover:bg-blue-700"
                    style={{background: "orange", color: "black"}}
                    tabIndex={0}
                    onClick={handleSkillsEdit}
                  >Edit</button>
                </>
              )}
            </div>
            {/* Contact Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border">
              <h3 className="text-xl font-bold mb-2 text-blue-700">Contact Section</h3>
              {edit.contact ? (
                <>
                  <label className="block mb-1 font-semibold">Email</label>
                  <input
                    className="w-full p-2 rounded mb-2 bg-gray-100 border"
                    value={tempData.contact.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                  />
                  <label className="block mb-1 font-semibold">Phone</label>
                  <input
                    className="w-full p-2 rounded mb-2 bg-gray-100 border"
                    value={tempData.contact.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                  />
                  <label className="block mb-1 font-semibold">LinkedIn</label>
                  <input
                    className="w-full p-2 rounded mb-2 bg-gray-100 border"
                    value={tempData.contact.linkedin}
                    onChange={(e) => handleContactChange("linkedin", e.target.value)}
                  />
                  <label className="block mb-1 font-semibold">GitHub</label>
                  <input
                    className="w-full p-2 rounded mb-2 bg-gray-100 border"
                    value={tempData.contact.github}
                    onChange={(e) => handleContactChange("github", e.target.value)}
                  />
                  <label className="block mb-1 font-semibold">Text Color</label>
                  <input
                    type="color"
                    className="w-16 h-8 mb-2"
                    style={{ background: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
                    value={tempData.contact.textColor}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        contact: { ...tempData.contact, textColor: e.target.value }
                      })
                    }
                  />
                  <div className="flex gap-2 mt-2">
<button className="bg-green-600 px-4 py-1 rounded text-white hover:bg-green-700" onClick={async () => {
  if (!data || !tempData) return;
  setDataState({
    ...data,
    contact: tempData.contact,
    home: tempData.home,
    about: tempData.about,
    skills: tempData.skills,
    experience: tempData.experience,
    projects: tempData.projects,
    blogs: tempData.blogs,
    publications: tempData.publications
  });
  setEdit({ ...edit, contact: false });
  await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tempData.contact),
  });
}}>Save</button>
<button className="bg-gray-600 px-4 py-1 rounded text-white hover:bg-gray-700" onClick={() => {
  setEdit({ ...edit, contact: false });
  if (!data) return;
  setTempData({
    ...data,
    contact: { ...data.contact },
    home: data.home,
    about: data.about,
    skills: data.skills,
    experience: data.experience,
    projects: data.projects,
    blogs: data.blogs,
    publications: data.publications
  });
}}>Cancel</button>
<button className="bg-red-600 px-4 py-1 rounded text-white hover:bg-red-700" onClick={() => {
  if (!data) return;
  setTempData({
    ...data,
    contact: { ...data.contact },
    home: data.home,
    about: data.about,
    skills: data.skills,
    experience: data.experience,
    projects: data.projects,
    blogs: data.blogs,
    publications: data.publications
  });
}}>Reset</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {data.contact.email && (
                      <a
                        href={`mailto:${data.contact.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Email: {data.contact.email}
                      </a>
                    )}
                    {data.contact.phone && (
                      <a
                        href={`tel:${data.contact.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Phone: {data.contact.phone}
                      </a>
                    )}
                    {data.contact.linkedin && (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    )}
                    {data.contact.github && (
                      <a
                        href={data.contact.github.startsWith("http") ? data.contact.github : `https://${data.contact.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                  <button className="bg-blue-600 px-4 py-1 rounded mt-2 text-white hover:bg-blue-700" onClick={() => handleEdit("contact")}>Edit</button>
                </>
              )}
            </div>
            {/* TODO: Add Experience, Projects, Blogs, Publications, etc. in similar fashion */}
          </div>
        </div>
      )}
    </div>
  );
}

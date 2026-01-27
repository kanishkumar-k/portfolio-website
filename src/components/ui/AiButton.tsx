import React, { useState } from "react";
import Switch from "@mui/material/Switch";

const switchSx = {
  width: 42,
  height: 26,
  minWidth: 42,
  minHeight: 26,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 0,
    top: 0,
    left: 0,
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    transform: "translateX(16px)",  
  },
  "& .MuiSwitch-switchBase + .MuiSwitch-track": {
    minWidth: 42,
    minHeight: 26,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#2563eb", // blue-600
    opacity: 1,
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#d1d5db", // gray-300
    opacity: 1,
    borderRadius: 13,
    minWidth: 20,
    minHeight: 26,
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#fff",
    width: 26,
    height: 26,
    boxSizing: "border-box",
    top: "50%",
    transform: "translateY(0%)",
  },
};

import { useTheme } from "./ThemeProvider";
import { useUiPanel } from "./UiPanelContext";


function generateSimpleSubject(body: string): string {
  // Remove punctuation, split into words
  const stopwords = new Set([
    "the", "and", "for", "with", "that", "this", "from", "your", "you", "are", "but", "not", "have", "has", "will", "can", "all", "any", "our", "out", "was", "were", "had", "been", "to", "of", "in", "on", "at", "by", "an", "a", "is", "it", "as", "be", "or", "if", "so", "we", "i", "my", "me", "us", "do", "does", "did", "about", "just", "more", "no", "yes", "up", "down", "over", "under", "after", "before", "now", "then", "too", "very", "also", "into", "than", "who", "what", "when", "where", "why", "how"
  ]);
  const words = body
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 0);
  const significant = words.filter(w => !stopwords.has(w.toLowerCase()));
  return significant.slice(0, 4).join(" ") || words.slice(0, 4).join(" ");
}

const AiButton: React.FC = () => {
  const [from, setFrom] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState(false); // false = manual, true = AI
  const [submitted, setSubmitted] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

const { theme } = useTheme(); // Get theme context
const isDark = theme === "dark"; // Determine if dark mode is active
const { openPanel, setOpenPanel } = useUiPanel();
const open = openPanel === "email";

  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    if (open) {
      setOpenPanel("none");
    } else {
      setOpenPanel("email");
      setSubmitted(false);
      setFrom("");
      setSubject("");
      setBody("");
      setAiGenerated(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, subject, body }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setOpenPanel("none");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send email");
      }
    } catch {
      setError("Failed to send email");
    }
  };

  // Theme-based styles
  const buttonColor =
    isDark
      ? "bg-[#ec4899] text-white hover:bg-[#f472b6]"
      : "bg-[#fbbf24] text-black hover:bg-[#fde68a]";
  const inputColor =
    isDark
      ? "bg-[#23272f] text-white border-[#b3c0f7]"
      : "bg-gray-100 text-black border-[#b3c0f7]";
  const labelColor = isDark ? "#b3c0f7" : "#23272f";
  const formBg = isDark
    ? "bg-[#10131a] border-[#b3c0f7] text-white"
    : "bg-white border-[#b3c0f7] text-black";

  // AI submit icon handler
  function handleGenerateAI() {
    setAiLoading(true);
    setAiError(null);
fetch("/api/generate-email-body", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ subject, context: subject }),
})
  .then(async (res) => {
    const data = await res.json();
    if (res.ok && data.body) {
      setBody(data.body);
      // Generate a simple subject from the body (2-4 words)
      const simpleSubject = generateSimpleSubject(data.body);
      setSubject(simpleSubject);
      setAiGenerated(true);
    } else {
      setAiError(data.error || "Failed to generate email body");
    }
  })
  .catch(() => setAiError("Failed to generate email body"))
  .finally(() => setAiLoading(false));
  }

  // Render different modal for mobile vs desktop
  return (
    <>
      <button
        className={`w-10 h-10 p-2 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${buttonColor}`}
        style={{ minWidth: 40, minHeight: 40 }}
        aria-label={open ? "Close Email" : "Send Email"}
        title="Send email"
        onClick={handleToggle}
        type="button"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path
            d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.4-.5 7.6 6.2L19.6 6M20 7.3l-7.2 5.9a1 1 0 0 1-1.3 0L4 7.3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <>
          {/* Mobile full-page modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center md:hidden bg-white dark:bg-[#10131a]">
            <div
              className={`w-full h-full flex flex-col justify-center items-center px-4 py-6 ${formBg}`}
              style={{
                minHeight: "100vh",
                minWidth: "100vw",
                borderRadius: 0,
                boxShadow: "none",
                position: "relative",
              }}
            >
              {/* Close (X) button for mobile */}
              <button
                className={`absolute top-4 right-4 z-50 p-2 rounded-full shadow-lg transition-all
                  ${isDark ? "bg-[#23272f] text-white hover:bg-[#181c23]" : "bg-gray-200 text-black hover:bg-gray-300"}`}
                onClick={() => setOpenPanel("none")}
                type="button"
                aria-label="Close"
                style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M7 7l14 14M7 21L21 7" stroke={isDark ? "#fff" : "#222"} strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
              <h3
                className="text-2xl font-bold mb-6 text-center"
                style={{ color: isDark ? "#f472b6" : "#23272f" }}
              >
                Get in Touch
              </h3>
              <form
                className="flex flex-col gap-5 w-full max-w-md mx-auto"
                onSubmit={handleSubmit}
                style={{ alignItems: "center" }}
              >
                <div className="w-full">
                  <label
                    className="block text-base font-medium mb-1"
                    style={{ color: labelColor }}
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded ${inputColor}`}
                    placeholder="your@email.com"
                  />
                </div>
                {!aiMode && (
                  <div className="w-full">
                    <label
                      className="block text-base font-medium mb-1"
                      style={{ color: labelColor }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className={`w-full px-3 py-2 border rounded ${inputColor}`}
                      placeholder="Subject"
                    />
                  </div>
                )}
                <div className="w-full">
<div className="flex items-center justify-between mb-2" style={{ minHeight: 32 }}>
  <label
    className="block text-base font-medium"
    style={{ color: labelColor }}
    htmlFor="ai-body-switch"
  >
    {aiMode ? "What do you want to say?" : "Body"}
  </label>
  <div className="flex items-center gap-2">
    {/* Manual mode label, color from theme context */}
    <span
      className="text-sm font-semibold"
      style={{
        minWidth: 48,
        textAlign: "right",
        color: isDark ? "#fff" : "#000"
      }}
    >
      Manual
    </span>
    <Switch
      id="ai-body-switch"
      checked={aiMode}
      onChange={(e) => {
        const checked = e.target.checked;
        setAiMode(checked);
        setAiError(null);
        // Do not trigger AI generation here; only enable AI mode.
      }}
      disabled={aiLoading}
      inputProps={{ "aria-label": "Enable AI email draft" }}
      sx={switchSx}
    />
    {/* AI mode label, color from theme context */}
    <span
      className="text-sm font-semibold"
      style={{
        minWidth: 32,
        textAlign: "left",
        color: isDark ? "#fff" : "#000"
      }}
    >
      AI
    </span>
  </div>
</div>
                  {aiMode ? (
                    <>
                      <div className="relative mb-2">
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                          className={`w-full px-3 py-2 border rounded ${inputColor} pr-10`}
                          placeholder="Describe the email you want to send"
                          disabled={aiLoading}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleGenerateAI();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors
                            ${aiLoading || !subject.trim()
                              ? "bg-blue-300 text-white cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"}
                          `}
                          style={{ border: "none" }}
                          onClick={handleGenerateAI}
                          disabled={aiLoading || !subject.trim()}
                          tabIndex={0}
                          aria-label="Generate AI Output"
                        >
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                            <path d="M3 12h13M14 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      {aiGenerated && (
                        <div className="mb-2">
                          <label className="block text-base font-medium mb-1" style={{ color: labelColor }}>
                            Subject (editable)
                          </label>
                          <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className={`w-full px-3 py-2 border rounded ${inputColor} bg-opacity-60`}
                            placeholder="Edit subject"
                          />
                        </div>
                      )}
                      <label className="block text-base font-medium mb-1" style={{ color: labelColor }}>
                        Suggested Email
                      </label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded min-h-[100px] max-h-30 overflow-y-auto ${inputColor}`}
                        placeholder="AI generated email draft will appear here"
                        disabled={aiLoading || !body}
                      />
                      {aiLoading && (
                        <div className="text-blue-600 text-xs mt-1">Generating with AI...</div>
                      )}
                      {aiError && (
                        <>
                          <div className="text-red-600 text-xs mt-1">{aiError}</div>
                          {aiError.includes("API Key not set") && (
                            <div className="mt-2">
                              <div className="text-sm font-semibold mb-1">Alternative subject suggestions:</div>
                              <ul className="list-disc pl-5 text-xs text-gray-700 dark:text-gray-200">
                                <li onClick={() => setSubject("Quick Update")} className="cursor-pointer hover:underline">Quick Update</li>
                                <li onClick={() => setSubject("Project Status")} className="cursor-pointer hover:underline">Project Status</li>
                                <li onClick={() => setSubject("Meeting Request")} className="cursor-pointer hover:underline">Meeting Request</li>
                                <li onClick={() => setSubject("Feedback Needed")} className="cursor-pointer hover:underline">Feedback Needed</li>
                              </ul>
                              <div className="text-sm font-semibold mt-2 mb-1">Alternative body suggestions:</div>
                              <ul className="list-disc pl-5 text-xs text-gray-700 dark:text-gray-200">
                                <li onClick={() => setBody("Just wanted to share a quick update regarding our recent progress.")} className="cursor-pointer hover:underline">Just wanted to share a quick update regarding our recent progress.</li>
                                <li onClick={() => setBody("Can we schedule a meeting to discuss the next steps?")} className="cursor-pointer hover:underline">Can we schedule a meeting to discuss the next steps?</li>
                                <li onClick={() => setBody("Please review the attached document and provide your feedback.")} className="cursor-pointer hover:underline">Please review the attached document and provide your feedback.</li>
                                <li onClick={() => setBody("Let me know if you have any questions or concerns.")} className="cursor-pointer hover:underline">Let me know if you have any questions or concerns.</li>
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded min-h-[100px] max-h-30 overflow-y-auto ${inputColor}`}
                        placeholder="Type your message here..."
                        disabled={aiLoading}
                      />
                      {aiLoading && (
                        <div className="text-blue-600 text-xs mt-1">Generating with AI...</div>
                      )}
                      {aiError && (
                        <div className="text-red-600 text-xs mt-1">{aiError}</div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-row gap-4 w-full mt-2">
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-lg font-semibold bg-red-200 text-red-800 hover:bg-red-300 transition-all"
                    onClick={() => {
                      setFrom("");
                      setSubject("");
                      setBody("");
                      setAiGenerated(false);
                      setAiError(null);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg font-semibold bg-green-200 text-green-800 hover:bg-green-300 transition-all"
                    disabled={submitted}
                  >
                    {submitted ? "Sent!" : "Send"}
                  </button>
                </div>
                {submitted && (
                  <div className="text-green-600 text-center mt-2">Message sent!</div>
                )}
                {error && (
                  <div className="text-red-600 text-center mt-2">{error}</div>
                )}
              </form>
            </div>
          </div>
          {/* Desktop floating panel */}
          <div
            className="hidden md:flex fixed right-6 bottom-28 z-50 flex-col items-end"
            style={{ minWidth: 340, maxWidth: 400 }}
          >
            <div
              className={`
                rounded-xl shadow-lg px-4 py-2 border
                transition-all duration-300 ease-out
                ${formBg}
              `}
              style={{
                minWidth: 320,
                maxWidth: 380,
                width: "100%",
                boxShadow: "0 2px 16px 0 rgba(0,0,0,0.18)",
                borderRadius: "1.25rem",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className="text-xl font-bold mb-2 text-center"
                style={{ color: isDark ? "#f472b6" : "#23272f" }}
              >
                Get in Touch
              </h3>
              <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: labelColor }}
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded ${inputColor}`}
                    placeholder="your@email.com"
                  />
                </div>
                {!aiMode && (
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: labelColor }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className={`w-full px-3 py-2 border rounded ${inputColor}`}
                      placeholder="Subject"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ minHeight: 32 }}>
                    <label
                      className="block text-sm font-medium"
                      style={{ color: labelColor }}
                      htmlFor="ai-body-switch-desktop"
                    >
                      {aiMode ? "What do you want to say?" : "Body"}
                    </label>
                    <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        minWidth: 48,
                        textAlign: "right",
                        color: isDark ? "#ffffff" : "#000"
                      }}
                    >
                      Manual
                    </span>
                      <Switch
                        id="ai-body-switch-desktop"
                        checked={aiMode}
onChange={(e) => {
  const checked = e.target.checked;
  setAiMode(checked);
  setAiError(null);
  // Do not trigger AI generation here; only enable AI mode.
}}
                        disabled={aiLoading}
                        inputProps={{ "aria-label": "Enable AI email draft" }}
                        sx={switchSx}
                      />
{/* AI mode label, color from theme context */}
<span
  className="text-sm font-semibold"
  style={{
    minWidth: 32,
    textAlign: "left",
    color: isDark ? "#fff" : "#000"
  }}
>
  AI
</span>
                    </div>
                  </div>
                  {aiMode ? (
                    <>
                      <div className="relative mb-2">
                        {!aiGenerated ? (
                          <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className={`w-full px-3 py-4 border rounded pr-10 ${inputColor}`}
                            placeholder="Describe the email body"
                            disabled={aiLoading}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                setAiLoading(true);
                                setAiError(null);
                                fetch("/api/generate-email-body", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ subject, context: subject }),
                                })
                                  .then(async (res) => {
                                    const data = await res.json();
                                    if (res.ok && data.body) {
                                      setBody(data.body);
                                      // Generate a simple subject from the body (2-4 words)
                                      const simpleSubject = generateSimpleSubject(data.body);
                                      setSubject(simpleSubject);
                                      setAiGenerated(true);
                                    } else {
                                      setAiError(data.error || "Failed to generate email body");
                                    }
                                  })
                                  .catch(() => setAiError("Failed to generate email body"))
                                  .finally(() => setAiLoading(false));
                              }
                            }}
                          />
                        ) : (
                          <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className={`w-full px-3 py-4 border rounded pr-10 ${inputColor} bg-opacity-60`}
                            placeholder="Edit subject"
                          />
                        )}
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                          style={{ background: "none", border: "none" }}
                          onClick={() => {
                            handleGenerateAI();
                            setAiGenerated(true);
                          }}
                          disabled={aiLoading || !subject.trim()}
                          tabIndex={0}
                          aria-label="Generate AI Output"
                        >
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                            <path d="M3 12h13M14 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      <label className="block text-base font-medium mb-1" style={{ color: labelColor }}>
                        Suggested Email
                      </label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded min-h-[100px] max-h-30 overflow-y-auto ${inputColor}`}
                        placeholder="AI generated email draft will appear here"
                        disabled={aiLoading || !body}
                      />
                      {aiLoading && (
                        <div className="text-blue-600 text-xs mt-1">Generating with AI...</div>
                      )}
                      {aiError && (
                        <div className="text-red-600 text-xs mt-1">{aiError}</div>
                      )}
                    </>
                  ) : (
                    <>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        className={`w-full px-3 py-2 border rounded min-h-[100px] max-h-30 overflow-y-auto ${inputColor}`}
                        placeholder="Type your message here..."
                        disabled={aiLoading}
                      />
                      {aiLoading && (
                        <div className="text-blue-600 text-xs mt-1">Generating with AI...</div>
                      )}
                      {aiError && (
                        <div className="text-red-600 text-xs mt-1">{aiError}</div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-row gap-4 mt-2">
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-lg font-semibold bg-red-200 text-red-800 hover:bg-red-300 transition-all"
                    onClick={() => {
                      setFrom("");
                      setSubject("");
                      setBody("");
                      setAiGenerated(false);
                      setAiError(null);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg font-semibold bg-green-200 text-green-800 hover:bg-green-300 transition-all"
                    disabled={submitted}
                  >
                    {submitted ? "Sent!" : "Send"}
                  </button>
                </div>
                {submitted && (
                  <div className="text-green-600 text-center mt-2">Message sent!</div>
                )}
                {error && (
                  <div className="text-red-600 text-center mt-2">{error}</div>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AiButton;

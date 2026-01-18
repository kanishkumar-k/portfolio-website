"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ContactInfo = {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  name?: string;
  textColor?: string;
};

const ContactSection: React.FC = () => {
  const [contact, setContact] = useState<ContactInfo>({});

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => setContact(data))
      .catch(() => setContact({}));
  }, []);

  return (
    <section
      id="contact"
      className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      <motion.div
        className="section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)]">Contact</h2>
        <div className="flex flex-col items-center justify-center gap-4">
          {contact.name && (
            <div className="text-xl text-white font-semibold mb-2">{contact.name}</div>
          )}
          <div className="text-lg mb-4" style={{ color: "var(--foreground)" }}>
            Connect with me on:
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-base">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="contact-pill"
                style={{
                  borderColor: "#f9949c",
                  color: "#f9949c",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Email
              </a>
            )}
            {contact.phone && (
              <PhoneReveal phone={contact.phone} />
            )}
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                className="contact-pill"
                style={{
                  borderColor: "#94d6f9",
                  color: "#94d6f9",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}
            {contact.github && (
              <a
                href={contact.github}
                className="contact-pill"
                style={{
                  borderColor: "#d477b7",
                  color: "#d477b7",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/**
 * PhoneReveal: reveals phone number on hover or tap, does not call.
 */
function PhoneReveal({ phone }: { phone: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (revealed) {
      try {
        await navigator.clipboard.writeText(phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        // fallback: do nothing
      }
    } else {
      setRevealed(true);
    }
  };

  return (
    <span
      className="contact-pill cursor-pointer select-none"
      style={{
        borderColor: "#60ecc2",
        color: "#60ecc2",
        position: "relative",
        minWidth: 80,
        textAlign: "center",
        userSelect: revealed ? "text" : "none",
      }}
      tabIndex={0}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => { setRevealed(false); setCopied(false); }}
      onFocus={() => setRevealed(true)}
      onBlur={() => { setRevealed(false); setCopied(false); }}
      onClick={handleCopy}
      aria-label={revealed ? phone : "Show phone number"}
      title={revealed ? "Click to copy" : "Show phone number"}
    >
      {revealed ? (
        <>
          {phone}
          {copied && (
            <span
              style={{
                position: "absolute",
                top: "-1.8em",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#23272f",
                color: "#60ecc2",
                padding: "2px 10px",
                borderRadius: "8px",
                fontSize: "0.9em",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.12)",
                zIndex: 10,
                whiteSpace: "nowrap",
              }}
            >
              Copied!
            </span>
          )}
        </>
      ) : (
        "Phone"
      )}
    </span>
  );
}

export default ContactSection;

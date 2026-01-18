"use client";
import React from "react";
import Navbar from "./Navbar";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div>{children}</div>
    </>
  );
}

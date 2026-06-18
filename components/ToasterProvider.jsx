// components/ToasterProvider.jsx
"use client";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export default function ToasterProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toaster
      toastOptions={{
        style: {
          background: "#1a0f0d",
          color: "#fff",
          border: "0.5px solid rgba(201,123,99,0.3)",
        },
      }}
      position="top-right"
    />
  );
}

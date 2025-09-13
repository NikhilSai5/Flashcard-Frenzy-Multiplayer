"use client";

import { useEffect, useState } from "react";

export default function Announcements({ message }) {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      const timeout = setTimeout(() => setAnnouncement(""), 500);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div role="status" aria-live="assertive" className="sr-only">
      {announcement}
    </div>
  );
}

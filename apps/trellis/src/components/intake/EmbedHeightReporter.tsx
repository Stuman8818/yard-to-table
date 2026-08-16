"use client";

import { useEffect } from "react";

export function EmbedHeightReporter() {
  useEffect(() => {
    const reportHeight = () => {
      window.parent.postMessage(
        { type: "trellis:intake-resize", height: document.documentElement.scrollHeight },
        "*",
      );
    };
    const observer = new ResizeObserver(reportHeight);

    observer.observe(document.documentElement);
    reportHeight();

    return () => observer.disconnect();
  }, []);

  return null;
}

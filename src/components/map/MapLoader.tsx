"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` at import time, so this must never run during SSR.
const ProjectsMapExperience = dynamic(
  () => import("./ProjectsMapExperience"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: "fixed",
          inset: 0,
          height: "100vh",
          zIndex: 2000,
          background: "#fff",
        }}
      />
    ),
  },
);

export default function MapLoader() {
  return <ProjectsMapExperience />;
}

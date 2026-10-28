"use client";

import dynamic from "next/dynamic";
import type { ProjectMapSummary } from "@/lib/mock-projects";

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

export default function MapLoader({
  projects,
  searchHeading,
  searchLead,
  startingNote,
}: {
  projects: ProjectMapSummary[];
  searchHeading: string;
  searchLead: string;
  startingNote: string;
}) {
  return (
    <ProjectsMapExperience
      projects={projects}
      searchHeading={searchHeading}
      searchLead={searchLead}
      startingNote={startingNote}
    />
  );
}

"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` at import time, so this must never run during SSR.
const ProjectMiniMap = dynamic(() => import("./ProjectMiniMap"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: 160 }} />,
});

export default function ProjectMiniMapLoader(props: {
  latitude: number;
  longitude: number;
  label: string;
}) {
  return <ProjectMiniMap {...props} />;
}
